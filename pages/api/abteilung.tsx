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
        connectionLimit: 5
    }

    const conn = await mariadb.createConnection(pool)
    let query = `
        SELECT * FROM Abteilung ORDER BY Abteilung_ID
    `

    try{
        let abteilungen = await conn.query(query)
        res.status(200).json(abteilungen)
    }
    catch(err){
        console.log(err)
        res.status(500).send("Mysql_Error")
    }
    await conn.end()
}