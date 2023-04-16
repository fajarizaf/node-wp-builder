

// models
const models = require('../models')
const Site = models.Site
const Cms = models.Cms


exports.list = (req) => new Promise((resolve, reject) => {

    Site.findAll({
        where: {
            UserCode: req.UserCode
        },
        attributes:['id','domain_id','domain_name'],
        include: [
            {
                model: Cms, as: 'cms',
                required : true,
                attributes:['id','site_id','instance_id','title','login_email','login_username','login_password'],
            }
        ]
    })
    .then((respond) => {
        if(respond) {
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


exports.detail = (req) => new Promise((resolve, reject) => {

    Site.findOne({
        where: {
            UserCode: req.UserCode,
            id:req.query.id
        },
        attributes:['id','domain_id','domain_name'],
        include: [
            {
                model: Cms, as: 'cms',
                required : true,
                attributes:['id','site_id','instance_id','title','login_email','login_username','login_password'],
            }
        ]
    })
    .then((respond) => {
        if(respond) {
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


function convertToJson(strings) {
    let string = JSON.stringify(strings)
    return JSON.parse(string)
}