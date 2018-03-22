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
  'user/signup',
  'user/login',
  'user/update/profile',
  'user/update/password',
  'admin/query/user',
  'admin/update/user'
]
funcs.forEach(func => {
  // removed role in the exposed api
  app.createFunction(`${func.replace(/^\w+\//,"/")}`, require(`@stormgle/user-services/api/${func}`))
})  

const server = awsServerlessExpress.createServer(app)
exports.handler = (event, context) => {
  awsServerlessExpress.proxy(server, event, context)
}
  
