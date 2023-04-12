const express = require('express')
require('dotenv').config()
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const sequelize = require('./models/').sequelize
const cors = require('cors')

const env = process.env.NODE_ENV || 'local';
const config = require(__dirname + '/config/config.json')[env];

// call controllers
const log = require("./controllers/cont-userlog")

app.use(cors({
  credentials:true, 
  origin:[config.url_frond_local,config.url_frond_staging,config.url_frond_prod]
}))

app.use(bodyParser.json())
app.use(cookieParser())

require('./routes/auth')(app)


const captureLog =  (req, res, next)  => {

  var methods = req.method

  if(methods == 'POST' || methods == 'PUT') {
  
    const defaultWrite = res.write;
    const defaultEnd = res.end;
    const chunks = [];

    res.write = (...restArgs) => {
      chunks.push(new Buffer(restArgs[0]));
      defaultWrite.apply(res, restArgs);
    };

    res.end = (...restArgs) => {

      if (restArgs[0]) {
        chunks.push(new Buffer(restArgs[0]));
      }
  
      const body = Buffer.concat(chunks).toString('utf8');

      // validity check login
      if(req.headers.authorization == undefined) {
        
      } else {

        // decode token get session login user
        const token = req.headers.authorization.split(' ')[1]

        if(token != '') {

            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
                if(err) {
                    console.log({respond : {status:"error", response: "failed decoded token from capture log"}})
                } else {

                    req.sessionLogin = token
                          
                    req.UserCode = decoded.UserCode
                    req.UserName = decoded.UserName

                    // save to db userlog
                    // log activity
                    log.createLogs(
                      req.UserCode,
                      req.UserName,
                      req.path, 
                      req,
                      body
                    )

                }
            })
        }

      }
      
      defaultEnd.apply(res, restArgs);

    };
  }

  next();
};

app.use(captureLog)

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
    const PORT = process.env.PORT || 3011;
    app.listen(PORT, () => {
      console.log('Server udah running sekarang')
    })
  }, function(err){
    // catch error here
    console.log(err);
  });
