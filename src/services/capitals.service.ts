import axios from 'axios';
import API_URL from "./env";
import authHeader from './auth-header';

class CapitalsService {
    getCapitals() {
        return axios.get(API_URL + 'capitals', { headers: authHeader() })
            .then(response => {
                return response.data.data;
            })
    }

}

export default new CapitalsService();
