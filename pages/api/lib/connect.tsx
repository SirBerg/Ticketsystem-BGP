const mariadb = require('mariadb')
const conf = require('../../../conf.js')

export const pool = mariadb.createPool({
    host : conf.host,
    user : conf.user,
    password : conf.password,
    database : 'Ticketsystem',
    connectionLimit: 5
})
