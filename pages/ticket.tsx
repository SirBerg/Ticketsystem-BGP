import {Box, Center} from '@chakra-ui/react'
import {Input, Badge, Heading} from '@chakra-ui/react'
import {useRouter} from 'next/router'
import { useEffect, useState } from 'react'
import {  FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Button,
    Textarea,
    Text
} from "@chakra-ui/react"
import { Spinner } from '@chakra-ui/react'
import * as chakra_sel from 'chakra-react-select'
import {InputGroup, InputLeftAddon} from '@chakra-ui/react'
import {Select} from '@chakra-ui/react'
import {Grid, GridItem} from '@chakra-ui/react'
import {requestObject} from './api/new_incident'
import Link from 'next/link'

export async function getServerSideProps(context){
    const conf = require('../conf.js')
    var requestOptions:any = {
        method: 'GET',
        redirect: 'follow'
      };
    
      let ticket_obj:requestObject
      await fetch("https://ticketsystem.izanami.dev/api/ticket?id="+context.query.id, requestOptions)
        .then(response => response.text())
        .then(result => ticket_obj = JSON.parse(result))
        .catch(error => console.log('error', error));
    let is_edit = context.query.is_edit
    if(is_edit){
        is_edit = true
    }
    else{
        is_edit = false
    }
    let username = context.query.username
    console.log(username)
    if(!username){
        username = "anonym"
    }
    return {props: {
        "ticket_id": context.query.id,
        "ticket_obj": ticket_obj[0],
        "is_edit" : is_edit,
        "username": username
    }}
}

