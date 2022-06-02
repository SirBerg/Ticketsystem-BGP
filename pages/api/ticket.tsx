//import {requestObject} from './new_incident'
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
export default async function Handler(req, res){
    await runMiddleware(req, res, cors)
    const mariadb = require('mariadb')
    const conf = require('../../conf.js')

    const pool = {
        host : conf.host,
        user : conf.user,
        password : conf.password,
        database : 'Ticketsystem',
        connectionLimit : 100
    }

    if(req.method == "GET" && req.query.id){
        const conn = await mariadb.createConnection(pool)
        let query = `
            SELECT Incident.*, M.Mitarbeiter_Name, A.Abteilung_Name FROM Incident
                INNER JOIN Mitarbeiter M on Incident.Mitarbeiter_ID = M.Mitarbeiter_ID
                INNER JOIN Abteilung A on Incident.Abteilung_ID = A.Abteilung_ID
            WHERE 
                Incident.Incident_ID = "${req.query.id.replaceAll('"', '""')}"
            `
        try{
            let incident = await conn.query(query)
            console.log('[*] Logged incidents: '+ incident.length)
            console.log('[*] Time: '+ Date.now())
            res.status(200).json(incident)
            await conn.end()
        }
        catch(err){
            await conn.end()
            console.log(err)
            res.status(500).send("Mysql_Error")

        }
        return
    }
    res.status(400).send("Bad Request (ID Missing or Wrong Request Type)")
}