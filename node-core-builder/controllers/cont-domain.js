const axios = require("axios").default;
const nodebase64 = require('nodejs-base64-converter')

// controller event general
exports.create_subdomain = (req) => new Promise((resolve, reject) => {

    let domainData = {
        "name": req.body.subdomain+".nodebuilder.my.id",
        "description": "My website",
        "hosting_type": "virtual",
        "hosting_settings": {
          "ftp_login": "test_login",
          "ftp_password": "Adayanghilang123@"
        },
        "base_domain": {
            "id": req.base_domain_id,
            "name": req.base_domain_name,
            "guid": req.base_domain_guid
        },
        "parent_domain": {
            "id": req.base_domain_id,
            "name": req.base_domain_name,
            "guid": req.base_domain_guid
        },
        "owner_client": {
          "id": 1,
          "login": "admin",
          "guid": "d7827fbb-ccab-11ed-95b9-52540015a7a9",
          "external_id": 5
        },
        "ip_addresses": [
          "93.184.216.34",
          "2606:2800:220:1:248:1893:25c8:1946"
        ],
        "ipv4": [
          "103.59.94.53"
        ],
        "plan": {
          "name": "Unlimited"
        }
    }

    const headers = {
        'Content-Type': 'application/json',
         Accept: 'application/json',
         "Cache-Control": "no-cache",
        'Authorization': `Basic ${nodebase64.encode(req.plesk_username+':'+req.plesk_password)}`,
    }
    
    axios.request({
        method: 'POST',
        url: req.server_host+'/api/v2/domains',
        maxRedirects: 0,
        responseType:'json',
        data:JSON.stringify(domainData),
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


