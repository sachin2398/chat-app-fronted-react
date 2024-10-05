import { CloseIcon } from '@chakra-ui/icons'
import { Box } from '@chakra-ui/react'
import React from 'react'

const UserBadgeItem = ({user, handleFunction}) => {
  return (
      <Box
          px={2}
          py={1}
          borderradious="lg"
          m={1}
          mb={2}
          variant="solid"
          fontSize={12}
          backgroundColor="rgb(155, 101, 242)"
          color="white"
          cursor="pointer"
          onClick={handleFunction}
      >
          {user.name}
          <CloseIcon pl={1} />
   </Box>
  )
}

export default UserBadgeItem