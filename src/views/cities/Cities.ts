import { mapState } from "vuex";
import { useDisplay } from 'vuetify';
import axios from 'axios';
import { mapGetters } from 'vuex';

export default {
    name: 'CitiesView',
    computed: {
        ...mapState({
            cities() {
                return this.$store.state.cities.citiesList
            }
        }),
        ...mapState({
            capitals() {
                return this.$store.state.capitals.capitalList
            },
        }),
        ...mapState({
            attractions() {
                return this.$store.state.attractions.attractionList
            }
        }),
        ...mapGetters('capitals', ['capitalsLoaded']), // Map the capitalsLoaded getter

        // ...mapState('cities', {
        //     cities: state => state.citiesList // if 'cities' is a namespaced module
        //   }),
        // ...mapState('capitals', {
        // capitals: function (state) {
        //     console.log("Computed capitals:", state.capitalList);
        //     return state.capitalList;
        // }
        // }),
        attractionItems() {
            console.log("Attractions:", this.attractions);
            return this.attractions.map(attraction => ({
                text: attraction.name,
                value: attraction.id
            }));
        },
        sortedCities() {
            // Sort the cities list alphabetically by name
            return this.$store.state.cities.citiesList.slice().sort((a, b) => {
                // Assuming 'name' is the property to sort by
                return a.name.localeCompare(b.name);
            });
        },
        capitalCities() {
            const capitalcities = this.capitals.map(capital => ({
                text: capital.name,
                value: capital.id
            }));
            // console.log(capitalcities);  // Check the output structure
            return capitalcities;



            // ...mapState({
            //     cities() {
            //         return this.$store.state.cities.citiesList
            //     }
            // }),
            // ...mapState({
            //     capitals() {
            //         return this.$store.state.capitals.capitalList
            //     }
            // }),
            // capitalCities() {
            //     const formatted = this.capitals.map(capital => ({
            //         text: capital.name,
            //         value: capital.id
            //       }));
            //       console.log(formatted);
            //       return formatted;
        }
    },
    setup() {
        const { xs, mdAndUp } = useDisplay()

        return { xs, mdAndUp }

    },
    data: function () {
        return {

            editCity: {},
            selectedDeleteCity: null,
            newCity: {
                name: '',
                description: '',
                // inventory_total_qty: 1,
                file: '',
                capital_id: null,
                attraction_ids: []
            },

            editCityErrorMessage: null,
            newCityErrorMessage: null,


            createCityDialog: false,
            deleteCityDialog: false,
            editCityDialog: false,

            editFileChangeDialogBtn: false,

            cityIsUpdating: false,
            cityIsDeleting: false,
            cityIsCreating: false,
            isLoadingCities: true,
            isLoadingCapitals: true,

            options: []
        }
    },
    created() {
        // this.getCities();
        this.$store.dispatch('cities/getCities').then(() => {
            console.log('Cities in Vuex store:', this.$store.state.cities.citiesList);
        }).catch(error => {
            console.error('Error fetching cities:', error);
        });
        // this.getCapitals();
        // this.$store.dispatch('cities/getCities');
        this.$store.dispatch('capitals/getCapitals');
        this.$store.dispatch('attractions/getAttractions');
        // this.$store.dispatch('attractions/getAttractions').then(() => {
        //     console.log("Attractions:", this.attractions);
        // });

    },
    watch: {
        capitalsLoaded(value) {
            // Optionally, you can log the value for debugging purposes
            console.log('Capitals loaded:', value);
            // No need to call this.loadData() if you don't have any data to load
        }
    },
    methods: {
        getCities() {
            this.$store.dispatch("cities/getCities")
                .then(() => {
                    this.isLoadingCities = false;
                })
        },
        // getCapitals() {
        //     this.$store.dispatch("capitals/getCapitals")
        //         .then(() => {
        //             this.isLoadingCapitals = false;
        //         })
        // },
        openDeleteCityDialog(city) {
            this.selectedDeleteCity = city;
            this.deleteCityDialog = true;
        },
        openEditCityDialog(city) {
            // this.editCity = city;
            console.log('City being edited:', city);
    this.editCity = {
        ...city,
        attraction_ids: city.attractions.map(a => a.id), // Ensure this is set correctly
    };
    if(city.capital && city.capital.id) {
        this.editCity.capital_id = city.capital.id; // Ensuring that capital_id is set from city.capital.id
    }
    console.log('Edit city data:', this.editCity);
    this.editCityDialog = true;
        },
        openCreateDialog() {
            this.newCity = {
                name: '',
                description: '',
                //    inventory_total_qty: 1,
                file: '',
                capital_id: null,
                attraction_ids: [],
            };
            // this.getCapitals();
            console.log("newCity.capital_id:", this.newCity.capital_id);
            console.log("Items:", this.items);
            this.createCityDialog = true;
        },
        closeCreateDialog() {
            this.newCity = {
                name: '',
                description: '',
                // inventory_total_qty: 1,
                file: ''
            };
            this.createCityDialog = false;
        },
        createCity() {
            this.cityIsCreating = true;
            this.newCityErrorMessage = null;
            this.$store.dispatch("cities/createCity", this.newCity)
                .then(() => {
                    this.closeCreateDialog();
                    this.cityIsCreating = false;
                    this.$store.dispatch('capitals/getCapitals');
                    this.$store.dispatch('attractions/getAttractions');
                    // this.forceRerender(); 
                })
                .catch((error) => {
                    this.newCityErrorMessage = error.response.data.data;
                    this.cityIsCreating = false;
                })
        },
        updateCity() {
            this.cityIsUpdating = true;
            this.editCityErrorMessage = null;
            this.$store.dispatch("cities/updateCity", this.editCity)
                .then(() => {
                    this.editCityDialog = false;
                    this.editFileChangeDialogBtn = false;
                    this.editCity = {};
                    this.cityIsUpdating = false;
                })
                .catch((error) => {
                    this.editCityErrorMessage = error.response.data.data;
                    this.cityIsUpdating = false;
                })
        },
        deleteCity() {
            this.cityIsDeleting = true;
            this.deleteCityErrorMessage = null;
            this.$store.dispatch("cities/deleteCity", this.selectedDeleteCity)
                .then(() => {
                    this.selectedDeleteCity = false;
                    this.cityIsDeleting = false;
                    this.deleteCityDialog = false;
                    // this.forceRerender(); // Call forceRerender() after successful deletion
                })
                .catch((error) => {
                    this.deleteCityErrorMessage = error.response.data.data;
                    this.cityIsDeleting = false;
                })
        },
        onExistingCityPictureChange(e) {
            var image = e.target.files || e.dataTransfer.files;
            if (!image.length)
                return;

            this.editCity.file = image[0];
            this.cityIsUpdating = true;
            this.$store.dispatch("cities/updateCityPicture", this.editCity)
                .then(() => {
                    this.cityIsUpdating = false;
                })
                .catch((error) => {
                    this.editCityErrorMessage = error.response.data.data;
                    this.cityIsUpdating = false;
                })
        },

        onNewCityFileChange(e) {
            this.newCity.file = null;
            var image = e.target.files || e.dataTransfer.files;

            if (!image.length)
                return;

            this.newCity.file = image[0];
            console.log("HELLO");
            console.log(this.newCity.file); // Should log the file object
        },
        forceRerender() {
            this.$forceUpdate(); // Call $forceUpdate() to force re-render
        },
        getCapitalName(capitalId) {
            console.log('getCapitalName method called with capitalId:', capitalId);
            const capital = this.capitals.find(capital => capital.id === capitalId);
            console.log('Capital found:', capital);
            return capital ? capital.name : 'Unknown';
        }

    }
}