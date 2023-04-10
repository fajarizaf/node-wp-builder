// include controllers
const Role = require('../controllers/cont-role')


// include lib
const lodash = require('lodash')
const url = require('url');

exports.gatewayAccess = async (req,res,next) => {

    let myAccess = await Role.UserAccesss(req.UserCode)
    const path = await url.parse(req.url).path
    
    if(myAccess.respond.data != null) {
        let data = await Role.GetRoleAccess(req.UserCode, req.RoleName, req.RoleType)
        let dataAccess = data.respond.data
        var find = await lodash.filter(dataAccess, { "endpoint": path })

        if(find.length > 0) {
            next()
        } else {
            next(res.json({respond: {status : 'forbidden', response: 'Endpoint Access Permission Not Allowed'}}));
        }
        
    } else {
        let data = await Role.GetDefaultRoleAccess(req.RoleCode, req.RoleName, req.RoleType)
        let dataAccess = data.respond.data
        var find = await lodash.filter(dataAccess, { "endpoint": path })

        if(find.length > 0) {
            next()
        } else {
            next(res.json({respond: {status : 'forbidden', response: 'Endpoint Access Permission Not Allowed'}}));
        }
        
    }

}