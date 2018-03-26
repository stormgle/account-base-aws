"use strict"

require('dotenv').config()

const awsServerlessExpress = require('aws-serverless-express')
const app = require('@stormgle/user-services')
const dynamodb = require('@stormgle/userdb-dynamodb')

const DB = {
  HOST: process.env.DB_HOST,
  PORT: process.env.DB_PORT
}

const dbDriver = dynamodb({ 
  region : 'us-west-2', 
  endpoint : `${DB.HOST}:${DB.PORT}`
});

app
  .useDbDriver(dbDriver)

const funcs = [
  'post/auth/signup',
  'post/auth/login',
  'post/me/update_profile',
  'post/me/update_password',
  'post/users/update',
  'get/users/:username'
]
funcs.forEach( (func) => {
  const { method, uri, includePath } = app.parseApi(func);
  app.createFunction(method, uri, require(`@stormgle/user-services/api/${includePath}`))
})  

const server = awsServerlessExpress.createServer(app)
exports.handler = (event, context) => {
  awsServerlessExpress.proxy(server, event, context)
}
  
