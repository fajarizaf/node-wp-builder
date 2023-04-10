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

    app.post('/portal/generate/subdomain' , async (req,res) => {

        try {

            let domainData = {
                "name": "tes.nodebuilder.my.id",
                "description": "My website",
                "hosting_type": "virtual",
                "hosting_settings": {
                  "ftp_login": "test_login",
                  "ftp_password": "Adayanghilang123@"
                },
                "base_domain": {
                  "id": 9,
                  "name": "nodebuilder.my.id",
                  "guid": "f94df526-1cbb-44a5-b3a6-0f45d5063f62"
                },
                "parent_domain": {
                  "id": 9,
                  "name": "nodebuilder.my.id",
                  "guid": "f94df526-1cbb-44a5-b3a6-0f45d5063f62"
                },
                "owner_client": {
                  "id": 5,
                  "login": "runi",
                  "guid": "ffa37855-1133-47c8-877f-d6ac45e0d348",
                  "external_id": 5
                },
                "ip_addresses": [
                  "93.184.216.34",
                  "2606:2800:220:1:248:1893:25c8:1946"
                ],
                "ipv4": [
                  "103.59.94.53"
                ],
                "plan": {
                  "name": "Unlimited"
                }
            }

            var nDomain = await DOMAIN.create(domainData)
            var nCMS = await CLI.install_wordpress()
            
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