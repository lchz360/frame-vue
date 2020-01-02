import HttpRequest from '@/libs/axios'
const baseUrl = process.env.VUE_APP_SERVER_DOMAIN

const axios = new HttpRequest(baseUrl)
export default axios
