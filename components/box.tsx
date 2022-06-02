import {Box, Center, Button} from '@chakra-ui/react'
import { FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText, } from '@chakra-ui/react'

import {useEffect, useState} from 'react'
import { Spinner } from '@chakra-ui/react'
import {useRouter} from 'next/router'
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
} from '@chakra-ui/react'
import { css } from '@emotion/react'
import Link from 'next/link'

export function BoxComponentCreateNew(usr){
    const router = useRouter()
    const onSubmit_Event = (event:any)=>{
        event.preventDefault()
        router.push('/new_incident?username='+usr.usr)
    }
    return(
        <Box backgroundColor="#454545" borderWidth="1px" borderColor="#f5f5f5" w="100%" h="100%">
            <Center h="100%" fontFamily="mono">
                <Button as={Button} bgColor="#6CC644" onClick={(e)=>onSubmit_Event(e)}>Neuer Incident</Button>
            </Center>
        </Box>
    )
}

export function BoxComponentIncidents(){
    const router = useRouter()
    async function fetchIncidents(){
        var requestOptions:any = {
            method: 'GET',
            redirect: 'follow'
          };
        let response:any
        await fetch("/api/incidents", requestOptions)
        .then(response => response.text())
        .then(result => response = result)
        .catch(error => console.log('error', error));

        return(response)
    }
    const [incidents, setIncidents] = useState("")
    const [start, setStart] = useState(<Spinner />)
    useEffect(()=>{
        console.log('USERNAME',router.query.username)
        let username = router.query.username
        if(!username){
            username = "anonym"
        }
        async function wrapper(){
            let incidents_array = await fetchIncidents()
            console.log(incidents_array)
            let incidents_json = JSON.parse(incidents_array)
            console.log(incidents_json[0]["Prioritaet"])
            let incidents_objects = incidents_json.map((incident:any)=>{
                return(
                    <Link key={incident.Incident_ID} href={`/ticket?id=${incident.Incident_ID}&username=${username}`}>
                        <Tr>
                            <Td>{incident.Incident_ID}</Td>
                            <Td>{incident.Kurzbeschreibung}</Td>
                            <Td>{incident.Mitarbeiter_Name}</Td>
                            <Td>{incident.Meldende_Person}</Td>
                            <Td>{incident.Prio}</Td>
                            <Td>{incident.Kategorie}</Td>
                        </Tr>
                    </Link>
                )
            })
            setIncidents(incidents_objects)
            setStart(<></>)
        }
        wrapper()
    }, [])
    
    return(
        <Box overflowY="scroll" backgroundColor="#4078c0" borderWidth="1px" borderColor="#f5f5f5" w="100%" h="100%" maxH="100vh">
            <Center h="100%" fontFamily="mono">
                <TableContainer color="#f5f5f5">
                    <Table variant="simple">
                        <Thead>
                            <Tr>
                                <Th>ID</Th>
                                <Th>Beschreibung</Th>
                                <Th>Bearbeiter</Th>
                                <Th>Gemeldet von</Th>
                                <Th>Prio</Th>
                                <Th>Art</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {incidents}
                        </Tbody>

                    </Table>
                    <Center>
                            <FormControl>
                                <Center>
                                    <FormHelperText color="white">(Klicke auf ein Ticket um Details zu sehen oder das Ticket zu bearbeiten)</FormHelperText>
                                </Center>
                            </FormControl>
                        </Center>
                    <Center>
                        {start}
                    </Center>
                </TableContainer>
            </Center>
        </Box>
    )
}