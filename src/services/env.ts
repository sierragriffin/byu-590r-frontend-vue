// const API_URL = 'http://127.0.0.1:8000/api/';
// export default API_URL;

let API_URL = 'http://52.86.187.246:8888/api/';
if (import.meta.env.MODE === 'development') {
    API_URL = 'http://127.0.0.1:8000/api/';
}
export default API_URL;

// 52.86.187.246 public 
// 172.31.22.32 private