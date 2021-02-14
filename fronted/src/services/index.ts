const axios = require('axios').default;

const appService = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
});

export default appService;
