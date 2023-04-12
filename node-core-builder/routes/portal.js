// middleware call
const { verifyToken } = require('../middleware/verifyToken')

// include controllers
const DOMAIN = require("../controllers/cont-domain")
const CUSTOMER = require("../controllers/cont-customer")
const SERVER = require("../controllers/cont-server")
const WORDPRESS  = require("../controllers/cont-wordpress")
const CLI  = require("../controllers/cont-cli")

//include lib

const portal = app => { 


    app.post('/portal/generate/subdomain' , verifyToken , async (req,res) => {

        try {
            
            var nDomain = await DOMAIN.create_subdomain(req)
            
            res.json({status: 'success', response: nDomain})
            
        } catch(error) {

            res.send({status: 'failed', response: error})

        }

    })


    app.post('/portal/generate/cms/' , async (req,res) => {

        try {

            var nCMS = await WORDPRESS.install()
            
            res.json({status: 'success', response: nCMS})
            
        } catch(error) {

            res.send({status: 'failed', response: error})

        }

    })


    app.post('/portal/generate/ssl' , async (req,res) => {

        try {

            var nCMS = await CLI.install_ssl_lets_encrypt()
            
            res.json({status: 'success', response: nCMS})
            
        } catch(error) {

            res.send({status: 'failed', response: error})

        }

    })


    app.post('/portal/generate/theme/' , async (req,res) => {

        try {
            
            var data = {}

            // generate starter template
            var execute = await WORDPRESS.starter_templates()
            
            res.json({status: 'success', response: execute})
            
        } catch(error) {

            res.send({status: 'failed', response: error.message})

        }

    })


    app.post('/portal/plugin/activate' , async (req,res) => {

      try {

          var nTheme = await WORDPRESS.activated_plugin()
          
          res.json({status: 'success', response: nTheme})
          
      } catch(error) {

          res.send({status: 'failed', response: error})

      }

    })


    app.post('/portal/plugin/install' , async (req,res) => {

      try {

          var nTheme = await WORDPRESS.install_plugin()
          
          res.json({status: 'success', response: nTheme})
          
      } catch(error) {

          res.send({status: 'failed', response: error})

      }

    })
    

}

module.exports = portal