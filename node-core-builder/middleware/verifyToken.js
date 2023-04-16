// include controllers
const jwt = require('jsonwebtoken')

// include controllers
const SERVER = require("../controllers/cont-server")
const CONFIG = require("../controllers/cont-config")

exports.verifyToken = async (req,res,next) => {
    try {

        const token = req.headers.authorization.split(' ')[1]
        if(token == '') {
            res.json({respond: {
                status: "failed", 
                response: "Authorization access token null"
            }})
        } else {

            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
                if(err) {
                    res.json({respond : {status:"forbidden", response: "Token not verified"}})
                } else {

                    // get active hosting
                    var hosting = await SERVER.get_available_hosting()

                    req.sessionLogin = token
    
                    req.UserCode = decoded.UserCode
                    req.UserName = decoded.UserName
                    req.RoleCode = decoded.RoleCode
                    req.RoleName = decoded.RoleName

                    req.plesk_username = hosting.respond.data.plesk_username
                    req.plesk_password = hosting.respond.data.plesk_password
                    req.server_ip = hosting.respond.data.ip_address
                    req.server_ipv4 = hosting.respond.data.ipv4
                    req.server_ipv6 = hosting.respond.data.ipv6
                    req.server_host = hosting.respond.data.host_name

                    req.base_domain_id = await CONFIG.get_config_name('base_domain_id')
                    req.base_domain_name = await CONFIG.get_config_name('base_domain_name')
                    req.base_domain_guid = await CONFIG.get_config_name('base_domain_guid')

                    req.owner_email = await CONFIG.get_config_name('owner_email')
                    req.owner_id = await CONFIG.get_config_name('owner_id')
                    req.owner_login = await CONFIG.get_config_name('owner_login')
                    req.owner_pass = await CONFIG.get_config_name('owner_pass')
                    req.owner_guid = await CONFIG.get_config_name('owner_guid')
                    
                    const request = req.body
                    if(request.hasOwnProperty('filter')) {
                        req.where = request.filter
                    } else {
                        req.where = {}
                    }

                    next()

                }
            })
        }
        
    } catch (error) {
        res.json({respond : {status:'forbidden', response: 'No Authorization'}})
    }
}