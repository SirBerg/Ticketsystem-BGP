import { requestObject } from "./new_incident";
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
    if(req.method != "POST"){
        res.status(400).send("This Endpoint only Accepts POST Requests but a "+req.method+" was recieved");
        return
    }

    const body:requestObject = JSON.parse(req.body)
    const mariadb = require('mariadb')
    const conf = require('../../conf.js')

    const config = {
        host : conf.host,
        user : conf.user,
        password : conf.password,
        database : 'Ticketsystem',
        connectionLimit : 100
    }
    let conn = await mariadb.createConnection(config)

    let sql = `
        SELECT * FROM Mitarbeiter WHERE Mitarbeiter_Name = "${body.Mitarbeiter.replaceAll('"', '""')}"
    `
    let mitarbeiter_ID = await conn.query(sql).then(result => result[0].Mitarbeiter_ID)
    sql = `
        SELECT * FROM Abteilung WHERE Abteilung_Name = "${body.Abteilung.replaceAll('"', '""')}"
    `
    let abteilung_ID = await conn.query(sql).then(result => result[0].Abteilung_ID)
    sql = `
    UPDATE Incident
        SET Abteilung_ID = "${abteilung_ID}", Mitarbeiter_ID = "${mitarbeiter_ID}", Kurzbeschreibung = "${body.Kurzbeschreibung.replaceAll('"', '""')}", Beschreibung = "${body.Beschreibung.replaceAll('"', '""')}", Prio = "${body.Prio.toString().replaceAll('"', '""')}", Dringlichkeit = "${body.Dringlichkeit.toString().replaceAll('"', '""')}", Auswirkung = "${body.Auswirkung.toString().replaceAll('"', '""')}", Meldende_Person = "${body.Meldende_Person.replaceAll('"', '""')}", SD_Mitarbeiter ="${body.SD_Mitarbeiter.replaceAll('"','""')}", Tel = "${body.Tel.replaceAll('"', '""')}", Email = "${body.Email.replaceAll('"', '""')}", Status = "${body.Status.replaceAll('"', '""')}", Kategorie = "${body.Kategorie.replaceAll('"', '""')}", Typ = "${body.Typ.replaceAll('"', '""')}"
    WHERE
        Incident_ID = ${req.query.id.replaceAll('"', '""')}
    `
    try{
        let result = await conn.query(sql)
        res.status(200).json({"msg":"success"})
    }
    catch(e){
        console.log(e)
    }

}