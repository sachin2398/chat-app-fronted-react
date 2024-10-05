import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, useToast, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Login = () => {
        const [show, setShow] = useState(false);
   
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const handleClick = () => setShow(!show);
    const toast = useToast();
     let history = useNavigate();

   const submitHandler=async() => {
        setLoading(true);
        if ( !email || !password ) {
             toast({
                title: "Please Fill all the feilds",
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
            setLoading(false);
            return;
        }
     

        try {
            const config = {
                headers: {
                    "content-type": "application/json",
                    
                },
            };
            const { data } = await axios.post("http://localhost:8080/api/user/login", { email, password }, config);
            toast({
                title: "Login Successful",
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            
            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
            history("/chats");

           
            
        } catch (error) {
            toast({
                title: "Error Occured!",
                description:error.response?.data?.message,
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
            setLoading(false);
           
        }
    };
    
  return (
    <VStack spacing="5x">
          
        
          
          <FormControl id='email' isRequired>
              <FormLabel>Email Address</FormLabel>
              <Input
                  placeholder='Enter Your Email Address'
                   value={email}
                  onChange={(e) => setEmail(e.target.value)}
                 type='email'
                  
              />
              
          </FormControl>
               <FormControl id='password' isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup size="md">
                   <Input
                  type={show?"text":"password"}
                      placeholder='Enter Your Password'
                       value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  />
                  <InputRightElement width="4.5rem">
                      <Button h="1.75rem" size="sm" onClick={handleClick}>
                          {show ?"Hide":"Show"}
                          
                      </Button>
                  
              </InputRightElement>
              </InputGroup>
              
             
              
          </FormControl>
        
          <Button colorScheme='purple'
              width="100%"
              style={{ marginTop: 15 }}
onClick={submitHandler}
              isLoading={loading}
          > 
              Login
          </Button>
          <Button
              varient="solid"
              colorScheme='red'
              width="100%"
              style={{ marginTop: 15 }}
              onClick={() => {
                  setEmail("guest@example.com");
                  setPassword("123456");
}}
              
          > 
             Get Guest User Credential
          </Button>
      </VStack>
  )
}

export default Login