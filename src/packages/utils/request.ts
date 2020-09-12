import axios from 'axios'

interface IGlobalConfig {
  baseURL: string,
  getRequestInfo?: () => object,
  getData?: () => object,
  handleResponse?: (data: any, resolve, reject) => void
}

export default function ({baseURL, getRequestInfo, getData, handleResponse}: IGlobalConfig) {
  if (baseURL) {
    axios.defaults.baseURL = baseURL
  }
  return (url: string, data: object = {}) => {
    const headers = getRequestInfo ? getRequestInfo() : null;

    return new Promise((resolve, reject) => {
      const postData = getData ? {...getData(), ...data} : data;
      axios.post(url, postData, {
        headers
      }).then(res => {
        if (!handleResponse) {
          resolve(res.data);
          return
        }

        handleResponse(data, resolve, reject);
      }).catch(e => {
        reject(e)
      })
    })
  }
}
