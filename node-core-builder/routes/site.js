// middleware call
const { verifyToken } = require('../middleware/verifyToken')

// include controllers
const SITE = require("../controllers/cont-site")

//include lib

const site = app => {

    app.get('/site' , verifyToken , async (req,res) => {

        try {

            var content = await SITE.list(req)
            
            res.json(content)
            
        } catch(error) {

            res.send({status: 'failed', response: error.message})

        }

    })

    app.get('/site/detail' , verifyToken , async (req,res) => {

        try {

            var content = await SITE.detail(req)
            
            res.json(content)
            
        } catch(error) {

            res.send({status: 'failed', response: error.message})

        }

    })
    
}

module.exports = site