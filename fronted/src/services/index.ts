const axios = require('axios').default;

const appService = axios.create({
  baseURL: 'http://localhost:3000',
});

export default appService;
