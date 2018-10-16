"use strict"

/* create api */  
const api = require('@stormgle/account-base')

const DatabaseAbstractor = require("database-abstractor")
const userdb = new DatabaseAbstractor()
const dynamodb = require('@stormgle/userdb-dynamodb-driver')

userdb.use(dynamodb());

/* fuunction to send reset password email */
const aws = require('aws-sdk');

const lambda = new aws.Lambda();

function sendEmailFn(functionName) {
  return function sendEmail({email, token}, callback) {

    console.log(`Sending email to ${email}`)

    lambda.invoke(
      {
        FunctionName: functionName,
        InvocationType: "Event",
        Payload: JSON.stringify({recipient: email, token: token}, null, 2)
      },
      function(err, data) {
        if (err) {
          console.log(err)
          callback(err)
        } else {
          console.log('Send Email success')
          callback()
        }
      }
    )

  }
}
/* param add to api function */

const signup = {
  sendEmail: sendEmailFn('SendEmailVerifyEmail')
}

const sendVerifyEmail =  {
  sendEmail: sendEmailFn('SendEmailVerifyEmail')
}

const forgotPassword = {
  sendEmail: sendEmailFn('SendEmailResetPassword')
};

const form = {
  title: 'Expiup', 
  body:'Auth-O Service',
  endPoint: `https://auth.expiup.com/auth/reset_password`,
  redirect: {
    success: `https://auth-o.com/`
  }
};

const reset = {
  title: 'Expiup', 
  service: 'Expiup',
  redirect: `https://auth-o.com/`
}

const verifyEmail = {
  title: 'Expiup',
}

/* generate api functions */
api.useDatabase({ userdb })
   .generateFunctions({forgotPassword, form, reset, signup, verifyEmail, sendVerifyEmail});


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
  awsServerlessExpress.proxy(server, event, context);
}
  
