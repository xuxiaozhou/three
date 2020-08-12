'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var axios = _interopDefault(require('axios'));

var request = (globalConfig) => {
    const { baseUrl, getHeaders, handleRes } = globalConfig;
    axios.defaults.baseURL = baseUrl;
    return (url, data) => {
        return new Promise((resolve, reject) => {
            axios.post(url, data, {
                headers: getHeaders()
            }).then(res => {
                handleRes(res.data, resolve, reject);
            }).catch(e => {
                reject(e);
            });
        });
    };
};

module.exports = request;
