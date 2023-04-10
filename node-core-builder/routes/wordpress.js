// middleware call

// include controllers
const WORDPRESS = require("../controllers/cont-wordpress")

//include lib

const wordpress = app => {


    app.get('/wordpress/list' , async (req,res) => {

        try {
            
            var data = {}
            var execute = await WORDPRESS.list()
            
            res.json({status: 'success', response: execute})
            
        } catch(error) {

            res.send({status: 'failed', response: error.message})

        }

    })


    app.get('/wordpress/starter/templates' , async (req,res) => {

        try {
            
            var data = {}
            var execute = await WORDPRESS.starter_templates()
            
            res.json({status: 'success', response: execute})
            
        } catch(error) {

            res.send({status: 'failed', response: error.message})

        }

    })

}

module.exports = wordpress