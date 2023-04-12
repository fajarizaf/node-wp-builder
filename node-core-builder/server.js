const express = require('express')
require('dotenv').config()
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const sequelize = require('./models/').sequelize

const env = process.env.NODE_ENV || 'local';
const config = require(__dirname + '/config/config.json')[env];

app.use(bodyParser.json())
app.use(cookieParser())
app.set("trust proxy", true)

require('./routes/portal')(app)
require('./routes/domain')(app)
require('./routes/customer')(app)
require('./routes/wordpress')(app)
    

const mysql = require('mysql2/promise')

mysql.createConnection({
    host     : config.host,
    user     : config.username,
    password : config.password
}).then((connection) => {
    connection.query('CREATE DATABASE IF NOT EXISTS '+config.database+';').then(() => {
        // Safe to use sequelize now
    })
})

sequelize.sync().then(function(){
    const PORT = process.env.PORT || 3010;
    app.listen(PORT, () => {
      console.log('Server udah running sekarang')
    })
}, function(err){
    // catch error here
    console.log(err);
});
