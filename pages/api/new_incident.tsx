import sleep from 'sleep-promise';
import {pool} from './lib/connect'

export type requestObject = {
    "Abteilung":string,
    "Mitarbeiter":string,
    "Kurzbeschreibung":string,
    "Beschreibung":string,
    "Kategorie":string,
    "Prio":string,
    "Dringlichkeit":string,
    "Auswirkung":string,
    "Status":string,
    "Meldende_Person":string,
    "SD_Mitarbeiter":string,
    "Tel":string,
    "Email":string,
    "Typ":string,
}
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
    if(req.method == "POST"){

        //If the request is POST we can continue
        let body:requestObject = req.body

        const mariadb = require('mariadb')
        const conf = require('../../conf.js')
    
        const pool = {
            host : conf.host,
            user : conf.user,
            password : conf.password,
            database : 'Ticketsystem',
            connectionLimit: 5
        }

        //fetching the mitarbeiter from db
        //@ts-ignore
        body = await JSON.parse(body)
        let query = `
            SELECT M.*, A.Abteilung_Name FROM Mitarbeiter M
                INNER JOIN Abteilung A ON M.Abteilung_ID = A.Abteilung_ID
            WHERE M.Mitarbeiter_Name = "${body.Mitarbeiter}"
            `
        let conn = await mariadb.createConnection(pool)

        conn.query(query).then(async (rows)=>{
            let mitarbeiter:any = "1"
            let abteilung:any = "1"

            if(rows.length != 0){
                mitarbeiter = rows[0].Mitarbeiter_ID
                abteilung = rows[0].Abteilung_ID
            }

            //inserting into DB
            query = `
                INSERT INTO Incident (Abteilung_ID, Mitarbeiter_ID, Kurzbeschreibung, Beschreibung, Prio, Dringlichkeit, Auswirkung, Meldende_Person, SD_Mitarbeiter, Tel, Email, Status, Kategorie, Typ) 
                    VALUES
                        ('${parseInt(abteilung)}', '${parseInt(mitarbeiter)}', '${body.Kurzbeschreibung.replaceAll("'", "''")}', '${body.Beschreibung.replaceAll("'", "''")}', '${body.Prio.replaceAll("'", "''")}', '${body.Dringlichkeit.toString().replaceAll("'", "''")}', '${body.Auswirkung.toString().replaceAll("'", "''")}', '${body.Meldende_Person.replaceAll("'", "''")}', '${body.SD_Mitarbeiter.replaceAll("'", "''")}', '${body.Tel.replaceAll("'", "''")}', '${body.Email.replaceAll("'", "''")}', '${body.Status.replaceAll("'", "''")}', '${body.Kategorie.replaceAll("'", "''")}', '${body.Typ.replaceAll("'", "''")}')
                `

            await conn.query(query)
            console.log("INSERTED")
            await conn.end()
            res.status(200).json({"message":"Success"})
        })

        return;
    }

    res.status(400).json({"error":"This Endpoint only accepts GET Requests, but a Request of Type "+req.method+' was sent'})
}