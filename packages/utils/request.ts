import axios from 'axios'

interface IGlobalConfig {
  baseUrl: string,
  getHeaders: () => object,
  handleRes: (data, resolve, reject) => void
}

export default (globalConfig: IGlobalConfig) => {
  const {baseUrl, getHeaders, handleRes} = globalConfig;
  axios.defaults.baseURL = baseUrl;

  return (url: string, data?) => {
    return new Promise((resolve, reject) => {
      axios.post(url, data, {
        headers: getHeaders()
      }).then(res => {
        handleRes(res.data, resolve, reject)
      }).catch(e => {
        reject(e)
      })
    })
  }
}
