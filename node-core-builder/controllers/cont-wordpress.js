const axios = require('axios').default;
const nodebase64 = require('nodejs-base64-converter')


// models
const models = require('../models')
const cms = models.Cms


// install cms
exports.install = (req , domain_name) => new Promise((resolve, reject) => {

    const headers = {
        'Content-Type': 'application/json',
         Accept: 'application/json',
         "Cache-Control": "no-cache",
        'Authorization': `Basic ${nodebase64.encode(req.plesk_username+':'+req.plesk_password)}`,
    }

    let body = {
        "domain": domain_name,
        "language": "en_US",
        "overwrite": false,
        "protocol": "https",
        "title": "Starter Website Demo",
        "admin": {
            "email": req.owner_email,
            "login": req.owner_login,
            "password": req.owner_pass
        },
        "autoUpdate": {
            "core": "major",
            "plugins": {
            "forceUpdates": false,
            "newlyInstalledUpdates": false,
            "updateVulnerable": false,
            "deactivateVulnerable": false
            },
            "themes": {
            "forceUpdates": false,
            "newlyInstalledUpdates": false,
            "updateVulnerable": false
            }
        }
    }
    
    axios.request({
        method: 'POST',
        url: req.server_host+'/api/modules/wp-toolkit/v1/installations',
        maxRedirects: 0,
        responseType:'json',
        data:JSON.stringify(body),
        headers: headers
    }).then(res => {
        
        if(res.data.task.id) {

            resolve(
                convertToJson({
                    respond: {
                        status: 'success',
                        response: 'cms start install',
                        data: {
                            task_id: res.data.task.id
                        }
                    }
                })
            )

        } else {

            reject(convertToJson(
                {
                    respond: {
                        status:'failed', 
                        response: res.data+' Contact Administrator'
                    }
                }
            ))

        }

    }).catch( e => {
        reject({
            respond: {
                status:'failed', 
                response: e.message
            }
        })
    })

})

// progress install cms
exports.progress_install = (req) => new Promise((resolve, reject) => {

    const headers = {
        'Content-Type': 'application/json',
         Accept: 'application/json',
         "Cache-Control": "no-cache",
        'Authorization': `Basic ${nodebase64.encode(req.plesk_username+':'+req.plesk_password)}`,
    }

    axios.request({
        method: 'GET',
        url: req.server_host+'/api/modules/wp-toolkit/v1/background-tasks/task_install/'+req.body.task_id,
        maxRedirects: 0,
        responseType:'json',
        headers: headers
    }).then(res => {
        
        if(res.data.progress == 100) {

                cms.create({
                    site_id: req.body.site_id,
                    instance_id: res.data.publicParams.installationId,
                    title: "Starter Website Demo",
                    login_email: req.owner_email,
                    login_username: req.owner_login,
                    login_password: req.owner_pass
                })
                .then((respond) => {
                    
                    resolve(
                        convertToJson({
                            status: 'success',
                            response: 'cms installed',
                            data: {
                                instance_id: res.data.publicParams.installationId
                            }
                        })
                    )
                        
                })
                .catch((e) => {
                    reject(
                        convertToJson(
                            {respond: {status: 'errors', response: e.message}}
                        )
                    )
                })

        } else {

            resolve(
                convertToJson({
                    status: 'in progress',
                    response: 'installing cms',
                    data: {
                        progress: res.data.progress
                    }
                })
            )

        }
            

    }).catch( e => {
        reject(convertToJson({
            status:'failed', 
            response: e.message
        }))
    })

})

// install theme wordpress
exports.install_theme = (req) => new Promise((resolve, reject) => {

    const headers = {
        'Content-Type': 'application/json',
         Accept: 'application/json',
         "Cache-Control": "no-cache",
        'Authorization': `Basic ${nodebase64.encode(req.plesk_username+':'+req.plesk_password)}`,
    }

    let body = {
        'slug': req.body.theme_slug,
        'status': req.body.status
    }
    
    axios.request({
        method: 'POST',
        url: req.server_host+'/api/modules/wp-toolkit/v1/installations/'+req.body.instance_id+'/themes',
        maxRedirects: 0,
        responseType:'json',
        data:JSON.stringify(body),
        headers: headers
    }).then(res => {
        resolve(res.data)
    }).catch( e => {
        console.log(e.message)
        reject({
            status:'faileds', 
            response: e.message
        })
    })

})


// install plugin wordpress
exports.install_plugin = (req) => new Promise((resolve, reject) => {

    const headers = {
        'Content-Type': 'application/json',
         Accept: 'application/json',
         "Cache-Control": "no-cache",
        'Authorization': `Basic ${nodebase64.encode(req.plesk_username+':'+req.plesk_password)}`,
    }

    let body = {
        'slug': req.body.plugin_slug,
        'status': req.body.status
    }
    
    axios.request({
        method: 'POST',
        url: req.server_host+'/api/modules/wp-toolkit/v1/installations/'+req.body.instance_id+'/plugins',
        maxRedirects: 0,
        responseType:'json',
        data:JSON.stringify(body),
        headers: headers
    }).then(res => {
        resolve(res.data)
    }).catch( e => {
        console.log(e.message)
        reject({
            status:'failed', 
            response: e.message
        })
    })

})


// install starter theme wordpress
exports.starter_templates = (req) => new Promise((resolve, reject) => {

    const headers = {
        'Content-Type': 'application/json',
         Accept: 'application/json',
         "Cache-Control": "no-cache",
        'Authorization': `Basic ${nodebase64.encode(req.plesk_username+':'+req.plesk_password)}`,
    }

    let body = {
        "params": [
            "--call", 
            "wp-toolkit", 
            "--wp-cli", 
            "-instance-id", req.body.instance_id, 
            "--", "astra-sites",
            "import", req.body.theme_id,
            "--user="+req.owner_login,
            "--reset",
            "--yes",
            "--skip-plugins=false"
        ]
    }
    
    axios.request({
        method: 'POST',
        url: process.env.PLESK_HOSTNAME+'/api/v2/cli/extension/call',
        maxRedirects: 0,
        responseType:'json',
        data:JSON.stringify(body),
        headers: headers
    }).then(res => {
        resolve(res.data)
    }).catch( e => {
        console.log(e.message)
        reject({
            status:'failed', 
            response: e.message
        })
    })

})


// list wordpress installed
exports.list = (req) => new Promise((resolve, reject) => {

    const headers = {
        'Content-Type': 'application/json',
         Accept: 'application/json',
         "Cache-Control": "no-cache",
        'Authorization': `Basic ${nodebase64.encode(req.plesk_username+':'+req.plesk_password)}`,
    }
    
    axios.request({
        method: 'GET',
        url: req.server_host+'/api/modules/wp-toolkit/v1/installations',
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


// get wordpress by instance_id
exports.get = (req) => new Promise((resolve, reject) => {

    const headers = {
        'Content-Type': 'application/json',
         Accept: 'application/json',
         "Cache-Control": "no-cache",
        'Authorization': `Basic ${nodebase64.encode(req.plesk_username+':'+req.plesk_password)}`,
    }
    
    axios.request({
        method: 'GET',
        url: req.server_host+'/api/modules/wp-toolkit/v1/installations/'+req.query.id,
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