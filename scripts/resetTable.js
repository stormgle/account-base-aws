"use strict"

require('dotenv').config() // it should parse enviroment from yaml file

const UserDB = require('@stormgle/userdb-api');
const dynamodb = require('@stormgle/userdb-dynamodb')

const userdb = new UserDB();

const DB = {
  HOST: 'http://localhost',
  PORT: 3001
}

userdb.use(require('@stormgle/userdb-dynamodb')(
  {
    region : 'us-west-2', 
    endpoint : `${DB.HOST}:${DB.PORT}`
  },
  (err) => {
    if (err) {
      console.log('Failed to init local db')
      console.log(err);
    } else {
      userdb.dropTable(function(err, data) {
        if (err) {
          console.log('Failed to drop USERS table')
          console.log(err);
        } else {
          console.log('Dropped old USERS table')
          userdb.createTable(function(err, data) {
            if (err) {
              console.log('Failed to create table')
              console.log(err);
            } else {  
              console.log('Created new USERS table')  
              userdb.createUser(
                {
                  username: 'super',
                  login: { password: 'qwe'},
                  roles: ['super'],
                  uid: 'super-amin-special-uid',
                  profile: { email: ['super@team.com']}
                },
                () => {
                  console.log('Super admin user is: super / qwe')
                }
              )         
              userdb.createUser(
                {
                  username: 'admin',
                  login: { password: 'qwe'},
                  roles: ['admin','user'],
                  uid: 'admin-special-uid',
                  profile: { email: ['admin@team.com']}
                },
                () => {
                  console.log('Admin user is: admin / qwe')
                }
              )
            }
          })
        }
      })
    }
  }
))

