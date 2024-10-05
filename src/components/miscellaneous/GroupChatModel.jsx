import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';
import axios from 'axios';
import UserListItems from '../UserAvtar/UserListItems';
import UserBadgeItem from '../UserAvtar/UserBadgeItem';

const GroupChatModel = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUser, setSelectedUser] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const { user, chats, setChats } = ChatState();
    const handleSearch = async(query) => {
        setSearch(query);
        if (!query) {
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    
                }
            };

            const { data } = await axios.get(`http://localhost:8080/api/user?search=${search}`, config);
            // console.log("check", data);
            setLoading(false);
            setSearchResult(data);

        } catch (error) {
            toast({
        title: "Error Occured",
        description: "Failed to load the Search Results",
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
        }
    
    };
    const handlesubmit = async () => {
        if (!groupChatName || !selectedUser) {
            toast({
                title: "Please fill all the feilds",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top"
            });

            return;
        }

        try {
            const config = { 
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    
                },

            };


            const { data } = await axios.post("http://localhost:8080/api/chat/group", {
                name: groupChatName,
                users: JSON.stringify(selectedUser.map((u) => u._id)),
                
            }, config);
            setChats([data, ...chats]);
            onClose();
            toast({
                title: "New Group chat created!",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
        } catch (error) {
            toast({
        title: "Failed to Create the Chat!",
        description: error.response.data,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
        }
    
    };
    const handleDelete = (delUser) => {
        setSelectedUser(
        selectedUser.filter((sel)=> sel._id !== delUser._id)
    )
    };


    const handleGroup = (userToAdd) => {
        if (selectedUser.includes(userToAdd)) {
            toast({
                title: "User Already Added",
       
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            return;
        }
        
        setSelectedUser([...selectedUser, userToAdd]);
    };
  return (
      <>
          <span  onClick={onOpen}>
        {children}
      </span>
        <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
                  <ModalHeader
                      fontSize="35px"
                      fontFamily="Work sans"
                      d="flex"
                      justifyContent="center">
                      Create Group Chat</ModalHeader>
          <ModalCloseButton />
                  <ModalBody
                      display="flex"
                      flexDirection="column"
                      alignItems="center" >
                      
                      <FormControl>
                          <Input placeholder='Chat Name'
                              mb={3}
                              onChange={(e)=> setGroupChatName(e.target.value)}
                          
                          />
                        

                      </FormControl>     
                       <FormControl>
                          <Input placeholder='Add Users eg: john, piyush, jane'
                              mb={1}
                              onChange={(e)=> handleSearch(e.target.value)}
                          
                          />

                      </FormControl>   
                      <Box w="100%" display="flex" textwrap="wrap">
                          

                      {
                          selectedUser?.map(u => (
                              <UserBadgeItem
                                  key={u._id}
                                  user={u}
                                  handleFunction={()=>handleDelete(u)}
                              
                              />
                          ))
                          }
                          
                          </Box>
                         {loading ? <div>
                            <Spinner size="sm" color=''/>
                      </div> : (
                              searchResult?.slice(0, 4).map(user => (
                                  <UserListItems key={user._id} user={ user} handleFunction={()=> handleGroup(user)}/>
                              ))
                              
                         )}
          
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue'  onClick={handlesubmit}>
              Create Chat
            </Button>
           
          </ModalFooter>
        </ModalContent>
      </Modal>
      </>
  )
}

export default GroupChatModel