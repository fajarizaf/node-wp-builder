// middleware call
const { verifyToken } = require('../middleware/verifyToken')

//include model
const models = require('../models')

// include controllers
const authentication = require('../controllers/cont-auth')
const user = require('../controllers/cont-user')
const apic = require("../controllers/apic")
const log = require("../controllers/cont-userlog")


//include lib
const IP = require('ip');

const auth = app => {
 
    // login non OTP
    app.post('/auth/login', async (req,res) => {

        try {

            const login = await authentication.Login(req.body)
            
            if(login.respond.status == 'success') {
                
                const updateToken = await authentication.updateToken(login.respond.UserCode,login.respond.accessToken)
                
                if(updateToken.respond.status == 'success') {

                    res.cookie('refreshToken', login.respond.refreshToken, {
                        httpOnly: true,
                        maxAge: 24 * 60 * 60 * 1000
                    })

                    const output = { respond: {status: "success", accessToken: login.respond.accessToken, refreshToken: login.respond.refreshToken}}
                    
                    // log activity
                    const createlog =  await log.createLogs(
                        login.respond.UserCode,
                        login.respond.UserName,
                        'auth/login', 
                        req
                    )
                        
                    res.send(output)
                } else {
                    res.send(updateToken)
                }
                
            } else {

                res.send(login)
            }
            
        } catch (error) {

            res.send(error)
        }

    })    

    // Refresh Token
    app.get('/auth/rtoken', async (req, res) => {

        try {
            const token = req.headers.authorization.split(' ')[1]
            let generate = await authentication.rtoken(req, token)
            res.send(generate)
        } catch (error) {
            res.send(error)
        }

    })

    // logout
    app.get('/auth/logout', verifyToken ,  async (req,res) => {

        try {
            const Logout = await authentication.updateToken(req.UserCode,'0')
            if(Logout.respond.status == 'success') {


                // log activity
                const getuser = await user.DetailUser(req.UserCode)
                const createlog =  await log.createLogs(req.UserCode,getuser.respond.data.ContactName,'auth/logout', req)


                res.clearCookie('refreshToken')
                res.send({status: "success", response: "Logout Berhasil Dilakukan"})
            } else {
                res.send(Logout)
            }
        } catch (error) {
            res.json(error)
        }

    })


    // forgotpass customer
    app.post('/auth/forgotpass', async (req,res) => {
        
        try {

            const cek = await user.cekUserEmail(req.body.email)
            
            if(cek.respond.status == 'success') {
                const proces = await user.forgotpass(cek.respond.UserCode)
                if(proces.respond.status == 'success') {

                    // log activity
                    const getuser = await user.DetailUser(cek.respond.UserCode)
                    const createlog =  await log.createLogs(cek.respond.UserCode,getuser.respond.data.ContactName,'auth/forgotpass', req)

                    dataEmail = {
                        action: 'Forgot Password',
                        send_to: cek.respond.Email,
                        name: cek.respond.ContactName,
                        vcode: proces.respond.vcode
                    }
                                
                    // kirim email user aktivasi
                    const send = await apic.services('POST', dataEmail, process.env.URL_EMAIL_SERVICES)
                    
                    res.send(proces)
                } else {
                    res.send(proces)
                }
            } else {
                res.json({respond: {status: 'failed', response: 'Email tidak terdaftar'}})
            }
            
        } catch (error) {
            res.json(error)
        }
 
    })

    // forgotpass
    app.post('/auth/changepass', async (req,res) => {

        try {
            const cek = await user.cekVerifyCode(req.body.vcode)
            
            if(cek.respond.status == 'success') {
                const process = await authentication.changepass(req.body, cek.respond.UserCode)
                console.log(process)
                if(process.respond.status == 'success') {

                    // log activity
                    const getuser = await user.DetailUser(cek.respond.UserCode)
                    const createlog =  await log.createLogs(cek.respond.UserCode,getuser.respond.data.ContactName,'auth/changepass', req)

                    const remove = await user.removeVerifiedCode(cek.respond.UserCode)

                    res.send(process)
                } else {
                    res.send(process)
                }
            } else {
                res.send(cek)
            }
            
        } catch (error) {
            res.json(error)
        }

    })

}

module.exports = auth