const axios = require("axios").default;

// controller event general
exports.services = (method, body, url, req) => new Promise((resolve, reject) => {
  
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${req.sessionLogin}` 
    }
    
    axios.request({
        method: method,
        url: url,
        maxRedirects: 0,
        responseType:'json',
        data:body,
        headers: headers
    }).then(res => {
        resolve(res.data)
    }).catch( e => {
        reject({
            status:'failed', 
            response:'contact backend administrator'
        })
    })

})

function convertToJson(strings) {
    let string = JSON.stringify(strings)
    return JSON.parse(string)
}


