import './App.css';
import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import Home from './pages/Home';
// import Profile from './pages/Profile';
import Profile from './pages/ProfileCopy';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './util/PrivateRoute';
import Loading from './components/Loading';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { SocketContext } from './context/SocketContext'
import { GetOwnUser } from './context/AuthActions';
import { io } from "socket.io-client";
import PostPage2 from './pages/PostPage2';
import Chat from './pages/Chat';
import Video from './pages/Video';
import Bookmark from './pages/BookMark';
import VideoNotifications from './components/Chat/VideoNotifications';
import Covid from './pages/Covid';
import Setting from './pages/Setting';
import VideoPlayer from './components/Chat/VideoPlayer';
import NotFound from './pages/NotFound';
import ForgetPassword from './pages/ForgetPassword';
import { ThemeProvider } from 'styled-components';
import { themes } from './util/themes'
import ResetPassword from './pages/ResetPassword';

const socket = io("https://82.165.111.158")



const App = () => {
  const { user, dispatch, isFetching, } = useContext(AuthContext)
  const { me, setVideoUsersId, setOnlineUsers, theme, setTheme } = useContext(SocketContext)
  const [token, setToken] = useState(null);

  const getTheme = async () => {
    const myTheme = await localStorage.getItem('theme')
    if (!myTheme) {
      await localStorage.setItem('theme', 'light')
      setTheme('light')
    } else {
      setTheme(myTheme)
    }
    return myTheme
  }


  useEffect(() => {
    let mounted = true;
    if (mounted) {
      const getToken = localStorage.getItem('token');
      getTheme()
      setToken(getToken)
    }

    return () => mounted = false;
  }, [])


  useEffect(() => {
    const getUser = async () => {
      if (!isFetching && token) {
        await GetOwnUser(dispatch)
      } else {
        console.log(token)

      }

    }
    getUser()
  }, [token])


  useEffect(() => {

    socket.emit("addUser", user?._id);
    socket.emit("getUsersSocket", { userId: user?._id, socketId: me })
    socket.on('onlineUsers', (data) => {
      setVideoUsersId(data)
    })
    socket.on("getUsers", (users) => {
      setOnlineUsers(
        user &&
        user?.followings?.filter((follow) =>
          users.some((user) => user.userId === follow)
        )
      );
    });
  }, [user, me]);


  return (
    <Container className="App">
      <ThemeProvider theme={themes[theme]}>
        <Router>
          <VideoNotifications />
          <VideoPlayer />
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/forgetPassword" component={ForgetPassword} />
            <Route exact path="/resetpassword/:resetToken" component={ResetPassword} />
            <Route exact path="/" render={() => {
              return (
                token ?
                  <Redirect to="/home" /> :
                  <Redirect to="/login" />
              )
            }}
            />
            {user && !isFetching && (<>
              <PrivateRoute exact path="/home" component={Home} />
              <Route exact path="/profile/:username" component={Profile} />
              {/* <PrivateRoute exact path="/post/:id" component={PostPage} /> */}
              <PrivateRoute exact path="/post/:id" component={PostPage2} />
              <PrivateRoute exact path="/chat" component={Chat} />
              <PrivateRoute exact path="/video" component={Video} />
              <PrivateRoute exact path="/bookmark" component={Bookmark} />
              <PrivateRoute exact path="/covid" component={Covid} />
              <PrivateRoute exact path="/setting" component={Setting} />
              <Route exact path="/notfound" component={NotFound} />
            </>)


            }


          </Switch>
        </Router>
      </ThemeProvider>
    </Container>
  );
}

export default App;


const Container = styled.div``



