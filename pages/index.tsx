import {Box, Center, css, ChakraProvider, Input, Heading} from '@chakra-ui/react'
import {Parallax, ParallaxLayer } from '@react-spring/parallax'
import { useState, useEffect } from 'react'
import {  FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Button
} from "@chakra-ui/react"
import { useRouter } from 'next/router'

export default function Handler(){
    const [username, setusername] = useState("")
    const [password, setpassword] = useState("")
    const router = useRouter()
    const login = async event => {
        event.preventDefault();
        console.log(username)
        console.log(password)
        router.push(`/dashboard?username=${username}`)
    }
    const updateUser = async event => {
        event.preventDefault();
        console.log(event.target.value)
        setusername(event.target.value)
    }
    const updatePass = async event => {
        event.preventDefault();
        console.log(event.target.value)
        setpassword(event.target.value)
    }
    return(
        <ChakraProvider>
            <Center h="100vh" w="100%" backgroundImage="https://v1.meyrin.dev/?type=img&path=celest2.png" backgroundSize="cover">
                <Center color="#f5f5f5" w="100%">
                    <Box borderWidth="1px" borderColor="#f5f5f5" backgroundColor="#454545" fontFamily="sans-serif" w="15%" h="40%" borderRadius="10px">
                        <Center m={[20]} h="3vh">
                            <Heading fontFamily="sans-serif" color="#f5f5f5">Login</Heading>
                        </Center>
                        <Center>
                            <Box h="45%">
                                <FormControl fontFamily="mono">
                                    <Center >
                                        <FormLabel htmlFor="username">Username</FormLabel>
                                    </Center>
                                        <Input id="username" type="text" onChange={(e)=> updateUser(e)} value={username}></Input>
                                    <Center h="10vh">
                                        <Button type="submit" backgroundColor="#6CC644" borderWidth="1px" borderColor="#f5f5f5" color="#f5f5f5" onClick={login}>Login</Button>
                                    </Center>
                                </FormControl>
                            </Box>
                        </Center>
                    </Box>
                </Center>
            </Center>
        </ChakraProvider>
    )
}