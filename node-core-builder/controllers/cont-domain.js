const axios = require("axios").default;
const nodebase64 = require('nodejs-base64-converter')

// models
const models = require('../models')
const Site = models.Site

//include lib
var md5 = require('md5')

// create subdomain
exports.create_subdomain = (req) => new Promise((resolve, reject) => {

    var ftp_login = "user_login"
    var ftp_password = md5("Adayanghilang123@")

    let domainData = {
        "name": req.body.subdomain+"."+req.base_domain_name,
        "description": "My website",
        "hosting_type": "virtual",
        "hosting_settings": {
          "ftp_login": ftp_login,
          "ftp_password": ftp_password
        },
        "parent_domain": {
            "id": req.base_domain_id,
            "name": req.base_domain_name,
            "guid": req.base_domain_guid
        },
        "owner_client": {
          "id": req.owner_id,
          "login": req.owner_login,
          "guid": req.owner_guid,
          "external_id": req.owner_guid
        },
        "ip_addresses": [
            req.server_ipv4,
            req.server_ipv6
        ],
        "ipv4": [
            req.server_ipv4
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
        
        if(res.data.id) {

            Site.create({
                UserCode: req.UserCode,
                domain_id: res.data.id,
                domain_name: req.body.subdomain+".nodebuilder.my.id",
                guid: res.data.guid,
                ftp_login: ftp_login,
                ftp_password: ftp_password
            })
            .then((respond) => {
                
                resolve(
                    convertToJson({
                        status: 'success',
                        response: 'Create Sub Domain',
                        data: {
                            site_id: respond.id
                        }
                    })
                )
                    
            })
            .catch((e) => {
                resolve(
                    convertToJson(
                        {respond: {status: 'errors', response: e.message}}
                    )
                )
            })

        } else {

            reject({
                status:'failed', 
                response: res.data+' Contact Administrator'
            })

        }

    }).catch( e => {
        reject({
            status:'failed', 
            response: e.message+' Contact Administrator'
        })
    })

})

// delete domain or subdomain
exports.delete = (req) => new Promise((resolve, reject) => {

    const headers = {
        'Content-Type': 'application/json',
         Accept: 'application/json',
         "Cache-Control": "no-cache",
        'Authorization': `Basic ${nodebase64.encode(req.plesk_username+':'+req.plesk_password)}`,
    }
    
    axios.request({
        method: 'DELETE',
        url: req.server_host+'/api/v2/domains/'+req.query.id,
        maxRedirects: 0,
        responseType:'json',
        headers: headers
    }).then(res => {
        
        if(res.data.id) {

            Site.destroy({
                where: {
                    domain_id: req.query.id
                }
            })
            .then((respond) => {
                
                resolve(
                    convertToJson({
                        status: 'success',
                        response: 'Delete Domain',
                    })
                )
                    
            })
            .catch((e) => {
                resolve(
                    convertToJson(
                        {respond: {status: 'errors', response: e.message}}
                    )
                )
            })

        } else {

            reject({
                status:'failed', 
                response: res.data+' Contact Administrator'
            })

        }

    }).catch( e => {
        reject({
            status:'failed', 
            response: e.message+' Contact Administrator'
        })
    })

})


// pasang ssl lets encrypt
exports.install_ssl_lets_encrypt = (req , domain_name) => new Promise((resolve, reject) => {

    const headers = {
        'Content-Type': 'application/json',
         Accept: 'application/json',
         "Cache-Control": "no-cache",
        'Authorization': `Basic ${nodebase64.encode(req.plesk_username+':'+req.plesk_password)}`,
    }

    let body = {
        "params": ["--exec", "letsencrypt", "cli.php", "-d", domain_name , "-d", "webmail.nodebuilder.my.id", "-m", req.owner_email]  
    }
    
    axios.request({
        method: 'POST',
        url: req.server_host+'/api/v2/cli/extension/call',
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

function convertToJson(strings) {
    let string = JSON.stringify(strings)
    return JSON.parse(string)
}


exports.get_site = (site_id) => new Promise((resolve, reject) => {

    Site.findOne({
        where: {
            id: site_id
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
            resolve(convertToJson({respond:{status:'failed',response: 'site not found'}}))
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

