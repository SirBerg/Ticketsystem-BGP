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

const ChakraSelect = chakra_sel.Select
export async function getServerSideProps(context) {
    async function fetch_Mitarbeiter(abteilung_id:string){
        var requestOptions:any = {
            method: 'GET',
            redirect: 'follow'
          };
          let return_var:any
          await fetch(`https://ticketsystem.izanami.dev/api/mitarbeiter${abteilung_id}`, requestOptions)
            .then(response => response.text())
            .then(result =>return_var = result )
            .catch(error => console.log('error', error));
          return return_var
    }
    async function fetch_Abteilung(){
        var requestOptions:any = {
            method: 'GET',
            redirect: 'follow'
          };
        let return_var:any
        await fetch("https://ticketsystem.izanami.dev/api/abteilung", requestOptions)
            .then(response => response.text())
            .then(result => return_var = JSON.parse(result) )
            .catch(error => console.log('error', error));
        return return_var
    }
    let abteilungen = await fetch_Abteilung()
    let mitarbeiter = await fetch_Mitarbeiter("").then(result=>JSON.parse(result))
    let arr = [["Prio 1", "Prio 2", "Prio 3", "Prio 4","Prio 5"], ["Prio 2", "Prio 3", "Prio 4", "Prio 5", "Prio 6"],["Prio 3", "Prio 4", "Prio 5", "Prio 6", "Prio 7"]]
    console.log(arr)
    return {props: {
        "username": context.query.username,
        "abteilungen": abteilungen,
        "mitarbeiter": mitarbeiter,
        "prioritäten": arr
    }}
}

