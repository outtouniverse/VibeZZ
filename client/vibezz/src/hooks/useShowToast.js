import { useToast } from '@chakra-ui/react'


export const useShowToast = () => {
    const toast=useToast()
    const showtoast =(title,description,status)=>{
        toast({
            title,
            description,
            status,
            duration: 2000,
            isClosable: true,
        },[toast])

  }
  return showtoast
}
