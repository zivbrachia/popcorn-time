'use strict'

let express = require('express');
let bodyParser = require('body-parser');
//let morgan      	= require('morgan');

var port = process.env.PORT || 8787;

module.exports = function (app) {

    // Make the files in the public folder available to the world
    app.use(express.static(__dirname + '/public'));

    // use body parser so we can get info from POST and/or URL parameters
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    let apiVersion1 = require("../routes/api_v_1");
    app.use("/v1.0", apiVersion1);
};

//module.exports.secret = secret;
module.exports.port = port;

