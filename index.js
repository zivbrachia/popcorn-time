'use strict'

let express = require("express");
let app = express();
//let env = require('./lib/environment');

let port = require('./settings/config').port;

require('./settings/config')(app);

//require('./routes')(app);

app.listen(port);

console.log('Your application is running on http://localhost:' + port);