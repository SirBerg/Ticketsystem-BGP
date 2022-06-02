import {pool} from './lib/connect'
import Cors from 'cors'

// Initializing the cors middleware
const cors = Cors({
  methods: ['GET', 'HEAD'],
})

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}
export default async function handler(req, res){
    await runMiddleware(req, res, cors)
    const mariadb = require('mariadb')
    const conf = require('../../conf.js')

    const pool = {
        host : conf.host,
        user : conf.user,
        password : conf.password,
        database : 'Ticketsystem',
        connectionLimit: 5
    }
    let query = `
    SELECT Incident.*, M.Mitarbeiter_Name, A.Abteilung_Name FROM Incident
        INNER JOIN Mitarbeiter M on Incident.Mitarbeiter_ID = M.Mitarbeiter_ID
        INNER JOIN Abteilung A on Incident.Abteilung_ID = A.Abteilung_ID
    `

    const conn = await mariadb.createConnection(pool)
    try{
        let tickets = await conn.query(query)
        res.status(200).json(tickets)
        await conn.end()
    }
    catch(err){
        console.log('ERR', err)
        res.status(500).send("Mysql_Error")
        await conn.end()
    }
}