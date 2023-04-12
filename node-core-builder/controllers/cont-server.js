const axios = require("axios").default;
const nodebase64 = require('nodejs-base64-converter')

// models
const models = require('../models')
const Server = models.Server

exports.ips = (req) => new Promise((resolve, reject) => {
    
    const headers = {
        'Content-Type': 'application/json',
         Accept: 'application/json',
         "Cache-Control": "no-cache",
        'Authorization': `Basic ${nodebase64.encode(req.plesk_username+':'+req.plesk_password)}`,
    }

    axios.request({
        method: 'GET',
        url: req.server_host+'/api/v2/server/ips',
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


exports.get_available_hosting = () => new Promise((resolve, reject) => {

    Server.findOne({
        where: {
            server_status: 'available'
        }
    })
    .then((respond) => {
        if(respond != '') {
            resolve(convertToJson({
                respond: {
                    status: 'success',
                    data: respond
                }
            }))
        } else {
            resolve(convertToJson({respond:{status:'failed',response: 'server hosting not found'}}))
        }

    })
    .catch((e) => {
        reject(
            convertToJson(
                {respond: {status: 'error',response: e.message}}
            )
        )
    })

})


function convertToJson(strings) {
    let string = JSON.stringify(strings)
    return JSON.parse(string)
}
