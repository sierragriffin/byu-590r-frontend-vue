import axios from 'axios';
import API_URL from "./env";
import authHeader from './auth-header';

class attractionsService {
    getAttractions() {
        return axios.get(API_URL + 'attractions', { headers: authHeader() })
            .then(response => {
                return response.data.data;
            })
    }

}

export default new attractionsService();
