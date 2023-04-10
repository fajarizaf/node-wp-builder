// include model
const models = require('../models')
const UserAction = models.UserAction
const UserActionRole = models.UserActionRole


// include lib
exports.UserAccesss = async (UserCode) => {
    try {
        const access = await UserActionRole.findOne({
            where: {
                UserCode: UserCode
            }
        })
        return convertToJson({respond:{status:'success',data: access}})  
    } catch (e) {
        return convertToJson({respond:{status:'error',response: e.message}})  
    }
}   


exports.GetDefaultRoleAccess = (RoleID, RoleName, RoleType) => new Promise((resolve, reject) => {
   
    UserAction.findOne({
        where: {
            RoleCode: RoleID
        },
        attributes : [
            'RoleAction'
        ]
    })
    .then((respond) => {
        if(respond != '') {
            resolve(convertToJson({
                respond: {
                    status: 'success',
                    RoleName: RoleName,
                    RoleType: RoleType,
                    data: JSON.parse(respond.RoleAction)
                }
            }))
        } else {
            resolve(convertToJson({respond:{status:'failed',response: 'data role access tidak ditemukan'}}))
        }

    })
    .catch((e) => {
        resolve(
            convertToJson(
                {respond: {status: 'error',response: e.message}}
            )
        )
    })
})




exports.generatedToken = () => {
    var token = generator.generate({
        length: 25,
        numbers: true
    });
    return token
}

exports.generatedPass = () => {
    var password = generator.generate({
        length: 15,
        numbers: true
    });
    return password
}

function padLeadingZeros(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}


function convertToJson(strings) {
    let string = JSON.stringify(strings)
    return JSON.parse(string)
}