const express = require('express')
require('dotenv').config()
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

app.use(bodyParser.json())
app.use(cookieParser())
app.set("trust proxy", true)

require('./routes/portal')(app)
require('./routes/domain')(app)
require('./routes/customer')(app)
require('./routes/wordpress')(app)
    
const PORT = process.env.PORT || 3010;
app.listen(PORT, () => {
    console.log('Server udah running sekarang')
})
