import axios from 'axios'

const ApiService = {
    setNedrex(url) {
        axios.nedrex = url
    },

    init(baseURL) {
        axios.defaults.baseURL = baseURL;
    },

    get(resource) {
        return axios.get(resource)
    },

    post(resource, data, callback) {
        return axios.post(resource, data, callback);
    },

    put(resource, data) {
        return axios.put(resource, data)
    },

    delete(resource) {
        return axios.delete(resource)
    },

    getExamples(){
        return this.get("/test")
    },

    getExample(nr){
        return this.get("test?nr="+nr)
    }



}
export default ApiService
