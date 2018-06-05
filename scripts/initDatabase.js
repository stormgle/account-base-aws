"use strict"

require('dotenv').config()

const host = process.env.DB_HOST;
const port = process.env.DB_PORT;

const userdb = require('./userdb')

console.log('\nInit Database\n')
userdb.use({host,port}).new();
