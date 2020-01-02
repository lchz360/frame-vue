import axios from 'axios'
import { getToken } from '@/libs/util'
import router from '@/router'

class HttpRequest {
  constructor(baseUrl = process.env.VUE_APP_SERVER_DOMAIN) {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig() {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        //
      },
      withCredentials: true
    }
    return config
  }
  request(url, data, method) {
    const token = getToken();
    data = JSON.parse(JSON.stringify(data));
    data._isback = 1;
    if (typeof token === 'string') {
      data.token = token;
    }
    method = method.toLowerCase();
    let options = this.getInsideConfig();
    options.method = method;
    options.url = url;
    if (method === 'get' || method === 'delete') {
      options.params = data;
    } else {
      options.data = data;
    }

    return new Promise((resolve, reject) => {
      axios(options).then(res => {
        if (res.data.code == -1) {
          router.push({ name: 'Login' })
        } else {
          //成功
          resolve(res.data)
        }
      }).catch(res => {
        //失败
        reject(res)
      })
    })
  }
  get(url, data = {}) {
    return this.request(url, data, 'get');
  }
  post(url, data = {}) {
    return this.request(url, data, 'post');
  }
  put(url, data = {}) {
    return this.request(url, data, 'put');
  }
  delete(url, data = {}) {
    return this.request(url, data, 'delete');
  }
}
export default HttpRequest
