import axios from 'axios';
import API_URL from "./env";
import authHeader from './auth-header';

class CitiesService {
    getCities() {
      return axios.get(API_URL + 'cities', { headers: authHeader() })
        .then(response => {
          return response.data.data;
        })
    }

    createCity(city) {
      let formData = new FormData();
      formData.append('file', city.file);
      formData.append('name', city.name);
      formData.append('description', city.description);
      formData.append('capital_id', city.capital_id);

      if (city.attraction_ids && Array.isArray(city.attraction_ids)) {
        city.attraction_ids.forEach(id => {
          formData.append('attraction_ids[]', id); // Append each ID
        });
      }

      return axios.post(API_URL + 'cities', formData, { headers: authHeader('multipart') })
        .then(response => {
          return response.data.data;
        })
    }

    updateCity(city) {
      return axios.put(API_URL + 'cities/' + city.id, city, { headers: authHeader() })
        .then(response => {
          return response.data.data;
        })
    }

    deleteCity(city) {
      return axios.delete(API_URL + 'cities/' + city.id, { headers: authHeader() })
        .then(response => {
          return response.data.data;
        });
    }

    updateCityPicture(city) {
      let formData = new FormData();
      formData.append('file', city.file);
      return axios.post(API_URL + 'cities/' + city.id + '/update_city_picture', formData, { headers: authHeader() })
        .then(response => {
          return response.data.data;
        })
    }

    getCapital(capitalId) {
      return axios.get(API_URL + 'capitals/' + capitalId, { headers: authHeader() })
          .then(response => {
              return response.data;
          });
  }
      
}

export default new CitiesService();
