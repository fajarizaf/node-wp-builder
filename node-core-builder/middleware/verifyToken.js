// include controllers
const jwt = require('jsonwebtoken')

exports.verifyToken = async (req,res,next) => {
    try {

        const token = req.headers.authorization.split(' ')[1]
        if(token == '') {
            res.json({respond: {
                status: "failed", 
                response: "Authorization access token null"
            }})
        } else {
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
                if(err) {
                    res.json({respond : {status:"forbidden", response: "Token not verified"}})
                } else {

                    req.sessionLogin = token
                    
                    req.UserCode = decoded.UserCode
                    req.UserName = decoded.UserName
                    req.RoleCode = decoded.RoleCode
                    req.RoleType = decoded.RoleType
                    req.RoleName = decoded.RoleName
                   
                    const request = req.body
                    if(request.hasOwnProperty('filter')) {
                        req.where = request.filter
                    } else {
                        req.where = {}
                    }
                    
                    if(decoded.RoleType == 'CUSTOMER') {
                        next()
                    } else {
                        res.json({respond : {status:'forbidden', response: 'Admin not Authorization access'}})
                    }

                }
            })
        }
    } catch (error) {
        res.json({respond : {status:'forbidden', response: 'No Authorization'}})
    }
}