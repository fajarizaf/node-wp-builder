const axios = require("axios").default;
const nodebase64 = require('nodejs-base64-converter')

// models
const models = require('../models')
const Config = models.Config


exports.get_config_name = (name) => new Promise((resolve, reject) => {

    Config.findOne({
        where: {
            config_name: name
        }
    })
    .then((respond) => {
        if(respond != '') {
            resolve(respond.config_value)
        } else {
            resolve(convertToJson({respond:{status:'failed',response: 'config not found : '+ name}}))
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