export default function Handler({ticket_id, ticket_obj, is_edit, username}){
    const [email, setEmail] = useState(ticket_obj.Email)
    const [SD_Mitarbeiter, setSDMitarbeiter] = useState(ticket_obj.SD_Mitarbeiter)
    const [warn, setWarn] = useState()
    let array_auswirkung = [
        "Ganzes Unternehmen",
        "Mehrere Abteilungen",
        "Ganze Abteilung",
        "Mehrere Mitarbeiter",
        "Einzelner Mitarbeiter"
    ]
    let array_dringlichkeit = [
        "Sofort",
        "Ein Tag",
        "Mehrere Tage"
    ]
    let obj_label_color = {
        "Offen": "red",
        "In Bearbeitung": "orange",
        "Geschlossen": "green"
    }
    let obj_label_color_prio = {
        "Prio 1" : "red",
        "Prio 2" : "red",
        "Prio 3" : "yellow",
        "Prio 4" : "yellow",
        "Prio 5" : "green",
        "Prio 6" : "green",
        "Prio 7" : "green",
        "Prio 8" : "green"
    }
    useEffect (() => {
        if(email == null){
            setEmail('Nicht Angegeben')
        }
        if(SD_Mitarbeiter == "undefined" || SD_Mitarbeiter == null || SD_Mitarbeiter == undefined || !SD_Mitarbeiter){
            setSDMitarbeiter('Nicht Angegeben')
        }
        if(is_edit == true){
            //@ts-ignore
            setWarn(<Text color="red">Änderungen können eine kurze Zeit benötigen um in Kraft zu treten</Text>)
        }
        console.log(ticket_obj)
        console.log("%cHallo!", "color: red; font-family: sans-serif; font-size: 4.5em; font-weight: bolder; text-shadow: #000 1px 1px;");
        console.log('Wenn du weißt wie man hiermit umgeht, komm und hilf mir: https://www.github.com/SirBerg/Ticketsystem')
    },[])
    return (
        <Box bgColor="#333" h="100%">
            <Box h="100vh" bgColor="#333">
                <Center h="10vh" backgroundColor="#333" color="white" fontFamily="sans-serif">
                    <Heading size="2xl">Ticket NO. {ticket_id}</Heading>
                </Center>
                <Center>
                    {warn}
                </Center>
                <Center h="100vh" backgroundColor="#333">
                    <Box backgroundColor="#454545" h="90%" w="80%" color="#f5f5f5" borderRadius="10px" minW="120vh">
                        <Box h="30%" w="40%" float="left" m={[10]}>
                            <Center h="10%">
                                <Heading>Kontaktinformationen</Heading>
                            </Center>
                            <FormControl fontFamily="mono">
                                <br></br>
                                <Center>
                                    <FormLabel htmlFor="name">Name</FormLabel>
                                </Center>
                                <Center>
                                    <Box bgColor="#333" w="50%" >
                                        <Center>
                                            {ticket_obj.Meldende_Person}
                                        </Center>
                                    </Box>
                                </Center>
                                <br></br>
                                <Center>
                                    <FormLabel htmlFor="email">Email</FormLabel>
                                </Center>
                                <Center>
                                    <Box bgColor="#333" w="50%">
                                        <Center>
                                            {email}
                                        </Center>
                                    </Box>
                                </Center>
                                <br></br>
                                <Center>
                                    <FormLabel htmlFor="tel">Telefonnummer</FormLabel>
                                </Center>
                                <Center>
                                    <Box bgColor="#333" w="50%">
                                        <Center>
                                            {ticket_obj.Tel}
                                        </Center>
                                    </Box>
                                </Center>
                                <br></br>
                                <Center>
                                    <FormLabel>Meldender SD Mitarbeiter</FormLabel>
                                </Center>
                                <Center>
                                    <Box bgColor="#333" w="50%">
                                        <Center>
                                            {SD_Mitarbeiter}
                                        </Center>
                                    </Box>
                                </Center>
                            </FormControl>
                        </Box>
                        <Box h="30%" w="40%" float="right" m={[10]}>
                            <Center h="10%">
                                <Heading>Ticketinformationen</Heading>
                            </Center>
                            <FormControl fontFamily="mono">
                                <br></br>
                                <Center>
                                    <FormLabel htmlFor="name">Kurzbeschreibung</FormLabel>
                                </Center>
                                <Center>
                                    <Box bgColor="#333" maxW="50%" w="50%">
                                        <Center>
                                            <Text whiteSpace="pre-line">
                                                {ticket_obj.Kurzbeschreibung}
                                            </Text>
                                        </Center>
                                    </Box>
                                </Center>
                                <br></br>
                                <Center>
                                    <FormLabel htmlFor="email">Beschreibung</FormLabel>
                                </Center>
                                <Center>
                                    <Box bgColor="#333" maxW="50%" w="50%" maxH="30vh" h="30vh">
                                        <Center>
                                            <Text whiteSpace="pre-line" overflowY="scroll" maxH="30vh" w="95%">
                                                {ticket_obj.Beschreibung}
                                            </Text>
                                        </Center>
                                    </Box>
                                </Center>
                                <br></br>
                                <Center>
                                    <FormLabel htmlFor="tel">Status</FormLabel>
                                </Center>
                                <Center>
                                    <Box bgColor="#333" w="50%">
                                        <Center>
                                            <Badge colorScheme={obj_label_color[ticket_obj.Status]}>{ticket_obj.Status}</Badge>
                                        </Center>
                                    </Box>
                                </Center>
                                <br></br>
                                <Center>
                                    <FormLabel>Kategorie</FormLabel>
                                </Center>
                                <Center>
                                    <Box bgColor="#333" w="50%">
                                        <Center>
                                            {ticket_obj.Kategorie}
                                        </Center>
                                    </Box>
                                </Center>
                                <br></br>
                                <Center>
                                    <FormLabel>Ticket Typ</FormLabel>
                                </Center>
                                <Center>
                                    <Box bgColor="#333" w="50%">
                                        <Center>
                                            {ticket_obj.Typ}
                                        </Center>
                                    </Box>
                                </Center>
                                <br></br>
                                <br></br>
                                <Center>
                                    <Button bgColor="#6CC644"><Link href={"/edit?id="+ticket_id+'&username='+username}>Bearbeiten</Link></Button>
                                </Center>
                                <br></br>
                                <Center>
                                    <Button bgColor='#6CC644'><Link href={'/dashboard?username='+username}>Zurück zur Ticketauswahl</Link></Button>
                                </Center>
                            </FormControl>
                        </Box>
                        <Box h="30%" w="40%" float="left" m={[10]}>
                            <Center>
                                <Heading>Prio</Heading>
                            </Center>
                            <FormControl fontFamily="mono">
                                <br></br>
                                <Center>
                                    <FormLabel>Auswirkung</FormLabel>
                                </Center>
                                <Center>
                                    <Box bgColor="#333" w="50%">
                                        <Center>
                                            {parseInt(ticket_obj.Auswirkung)+1} ({array_auswirkung[parseInt(ticket_obj.Auswirkung)]})
                                        </Center>
                                    </Box>
                                </Center>
                                <br></br>
                                <Center>
                                    <FormLabel>Dringlichkeit</FormLabel>
                                </Center>
                                <Center>
                                    <Box bgColor="#333" w="50%">
                                        <Center>
                                            {parseInt(ticket_obj.Dringlichkeit)+1} ({array_dringlichkeit[parseInt(ticket_obj.Dringlichkeit)]})
                                        </Center>
                                    </Box>
                                </Center>
                                <br></br>
                                <Center>
                                    <FormLabel>Priorität (Errechnet)</FormLabel>
                                </Center>
                                <Center>
                                    <Box bgColor="#333" w="50%">
                                        <Center>
                                            <Badge colorScheme={obj_label_color_prio[ticket_obj.Prio]}>{ticket_obj.Prio}</Badge>
                                        </Center>
                                    </Box>
                                </Center>
                            </FormControl>
                            <br></br>
                            <br></br>
                            <br></br>
                            <Center>
                                <Heading>Zuweisung</Heading>
                            </Center>
                            <FormControl fontFamily="mono">
                                <br></br>
                                <Center>
                                    <FormLabel>Zugewiesener Mitarbeiter</FormLabel>
                                </Center>
                                <Center>
                                    <Box bgColor="#333" w="50%">
                                        <Center>
                                            {ticket_obj.Mitarbeiter_Name}
                                        </Center>
                                    </Box>
                                </Center>
                                <br></br>
                                <Center>
                                    <FormLabel>Zugewiesene Abteilung</FormLabel>
                                </Center>
                                <Center>
                                    <Box bgColor="#333" w="50%">
                                        <Center>
                                            {ticket_obj.Abteilung_Name}
                                        </Center>
                                    </Box>
                                </Center>
                            </FormControl>
                        </Box>
                    </Box>
                </Center>
            </Box>
        </Box>
    )
}