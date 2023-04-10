// middleware call
const { verifyToken } = require('../middleware/verifyToken')

// include controllers
const apicall = require("../controllers/call")
const CUSTOMER = require("../controllers/cont-customer")

//include lib

const customers = app => {


    app.get('/customer' , async (req,res) => {

        try {

            var execute = await CUSTOMER.detail(req.query.client_id)
            
            res.json({
                status: 'success', 
                response: execute
            })
            
        } catch(error) {
            res.send({status: 'failed', response: error})
        }

    })


    app.get('/customer/list' , async (req,res) => {
        
        try {
            
            var execute = await CUSTOMER.list()
            
            res.json({status: 'success', response: execute})
            
        } catch(error) {
            res.send({status: 'failed', response: error})
        }

    })


    app.post('/customer/create' , async (req,res) => {
        try {
            
            var execute = await CUSTOMER.create(req.body)
            
            res.json({status: 'success', response: execute})
            
        } catch(error) {
            res.send({status: 'failed', response: error})
        }

    })


    app.delete('/customer' , async (req,res) => {
        try {

            var execute = await CUSTOMER.delete(req.query.client_id)
            
            res.json({status: 'success', response: execute})
            
        } catch(error) {
            res.send({status: 'failed', response: error})
        }

    })
    

}

module.exports = customers