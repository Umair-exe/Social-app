import Login from "./pages/Login";
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Register from "./pages/Register";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import { useSelector } from "react-redux";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import ProfileLayout from "./components/ProfileLayout";
import Followers from "./components/Followers";
import Following from "./components/Following";
import {Toaster} from 'react-hot-toast'


function App() {
  const { isUser } = useSelector(state => state.user);

  return (
    <>
      <Toaster />
      <Routes>
        {isUser ?
          <>
            <Route path="/" element={<Layout />} >
              <Route index element={<Home />} />
              <Route path="/search/:name" element={<Search />} />
              <Route path="/profile/:id" element={<ProfileLayout />} >
                <Route index element={<Profile />} />
                <Route path="/profile/:id/followers" element={<Followers />} />
                <Route path="/profile/:id/following" element={<Following />} />
              </Route>
            </Route>
          </> :
          <>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </>
        }
        <Route path="*" element={<Navigate to={'/'} replace />} />

      </Routes>
    </>
  );
}

export default App;
