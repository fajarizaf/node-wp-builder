//include model
const models = require('../models')
const UserCredential = models.UserCredential
const UserProfile = models.UserProfile
const Role = models.Role


//include lib
var md5 = require('md5')
var jwt = require('jsonwebtoken')


// controller login with email
exports.Login = (data) => new Promise((resolve, reject) => {

    UserCredential.findAll({
        where: {
            UserLogin : data.email
        },
        include: [
            { 
                model: UserProfile, as: 'usr_profile', 
                attributes : [
                    'ContactName', 
                ]
            },
            { 
                model: Role, as: 'usr_role',
                required : true,
                attributes : [
                    'RoleName','RoleType'
                ],
            }
        ]
    })
    .then((respond) => {
        
        if(respond != '') {
            
            if(md5(data.password) == respond[0].PasswordLogin) {
            
                const dataCompany = respond[0].usr_profile.usr_company
                const dataUser = respond[0].usr_profile
                const dataRole = respond[0].usr_role


                if(respond[0].FgActive == 'Y') {

                    const UserCode    =  respond[0].UserCode
                    const UserName    =  dataUser.ContactName
                    const UserType    =  respond[0].UserType
                    const RoleCode    =  respond[0].RoleCode
                    const UserBranch  =  respond[0].Branch
                    const AccountType =  respond[0].AccountType
                    const RoleName    =  dataRole.RoleName
                    const RoleType    =  dataRole.RoleType

                    // generate access token
                    const accessToken = jwt.sign({UserCode,UserName,UserType,RoleCode,AccountType,RoleName,RoleType,UserBranch}, process.env.ACCESS_TOKEN_SECRET, {
                        expiresIn: '24h'
                    })

                    // generate refresh token
                    const refreshToken = jwt.sign({UserCode,UserName,UserType,RoleCode,AccountType,RoleName,RoleType,UserBranch}, process.env.REFRESH_TOKEN_SECRET, {
                        expiresIn: '24h'
                    })

                    resolve(
                        convertToJson({
                            respond: { 
                                status: 'success',
                                UserCode: UserCode,
                                UserName: UserName,
                                accessToken: accessToken,
                                refreshToken: refreshToken
                            }
                        })
                    )

                } else {
                    resolve(
                        convertToJson({
                            respond: {
                                status: 'failed',
                                response: 'Akun telah di nonaktifkan'
                            }
                        })
                    )
                }

            } else {

                resolve(
                    convertToJson({
                        respond: {
                            status: 'failed',
                            response: 'Password yang anda masukan salah'
                        } 
                    })
                )

            }

        } else {

            resolve(
                convertToJson({
                    respond: {
                        status: 'failed',
                        response: 'Email Tidak Terdaftar'
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
                    response: e.message
                }
            })
        )

    })
})


exports.rtoken = (data, refreshToken) => new Promise((resolve, reject) => {

    if(refreshToken == undefined) {
        resolve(convertToJson({respond: {status:"forbidden",response:"no valid token"}}))
    }
    
    UserCredential.findAll({
        where: {
            rtoken: refreshToken
        },
        include: [
            { 
                model: UserProfile, as: 'usr_profile', 
                attributes : [
                    'ContactName', 
                ]
            },
            { 
                model: Role, as: 'usr_role',
                required : true,
                attributes : [
                    'RoleName','RoleType','Department'
                ],
            }
        ]
    })
    .then((res) => {
        
        if(!res[0].id) {
            resolve(convertToJson({respond: {status:"failed",response:"no valid token"}}))
        } else {
            //verifikasi existing refreshToken
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
                if(err) {
                    resolve(convertToJson({respond: {status:"failed",response:"failed token verification, token expired"}}))
                } else {

                    const dataCompany = res[0].usr_profile.usr_company
                    const dataUser = res[0].usr_profile
                    const dataRole = res[0].usr_role

                    const UserCode      =  res[0].UserCode
                    const UserName      =  dataUser.ContactName
                    const UserType      =  res[0].UserType
                    const RoleCode      =  res[0].RoleCode
                    const UserBranch    =  res[0].Branch
                    const AccountType   =  res[0].AccountType
                    const CompanyCode   =  dataCompany[0].CompanyCode
                    const RoleName      =  dataRole.RoleName
                    const RoleType      =  dataRole.RoleType
                    const Department    =  dataRole.Department
                    
                    // generate new access token
                    const accessToken = jwt.sign({UserCode,UserName,UserType,RoleCode,CompanyCode,AccountType,RoleName,RoleType,UserBranch,Department}, process.env.ACCESS_TOKEN_SECRET, {
                        expiresIn: '24h'
                    })

                    resolve(convertToJson({
                            respond: {
                                status:"success",
                                response: "Generate new Access Token",
                                accessToken: accessToken
                            }
                    }))
                }
            })
        }
    })
    .catch((e) => {
        resolve(
            convertToJson({
                respond: {
                    status: "error",
                    response: e.message
                }
            })
        )
    })
    
})


exports.updateToken = (UserCode,rtoken) => new Promise((resolve, reject) => {
   
    UserCredential.update({rtoken:rtoken}, {
        where: {
            UserCode: UserCode
        }
    })
    .then((respond) => {
        if(respond != '') {
            resolve(
                convertToJson({
                    respond: {
                        status: 'success',
                        response: 'Update Token Berhasil Dilakukan'
                    } 
                })
            )  
        } else {
            resolve(
                convertToJson({
                    respond: {
                        status: 'failed',
                        response: 'Update Token Gagal Dilakukan'
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



exports.getToken = (UserLogin) => new Promise((resolve, reject) => {
   
    UserCredential.findOne({
        where: {
            UserLogin: UserLogin
        },
        attributes: ['rtoken']
    })
    .then((respond) => {
        if(respond) {
            resolve(
                convertToJson({
                    respond: {
                        status: 'success',
                        token: respond.rtoken
                    } 
                })
            )  
        } else {
            resolve(
                convertToJson({
                    respond: {
                        status: 'failed',
                        response: 'refresh token empty'
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



exports.changepass = (data, usercode) => new Promise((resolve, reject) => {
   
    const newpass = md5(data.new_password)

    UserCredential.update({PasswordLogin: newpass}, {
        where: {
            UserCode: usercode
        }
    })
    .then((respond) => {
        if(respond != '') {
            resolve(
                convertToJson({
                    respond: {
                        status: 'success',
                        response: 'Perubahan password telah berhasil dilakukan'
                    } 
                })
            )  
        } else {
            resolve(
                convertToJson({
                    respond: {
                        status: 'failed',
                        response: 'Perubahan password gagal dilakukan'
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

exports.generateQRCode = (req) => new Promise ((resolve, reject) => {



})



function convertToJson(strings) {
    let string = JSON.stringify(strings)
    return JSON.parse(string)
}