export default function Handler({username, abteilungen, mitarbeiter, prioritäten}){
    const [email, setEmail] = useState("")
    const [tel, setTel] = useState("")
    const [abteilung, setAbteilung] = useState("")
    const [usrNameForm, setusrNameForm] = useState("")
    const [kurzbeschreibung, setKurzbeschreibung] = useState("")
    const [beschreibung, setBeschreibung] = useState("")
    const [kategorie, setKategorie] = useState("")
    const [mitarbeiter_state, setMitarbeiter_State]:any = useState("")
    const [cache_mitarbeiter, setCachemitarbeiter]:any = useState("")
    const [cache_abteilungen, setCacheabteilungen]:any = useState("")
    const [cache_mitarbeiter_after_change, setCacheMitarbeiterAfterChange]:any = useState("")
    const [abteilung_assigned, setAbteilungAssigned] = useState("")
    const [mitarbeiter_assigned, setMitarbeiter_assigned] = useState("")
    const [initial_value, setInitialValue] = useState("")
    const [tickettyp, setTickettyp] = useState("")
    const [labelstate_auswirkung, setLabelStateAuswirkung] = useState("")
    const [prioState, setPrioState] = useState("")
    const [prioStateLabel, setPrioStateLabel] = useState("")
    const [auswirkung, setAuswirkung] = useState("")
    const [dringlichkeit, setDringlichkeit] = useState("")
    const router = useRouter()
    const isEmailError = !email.includes("@") && email.length != 0|| !email.includes(".") && email.length != 0

    let i = 0
    useEffect(()=>{
        async function wrapper(){
            //fetcht die abteilungen für
            console.log(abteilungen)
            let abteilung = abteilungen
            let components = abteilung.map((abteilung_obj) => {
                return (
                    <option key={abteilung_obj.Abteilung_ID} color="#333">{abteilung_obj.Abteilung_Name}</option>
                )
            })
            setAbteilung(components)
            setCacheabteilungen(abteilung)

            //fetcht die mitarbeiter
            let mitarbeiter_var = mitarbeiter
            let components_mitarbeiter = mitarbeiter_var.map((mitarbeiter_obj) => {
                return (
                    <option key={mitarbeiter_obj.Mitarbeiter_ID} color="#333">{mitarbeiter_obj.Mitarbeiter_Name}</option>
                )
            })
            setInitialValue(mitarbeiter[0].Mitarbeiter_Name)
            setMitarbeiter_State(components_mitarbeiter)
            setCachemitarbeiter(mitarbeiter)
            setCacheMitarbeiterAfterChange(mitarbeiter)

            //standard states
            setAbteilungAssigned("Nicht zugewiesen")
            setMitarbeiter_assigned("Nicht zugewiesen")
            setKategorie("Sonstiges")
            setTickettyp("Incident")

            //@ts-ignore
            setAuswirkung(0)
            //@ts-ignore
            setDringlichkeit(0)
            setBeschreibung("Nicht angegeben")
            setKurzbeschreibung("Nicht angegeben")
            setEmail("Nicht Angegeben")
            setTel("Nicht Angegeben")
            setusrNameForm("Nicht Angegeben")

        }
        wrapper()
        //@ts-ignore
    },[])
    function log_values(){
        console.log(email)
        console.log(tel)
        console.log(usrNameForm)
        console.log(kurzbeschreibung)
        console.log(beschreibung)
        console.log(kategorie)
        console.log(tickettyp)
        console.log(abteilung_assigned)
        console.log(mitarbeiter_assigned)
    }
    function check_event(e){
        setKategorie(e.target.value)
    }
    function set_typ(e){
        setTickettyp(e.target.value)
    }
    function setMitarbeiter(e){
        if(!e.target.value || e.target.value == ""){
            setMitarbeiter_assigned("Nicht zugewiesen")
        }
        else{
            setMitarbeiter_assigned(e.target.value)
        }
        setInitialValue(e.target.value)
    }
    function changeMitarbeiterOnAbteilungChange(e){
        let abteilung_id = e.target.value
        setAbteilungAssigned(abteilung_id)
        let return_arr = []
        let i = 0
        let arr_cache = []
        if(abteilung_id != "Nicht zugewiesen"){
            return_arr.push(<option key="0000">Nicht zugewiesen</option>)
            do{
                if(cache_mitarbeiter[i].Abteilung_Name == abteilung_id){
                    arr_cache.push(cache_mitarbeiter[i])
                    return_arr.push(<option key = {cache_mitarbeiter[i].Mitarbeiter_ID} >{cache_mitarbeiter[i].Mitarbeiter_Name}</option>) 
                }
                i++
            }
            while(i<cache_mitarbeiter.length)
        }
        else if(abteilung_id == "Nicht zugewiesen"){
            console.log(cache_mitarbeiter)
            do{
                return_arr.push(<option key = {cache_mitarbeiter[i].Mitarbeiter_ID} >{cache_mitarbeiter[i].Mitarbeiter_Name}</option>) 
                i++
            }
            while(i<cache_mitarbeiter.length)
            arr_cache = cache_mitarbeiter
        }
        setMitarbeiter_State(return_arr)
        setCacheMitarbeiterAfterChange(arr_cache)
        setInitialValue(arr_cache[0].Mitarbeiter_Name)
        setMitarbeiter_assigned(arr_cache[0].Mitarbeiter_Name)

    }

    function changeMitarbeiterOnInputChange(e){
        let return_arr = []
        let i = 0
        do{
            if(cache_mitarbeiter_after_change[i].Mitarbeiter_Name.toLowerCase().includes(e.target.value) || cache_mitarbeiter_after_change[i].Mitarbeiter_Name.includes(e.target.value) ){
                return_arr.push(<option key = {cache_mitarbeiter_after_change[i].Mitarbeiter_ID}>{cache_mitarbeiter_after_change[i].Mitarbeiter_Name}</option>)
            }
            i++
        }
        while(i<cache_mitarbeiter_after_change.length)
        setMitarbeiter_State(return_arr)
        setMitarbeiter_assigned(cache_mitarbeiter_after_change[0].Mitarbeiter_Name)
        setInitialValue(cache_mitarbeiter_after_change[0].Mitarbeiter_Name)
    }
    function changeAuswirkungOnChange(e){
        const selected_index = e.target.options.selectedIndex
        setAuswirkung(selected_index)
        console.log(selected_index)
        console.log(prioritäten[0][selected_index])
        setPrioStateLabel("Errechnete Prio: "+prioritäten[dringlichkeit][selected_index])
    }
    function changeDringlichkeitOnChange(e){
        const selected_index = e.target.options.selectedIndex
        setDringlichkeit(selected_index)
        console.log(prioritäten[selected_index])
        console.log(selected_index)
        setPrioStateLabel("Errechnete Prio: "+prioritäten[selected_index][auswirkung])
    }
    async function sendNewTicket(e){
        e.preventDefault()

        let data:requestObject = {
            "Abteilung": abteilung_assigned,
            "Mitarbeiter": mitarbeiter_assigned,
            "Kurzbeschreibung": kurzbeschreibung,
            "Beschreibung": beschreibung,
            "Kategorie": kategorie,
            "Prio": prioritäten[dringlichkeit][auswirkung],
            "Dringlichkeit": dringlichkeit,
            "Auswirkung": auswirkung,
            "Status":"Offen",
            "Meldende_Person": usrNameForm,
            "SD_Mitarbeiter": username,
            "Tel": tel,
            "Email": email,
            "Typ": tickettyp
        }

        var requestOptions:any = {
            method: 'POST',
            body: JSON.stringify(data),
            redirect: 'follow'
          };
          
        await fetch("https://ticketsystem.izanami.dev/api/new_incident", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
    }
    return(
        <Box backgroundColor="#333">
            <Center h="10vh" backgroundColor="#333" color="white" fontFamily="sans-serif">
                <Heading size="2xl">Neues Ticket</Heading>
            </Center>
            <Center h="130vh" backgroundColor='#333'>
                <Box backgroundColor="#454545" h="90%" w="80%" color="#f5f5f5" borderRadius="10px" minW="120vh">
                        <Box h="30%" w="40%" float="left" m={[10]}>
                            <Center h="10%">
                                <Heading>Kontaktinformationen</Heading>
                            </Center>
                            <FormControl fontFamily="mono">
                                <Center>
                                    <FormLabel htmlFor="name">Name</FormLabel>
                                </Center>
                                <Input id="name" value={usrNameForm} onChange={(e)=>setusrNameForm(e.target.value)}/>
                                <Center>
                                    <FormHelperText>(erforderlich)</FormHelperText>
                                </Center>

                                <Center>
                                    <FormLabel htmlFor="email">Email</FormLabel>
                                </Center>
                                <Input id="email" value={email} onChange={(e)=>{setEmail(e.target.value)}} />
                                <Center>
                                    <FormHelperText>
                                        (optional)
                                    </FormHelperText>
                                </Center>

                                <Center>
                                    <FormLabel htmlFor="tel">Telefonnummer</FormLabel>
                                </Center>
                                <InputGroup>
                                    {/* eslint-disable-next-line react/no-children-prop*/}
                                    <InputLeftAddon children='+49' bgColor="#333"/>
                                    <Input type='number'value={tel} onChange={(e)=>setTel(e.target.value)}/>
                                </InputGroup>
                                <Center>
                                    <FormHelperText>
                                        (optional)
                                    </FormHelperText>
                                </Center>
                            </FormControl>
                        </Box>
                        <Box h="30%" w="40%" float="right" m={[10]} position="relative">
                            <Center h="10%">
                                <Heading>Ticket Informationen</Heading>
                            </Center>
                            <FormControl fontFamily="mono">
                                <Center>
                                    <FormLabel htmlFor="kurzbeschreibung">Kurzbeschreibung</FormLabel>
                                </Center>
                                <Input id="kurzbeschreibung" type="text" onChange={(e)=> (setKurzbeschreibung(e.target.value))} value={kurzbeschreibung}></Input>
                                <Center>
                                    <FormHelperText>(erforderlich)</FormHelperText>
                                </Center>
                                <Center>
                                    <FormLabel htmlFor="längerebeschreibung">Ausführliche Beschreibung</FormLabel>
                                </Center>
                                <Textarea id="längerebeschreibung" h="30vh" maxH="30vh" minH="30vh" whiteSpace="pre-line" value={beschreibung} onChange={(e)=>setBeschreibung(e.target.value)}></Textarea >
                                <Center>
                                    <FormHelperText>(erforderlich)</FormHelperText>
                                </Center>
                                <Center>
                                    <FormLabel htmlFor="kategorie">Kategorie</FormLabel>
                                </Center>
                                <Select id="kategorie" bg="white" color='#333' onChange={(e)=>check_event(e)}>
                                    <option>Hardware</option>
                                    <option>Software</option>
                                    <option>Netzwerk</option>
                                    <option>Service</option>
                                    <option>Sonstiges</option>
                                </Select>
                                <Center>
                                    <FormHelperText>(erforderlich)</FormHelperText>
                                </Center>
                                <Center>
                                    <FormLabel htmlFor="incident_type">Ticket Typ</FormLabel>
                                </Center>
                                <Select id="incident_type" bg="white" color='#333' onChange={(e)=>set_typ(e)}>
                                    <option>Incident</option>
                                    <option>Problem</option>
                                    <option>Service Request</option>
                                    <option>Sonstiges</option>
                                </Select>
                                <Center>
                                    <FormHelperText>
                                        (optional)
                                    </FormHelperText>
                                </Center>
                            </FormControl>
                            <Center h="34vh">
                                <Button backgroundColor="#6CC644" onClick={(e)=>sendNewTicket(e)}><Link href={"/dashboard?username="+username}>Neues Ticket erstellen</Link></Button>
                            </Center>                             
                        </Box>
                        <Box h="30%" w="40%" float="left" position="relative" m={[10]}>
                            <Center>
                                <Heading>Prio</Heading>
                            </Center>
                            <FormControl fontFamily="mono">
                                <Center>
                                    <FormLabel htmlFor="auswirkung">Auswirkung </FormLabel>
                                </Center>
                                    <Select id="auswirkung" bg="white" color="#333" onChange={(e)=>changeAuswirkungOnChange(e)}>
                                        <option key ="0">Ganzes Unternehmen</option>
                                        <option key="1">Mehrere Abteilung</option>
                                        <option key="2">Ganze Abteilung</option>
                                        <option key="3">Mehrere Mitarbeiter</option>
                                        <option key="4">Einzelner Mitarbeiter</option>
                                    </Select>
                                    {labelstate_auswirkung}
                                <Center>
                                    <FormHelperText>(erforderlich)</FormHelperText>
                                </Center>
                                <Center>
                                    <FormLabel htmlFor="dringlichkeit">Dringlichkeit</FormLabel>
                                </Center>
                                <Select id="dringlichkeit" bg="white" color="#333" onChange={(e)=>changeDringlichkeitOnChange(e)} >
                                    <option key="0">Sofort</option>
                                    <option key="1">Ein Tag</option>
                                    <option key="2">Mehrere Tage</option>
                                </Select>
                                <Center h="4vh">
                                    <FormLabel color="red">{prioStateLabel}</FormLabel>
                                </Center>
                            </FormControl>
                            <Center>
                                <Heading>Zuweisungen</Heading>
                            </Center>
                            <Center>
                                <FormControl fontFamily="mono" color="white">
                                    <Center>
                                        <FormLabel htmlFor="abteilung">Zugewiesene Abteilung</FormLabel>
                                    </Center>
                                    <Select fontFamily="mono" color="#333" bgColor="white" onChange={(e)=>changeMitarbeiterOnAbteilungChange(e)} >
                                        {abteilung}
                                    </Select>
                                    <Center>
                                        <FormHelperText>(erforderlich)</FormHelperText>
                                    </Center>
                                    <Center>
                                        <FormLabel htmlFor="mitarbeiter">Mitarbeiter</FormLabel>
                                    </Center>
                                    <Center>
                                        <InputGroup w="50vh" bgColor="#454545" >
                                            <Box w="50%" float="left">
                                                <Select fontFamily="mono" color="#333" bgColor="white" value={initial_value} onChange={(e)=> setMitarbeiter(e)}>
                                                    {mitarbeiter_state}
                                                </Select>
                                            </Box>
                                            <Box w="50%" float="right">
                                                <Input type="search" id="mitarbeiter" placeholder="Suchen" onChange={(e)=>changeMitarbeiterOnInputChange(e)}></Input>
                                            </Box>
                                        </InputGroup>
                                    </Center>
                                </FormControl>
                            </Center>
                        </Box>
                </Box>
            </Center>
        </Box>
    )
}