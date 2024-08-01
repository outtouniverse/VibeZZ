import { Button, ChakraProvider, Container } from '@chakra-ui/react';
import UserPage from './Pages/UserPage';
import PostPage from './Pages/PostPage';
import { AuthPage } from './Pages/AuthPage';
import Homepage from './Pages/Homepage'
import { Logout } from './Components/Logout';
import UpdateProfile from './Pages/UpdateProfile';
import Header from './Components/Header';
import { Navigate, Routes, Route } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { CreatePost } from './Components/CreatePost';
import userAtom from './atoms/userAtom';

function App() {
  const user = useRecoilValue(userAtom);

  return (
  
      <Container maxw="620px">
        <Header />
        <Routes>
          <Route path="/" element={user ? <Homepage /> : <Navigate to="/auth" />} />
          <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to="/" />} />
          <Route path="/update" element={user ? <UpdateProfile /> : <Navigate to='/auth' />} />
          <Route path="/:username" element={user ? (
            <>
            <UserPage />
            <CreatePost/>
            </>
          ):(
            <UserPage/>
          ) } />
          <Route path='/:username/post/:pid' element={<PostPage />} />
        </Routes>
        {user && <Logout />}
       
      </Container>
    
  );
}

export default App;
