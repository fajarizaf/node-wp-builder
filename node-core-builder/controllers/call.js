const axios = require("axios").default;
const nodebase64 = require('nodejs-base64-converter')

// controller event general
exports.services = (method, body, url, req) => new Promise((resolve, reject) => {

    const headers = {
        'Content-Type': 'application/json',
         Accept: 'application/json',
         "Cache-Control": "no-cache",
        'Authorization': `Basic ${nodebase64.encode(process.env.PLESK_USERNAME+':'+process.env.PLESK_PASSWORD)}`,
    }
    
    axios.request({
        method: method,
        url: url,
        maxRedirects: 0,
        responseType:'json',
        data:JSON.stringify(body),
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


exports.service = (method, url, req) => new Promise((resolve, reject) => {
  
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Basic `+nodebase64.encode(process.env.PLESK_USERNAME+':'+process.env.PLESK_PASSWORD) 
    }
    
    axios.request({
        method: method,
        url: url,
        maxRedirects: 0,
        responseType:'json',
        headers: headers
    }).then(res => {
        resolve(res.data)
    }).catch( e => {
        reject({
            status:'failed', 
            response: e
        })
    })

})


function convertToJson(strings) {
    let string = JSON.stringify(strings)
    return JSON.parse(string)
}


