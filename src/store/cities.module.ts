import citiesService from "../services/cities.service";
import { capitals } from './capitals.module';

const initialState = { citiesList: [] };

export const cities = {
    namespaced: true,
    state: initialState,
    actions: {
        getCities({ commit }) {
            return citiesService.getCities().then(
                cities => {
                    commit('setCities', cities);
                    return Promise.resolve(cities);
                }
            );
        },
        // createCity({ commit }, city) {
        //     return citiesService.createCity(city).then(
        //         response => {
        //             commit('addCity', response.city);
        //             return Promise.resolve(response.city);
        //         }
        //     );
        // },
        createCity({ commit }, city) {
            return citiesService.createCity(city)
                .then(response => {
                    console.log('Response from server:', response);
                    const newCity = response.city;
        
                    // Fetch capital details if capital_id is present
                    if (newCity.capital_id) {
                        return citiesService.getCapital(newCity.capital_id)
                            .then(capitalResponse => {
                                newCity.capital = capitalResponse.data; // Assume the response contains the capital data
                                commit('addCity', newCity);
                                return Promise.resolve(newCity);
                            });
                    } else {
                        commit('addCity', newCity);
                        return Promise.resolve(newCity);
                    }
                })
                .catch(error => {
                    console.error('Error creating city:', error);
                    return Promise.reject(error);
                });
        },
        updateCity({ commit, getters }, city) {
            return citiesService.updateCity(city).then(
                response => {
                    response.city.index = getters.getCityStateIndexByCityID(response.city.id);
                    commit('setCity', response.city);
                    return Promise.resolve(response.city);
                }
            );
        },
        // deleteCity({ commit, getters }, city) {
        //     return citiesService.deleteCity(city).then(
        //         response => {
        //             response.city.index = getters.getCityStateIndexByCityID(response.city.id);
        //             commit('removeCity', response.city);
        //             return Promise.resolve(response.city);
        //         }
        //     );
        // },
        deleteCity({ commit, state }, city) {
            console.log('Deleting city:', city); // Log the city being deleted
            const deletedCityIndex = state.citiesList.findIndex(c => c.id === city.id);
            console.log('Deleted city index:', deletedCityIndex); // Log the index of the deleted city
            if (deletedCityIndex !== -1) {
                commit('removeCity', deletedCityIndex);
                return citiesService.deleteCity(city)
                    .then(() => {
                        console.log('City deleted successfully.');
                        return Promise.resolve();
                    })
                    .catch(error => {
                        console.error('Error deleting city:', error);
                        commit('addCity', city);
                        return Promise.reject(error);
                    });
            } else {
                console.warn('City not found in state:', city);
                return Promise.reject(new Error('City not found in the state.'));
            }
        },
        updateCityPicture({ commit, getters }, city) {
            return citiesService.updateCityPicture(city).then(
                response => {
                    response.city.index = getters.getCityStateIndexByCityID(response.city.id);
                    commit('updateCityPicture', response.city);
                    return Promise.resolve(response.city);
                }
            );
        }
    },
    mutations: {
        setCities(state, cities) {
            state.citiesList = cities
        },
        addCity(state, city) {
            // let testName: string;
            // let cap: Capital
            // city.capital.name ??= testName;
            state.citiesList.push(city);
            console.log('New city added:', city);
            console.log('Updated cities list:', state.citiesList);
        },
        setCity(state, city) {
            state.citiesList[city.index] = city;
        },
        // removeCity(state, city) {
        //     state.citiesList.splice(city.index, 1)
        // },
        removeCity(state, deletedCity) {
            console.log('Before removal - Cities:', state.citiesList);
            // state.citiesList = state.citiesList.filter(city => city.id !== deletedCity.id);
            state.citiesList.splice(deletedCity, 1); // Remove 1 item at the specified index
            console.log('After removal - Cities:', state.citiesList);
        },
        updateCityPicture(state, city) {
            state.citiesList[city.index].file = city.file
        }
    },
    getters: {
        getCityStateIndexByCityID: (state) => (cityID) => {
            return state.citiesList.findIndex((city) => {
                return city.id === cityID
            })
        }
    }
}