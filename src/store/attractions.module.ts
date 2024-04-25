import attractionsService from "../services/attractions.service";

const initialState = { attractionList: [] };

export const attractions = {
    namespaced: true,
    state: initialState,
    actions: {
        getAttractions({ commit }) {
            return attractionsService.getAttractions().then(
                attractions => {
                    console.log('Fetched attractions:', attractions); // Check the fetched data
                    commit('setAttractions', attractions);
                    return Promise.resolve(attractions);
                }
            );
        }
    },
    mutations: {
        setAttractions(state, attractions) {
            state.attractionList = attractions;
            console.log("State updated with attractions:", state.attractionList);
        }
    },
    getters: {
        getAttractionIndexByCapitalID: (state) => (attractionID) => {
            return state.attractionList.findIndex((attraction) => {
                return attraction.id === attractionID
            })
        }
    }
}