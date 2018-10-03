"use strict"

require('dotenv').config()

/* create api */  
const api = require('@stormgle/account-base')

const DatabaseAbstractor = require("database-abstractor")
const userdb = new DatabaseAbstractor()
const dynamodb = require('@stormgle/userdb-dynamodb-driver')

const region = 'ap-southeast-1';
const endpoint = 'dynamodb.ap-southeast-1.amazonaws.com';

userdb.use(dynamodb({ region, endpoint }));

const forgotPassword = {
  onSuccess: (token) => console.log(token.token),
  onFailure: (err) => console.log(err)
};

const form = {
  title: 'Auth-O', 
  body:'Auth-O Service',
  endPoint: `https://auth-o.com/auth/reset_password`,
  redirect: {
    success: `https://auth-o.com/`
  }
};

const reset = {
  title: 'Auth-O', 
  service: 'Expiup',
  redirect: `https://auth-o.com/`
}

api.useDatabase({ userdb })
   .generateFunctions({forgotPassword, form, reset});


/* create express app from api */  
const express = require('express')
const cors = require('cors')

const app = express();
app
  .use(cors())
  .use('/', api)


/* wrap into lambda */  
const awsServerlessExpress = require('aws-serverless-express')
const server = awsServerlessExpress.createServer(app)
exports.handler = (event, context) => {
  awsServerlessExpress.proxy(server, event, context)
}
  
