const axios = require("axios").default;
const nodebase64 = require('nodejs-base64-converter')


const headers = {
    'Content-Type': 'application/json',
     Accept: 'application/json',
     "Cache-Control": "no-cache",
    'Authorization': `Basic ${nodebase64.encode(process.env.PLESK_USERNAME+':'+process.env.PLESK_PASSWORD)}`,
}


exports.ips = () => new Promise((resolve, reject) => {

    axios.request({
        method: 'GET',
        url: process.env.PLESK_HOSTNAME+'/api/v2/server/ips',
        maxRedirects: 0,
        responseType:'json',
        headers: headers
    }).then(res => {
        resolve(res.data)
    }).catch( e => {
        reject({
            status:'failed', 
            response: e.message
        })
    })

})


function convertToJson(strings) {
    let string = JSON.stringify(strings)
    return JSON.parse(string)
}


