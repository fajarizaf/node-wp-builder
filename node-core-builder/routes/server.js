// middleware call
const { verifyToken } = require('../middleware/verifyToken')

// include controllers
const apicall = require("../controllers/call")

//include lib

const server = app => {

    app.get('/server' , verifyToken , async (req,res) => {

        try {

            var execute = await apicall.service('GET', req.server_host+'/api/v2/server', req)
            
            res.json({status: 'success', response: execute})
            
        } catch(error) {

            res.send({status: 'failed', response: error.message})

        }

    })


    app.get('/server/ips' , verifyToken , async (req,res) => {

        try {

            var execute = await apicall.service('GET', req.server_host+'/api/v2/server/ips', req)
            
            res.json({status: 'success', response: execute})
            
        } catch(error) {

            res.send({status: 'failed', response: error.message})

        }

    })
    
}

module.exports = server