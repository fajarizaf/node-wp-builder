const axios = require("axios").default;
const nodebase64 = require('nodejs-base64-converter')


// pasang ssl lets encrypt
exports.install_ssl_lets_encrypt = () => new Promise((resolve, reject) => {

    const headers = {
        'Content-Type': 'application/json',
         Accept: 'application/json',
         "Cache-Control": "no-cache",
        'Authorization': `Basic ${nodebase64.encode(process.env.PLESK_USERNAME+':'+process.env.PLESK_PASSWORD)}`,
    }

    let body = {
        "params": ["--exec", "letsencrypt", "cli.php", "-d", "tes.nodebuilder.my.id", "-d", "webmail.nodebuilder.my.id", "-m", "runi@nodebuilder.my.id"]  
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


function convertToJson(strings) {
    let string = JSON.stringify(strings)
    return JSON.parse(string)
}


