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
    },

    validate_set(id_type, set, runs, replace){
        return this.post("/set",{target:set, target_id:id_type, runs: runs, replace: replace}).then(response=>{
            return response.data
        })
    }



}
export default ApiService
