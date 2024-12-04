import axios from "axios";

const instance = axios.create({
    baseURL: 'https://amazon-clone-1-0sny.onrender.com'
});

export default instance;