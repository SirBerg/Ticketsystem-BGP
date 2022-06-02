import {Box, Center, Button, Input, Badge, Heading, FormControl, FormLabel, useToast, useDisclosure} from '@chakra-ui/react'
import {useRouter} from 'next/router'
import {useState, useEffect} from 'react'
import {Grid, GridItem} from '@chakra-ui/react'

import { BoxComponentCreateNew, BoxComponentIncidents } from '../components/box'

export default function Handler(){
    const router = useRouter()
    const [usrName, setusrName]:any = useState("")

    useEffect(()=>{
        if(router.query.username && router.query.username.length == 0){
            setusrName("Anonymous")
        }
        else{
            setusrName(router.query.username)
        }
    })

    return(
        <div>
            <Center h="10vh" backgroundColor="#333" color="white" fontFamily="sans-serif">
                <Heading size="2xl">Willkommen {usrName}</Heading>
            </Center>
            <Center backgroundColor="#333" h="90vh">
                <Grid templateColumns='repeat(5, 1fr)' gap={2} w="90%" h="50vh" color="#f5f5f5">
                    <GridItem rowSpan={2} colSpan={1} bg='grey' ><BoxComponentCreateNew usr={usrName}/></GridItem>
                    <GridItem colSpan={4} rowSpan={2} bg='tomato' ><BoxComponentIncidents /></GridItem>
                </Grid>
            </Center>
        </div>
    )
}