const axios = require("axios").default;

// controller event general
exports.services = (method, body, url) => new Promise((resolve, reject) => {
  
    axios.request({
        method: method,
        url: url,
        maxRedirects: 0,
        responseType:'json',
        data:body
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


