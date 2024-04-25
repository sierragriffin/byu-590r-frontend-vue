import CapitalsService from "../services/capitals.service";

const initialState = { capitalList: [],
    capitalsLoaded: false };

export const capitals = {
    namespaced: true,
    state: initialState,
    actions: {
        getCapitals({ commit }) {
            return CapitalsService.getCapitals().then(
                capitals => {
                    commit('setCapitals', capitals);
                    commit('setCapitalsLoaded', true); // Update the flag when capitals are loaded
                    console.log('Capitals loaded:', capitals); // Log the loaded capitals
                    console.log('Capitals loaded flag:', true); // Log the loaded flag
                    return Promise.resolve(capitals);
                }
            );
        }
    },
    mutations: {
        setCapitals(state, capitals) {
            state.capitalList = capitals;
        },
        setCapitalsLoaded(state, value) {
            state.capitalsLoaded = value;
        }
    },
    getters: {
        capitalsLoaded: state => state.capitalsLoaded,
        getCapitalIndexByCapitalID: (state) => (capitalID) => {
            return state.capitalList.findIndex((capital) => {
                return capital.id === capitalID
            })
        }
    }
}