const axios = require('axios').default;
const nodebase64 = require('nodejs-base64-converter')

const headers = {
    'Content-Type': 'application/json',
     Accept: 'application/json',
     "Cache-Control": "no-cache",
    'Authorization': `Basic ${nodebase64.encode(process.env.PLESK_USERNAME+':'+process.env.PLESK_PASSWORD)}`,
}


// install cms
exports.install = (body) => new Promise((resolve, reject) => {

    let body = {
        "params": [
            "--call", 
            "wp-toolkit", 
            "--install", 
            "-domain-name", 
            "tes2.nodebuilder.my.id"
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


// install plugin wordpress
exports.install_plugin = () => new Promise((resolve, reject) => {

    let body = {
        "params": [
            "--call", 
            "wp-toolkit", 
            "--wp-cli", 
            "-instance-id", "2", 
            "--", "plugin", 
            "install",
            "astra-sites",
            "activate"
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


// install plugin wordpress
exports.activated_plugin = () => new Promise((resolve, reject) => {

    let body = {
        "params": [
            "--call", 
            "wp-toolkit", 
            "--wp-cli", 
            "-instance-id", "2", 
            "--", "plugin", 
            "activate",
            "astra-sites"
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


// install starter theme wordpress
exports.starter_templates = () => new Promise((resolve, reject) => {

    let body = {
        "params": [
            "--call", 
            "wp-toolkit", 
            "--wp-cli", 
            "-instance-id", "2", 
            "--", "astra-sites",
            "import", "59760",
            "--user=fajarizaf_788kxg5f",
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
        console.log(res)
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
exports.list = () => new Promise((resolve, reject) => {

    let body = {
        "params": [
            "--call", 
            "wp-toolkit", 
            "--list"
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