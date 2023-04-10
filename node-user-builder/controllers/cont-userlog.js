// include model
const models = require('../models')
const Userlog = models.Userlog
const UserProfile = models.UserProfile

// include lib
const { Op } = require("sequelize");
const sequelize = require("sequelize");

exports.createLogs = (usercode, user, action, req, res) => new Promise((resolve, reject) => {

    var IP = req.socket.remoteAddress;
    var nmIP = IP.replace('::ffff:', '');
    
    if(req.method == 'GET') {
        var request = req.query
    } else {
        var request = req.body
    }

    Userlog.create({
        descriptions: action,
        user: user,
        UserCode: usercode,
        ipaddr: nmIP,
        useragent: req.headers['user-agent'],
        req: JSON.stringify(request),
        res: JSON.stringify(res),
    })
    .then(() => {
        resolve(
            convertToJson({
                respond: {
                    status: 'success'
                }
            })
        )
    })
    .catch((e) => {
        resolve(
            convertToJson(
                {respond: {status: 'error', response: e.message}}
            )
        )
    })

})


exports.new_userSign = (req) => new Promise((resolve, reject) => {
    Userlog.findAll({
        attributes : [
            'id','descriptions','user','ipaddr'
        ],
        where: {
            descriptions: 'User Sign In'
        },
        include: [
            { 
                model: UserProfile, as: 'log_usr_profile',
                required : true,
                attributes : [
                    'UserCode'
                ]
            }
        ]
    })
    .then((respond) => {
        if(respond != null) {

            resolve (
                convertToJson({
                    respond: {
                        status: 'success',
                        response: 'log activity found',
                        data: respond
                    } 
                })
            )

        } else {
            resolve (
                convertToJson({
                    respond: {
                        status: 'failed',
                        response: 'log activity not found',
                    } 
                })
            )  
        }
    })
    .catch((e) => {
        resolve(
            convertToJson({
                respond: {
                    status: 'error',
                    response: e
                }
            })
        )
    })
})


function convertToJson(strings) {
    let string = JSON.stringify(strings)
    return JSON.parse(string)
}