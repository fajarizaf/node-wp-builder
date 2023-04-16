// middleware call
const { verifyToken } = require('../middleware/verifyToken')

// include controllers
const apicall = require("../controllers/call")
const DOMAIN = require("../controllers/cont-domain")

//include lib

const domain = app => {

    app.get('/domain' , verifyToken , async (req,res) => {

        try {
            
            var domain_id = await req.query.id
            var execute = await apicall.service('GET', req.server_host+'/api/v2/domains/'+domain_id, req)
            res.json({status: 'success', response: execute})
            
        } catch(error) {

            res.send({status: 'failed', response: error.message})

        }

    })


    app.get('/domain/list' , verifyToken , async (req,res) => {

        try {   
            
            var data = {}
            var execute = await apicall.services('GET',data, req.server_host+'/api/v2/domains', req)    
            res.json({status: 'success', response: execute})
            
        } catch(error) {

            res.send({status: 'failed', response: error.message})

        }

    })


    app.delete('/domain' , verifyToken , async (req,res) => {

        try {
            
            var execute = await DOMAIN.delete(req)
            res.json({status: 'success', response: execute})
            
        } catch(error) {

            res.send({status: 'failed', response: error.message})

        }

    })
    
}

module.exports = domain