import { ViewIcon } from '@chakra-ui/icons';
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react';
import React from 'react'
import { ChatState } from '../../Context/ChatProvider';
import { useState } from 'react';
import UserBadgeItem from '../UserAvtar/UserBadgeItem';
import axios from 'axios';
import UserListItems from '../UserAvtar/UserListItems';

const UpdateGroupChatModel = ({fetchMessages, fetchAgain, setFetchAgain }) => {
   const { isOpen, onOpen, onClose } = useDisclosure();
     const [groupChatName, setGroupChatName] = useState("");
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
 const [renameLoading, setRenameLoading] = useState(false);
    const toast = useToast();



   
    const { selectedChat, setSelectedChat, user } = ChatState();
    

    const handleAddUser = async (user1) => {
      if (selectedChat.users.find((u) => u._id === user1._id)) {
          toast({
        title: "User Already in Group !",
        description: "Failed to load the Search Results",
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: "bottom",
          });
        return;
      }
      
      if (selectedChat.groupAdmin._id !== user._id) {
        toast({
          title: "Only admins can add someone!",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        return;
     }

      try {
        setLoading(true);
          const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    
                },
        };

        const { data } = await axios.put(`http://localhost:8080/api/chat/groupadd`, {
          chatId: selectedChat._id,
          userId:user1._id,
        },
          config);
        
        setSelectedChat(data);
        setFetchAgain(!fetchAgain);
        setLoading(false);
        

     } catch (error) {
      toast({
        title: "Error Occured",
        description: error.response.data.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
        setLoading(false);
     }


    }
  const handleRemove = async (user1) => {
    //  console.log("user 1 adta chek", user1);
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast({
        title: "Only admins can remove someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `http://localhost:8080/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
    setGroupChatName("");
  };
    const handleRename = async() => {
      if (!groupChatName) return;
      try {
        
        setRenameLoading(true);

           const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    
                }
        };
        
        const { data } = await axios.put("http://localhost:8080/api/chat/rename", {
          chatId: selectedChat._id,
          chatName: groupChatName,

        },
          config);
        
        setSelectedChat(data);
        setFetchAgain(!fetchAgain);
        setRenameLoading(false);



      } catch (error) {
         toast({
        title: "Error Occured",
        description: error.response.data.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: "bottom",
         });
        setRenameLoading(false);
        
      }
      setGroupChatName("");
    }
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`http://localhost:8080/api/user?search=${search}`, config);
      // console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };
  return (
    <>
          <IconButton
              display={{ base: "flex" }} 
              icon={<ViewIcon />}
              
              
              onClick={onOpen} />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
                  <ModalHeader
                  
                      fontSize="35px"
                      fontFamily="work sans"
                      display="flex"
                      justifyContent="center"
                  
                  >{selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody  display="flex" flexDirection="column" alignItems="center">
                      <Box  w="100%" display="flex" textwrap="wrap" pb={3}>
                          
                                {
                          selectedChat.users.map((u) => (
                              <UserBadgeItem
                                  key={u._id}
                              user={u}
                              admin={selectedChat.groupAdmin}
                                  handleFunction={()=>handleRemove(u)}
                              
                              />
                          ))
                          }
                          
                          
                      </Box>
                      
                         <FormControl display="flex">
                          <Input placeholder='Chat Name'
                              mb={3}
                              value={groupChatName}
                              onChange={(e)=> setGroupChatName(e.target.value)}
                          
                          />
                          <Button
                              variant="solid"
                              colorScheme='teal'
                              ml={1}
                              isLoading={renameLoading}
                              onClick={handleRename}
                          
                          >
                              Update
                          </Button>
            </FormControl>
            
              <FormControl>
                          <Input placeholder='Add Users to group'
                              mb={1}
                              onChange={(e)=> handleSearch(e.target.value)}
                          
                          />

            </FormControl> 
            
             {loading ? 
                           <Spinner size="lg" />
                       : (
                              searchResult?.map((user) => (
                                <UserListItems
                                  key={user._id} user={user} handleFunction={() => handleAddUser(user)} />
                              ))
                              
                         )}
          </ModalBody>

          <ModalFooter>
            <Button onClick={() => handleRemove(user)}
            colorScheme='red'
            >
              Leave Group
            </Button>
            
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UpdateGroupChatModel