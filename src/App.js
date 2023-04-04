import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Home from './components/Home';
import Navbar from './components/NavBar';
import Login from './components/Login';
import Register from './components/Register';
import SearchPage from './components/SearchPage';
import AuthorPage from './components/AuthorPage';
import PoemPage from './components/PoemPage';
import UserPage from './components/UserPage';
import PostPage from './components/PostPage';
import NewPost from './components/NewPost';
import NewPoem from './components/NewPoem';
import Browse from './components/Browse';

import './App.css';
import './styles/pages.scss';
import 'react-toastify/dist/ReactToastify.css';

import { ThemeProvider, createTheme } from '@mui/material/styles';

import Montserrat from './assets/fonts/Montserrat-VariableFont_wght.ttf';

import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';

window.Buffer = window.Buffer || require('buffer').Buffer;

let theme = createTheme({
  palette: {
    primary: {
      main: '#fafafa',
      dark: '',
      contrastText: '#fff'
    },
    secondary: {
      main: '#0c090d'
    },
    link: {
      main: '#ffa500'
    }
  },
  typography: {
    fontFamily: 'Montserrat, serif'
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'Montserrat', serif;
          font-style: normal;
          font-display: swap;
          font-weight: 400;
          src: local('Montserrat'), local('Montserrat-Regular'), url(${Montserrat}) format('ttf');
          unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
        }
      `
    }
  }
});

window.Buffer = window.Buffer || require('buffer').Buffer;

function App() {
  const [searchedData, setSearchedData] = useState([]);
  const [isUpdated, setIsUpdated] = useState(false);
  const [singlePost, setSinglePost] = useState(null);
  const [singlePoem, setSinglePoem] = useState(null);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className='App'>
        <Router>
          <Navbar
            setSearchedData={setSearchedData}
            searchedData={searchedData}
            setIsUpdated={setIsUpdated}
          />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login theme={theme} />} />
            <Route path='/register' element={<Register theme={theme} />} />
            <Route
              path='/search'
              element={
                <SearchPage
                  searchedData={searchedData}
                  setIsUpdated={setIsUpdated}
                  isUpdated={isUpdated}
                />
              }
            />
            <Route path='/browse' element={<Browse />} />
            <Route
              path='/new-post'
              element={<NewPost singlePost={singlePost} />}
            />
            <Route
              path='/new-poem'
              element={<NewPoem singlePoem={singlePoem} />}
            />
            <Route path='/authors/:id' element={<AuthorPage />} />
            <Route
              path='/poems/:id'
              element={
                <PoemPage
                  singlePoem={singlePoem}
                  setSinglePoem={setSinglePoem}
                />
              }
            />
            <Route
              path='/users/:id'
              element={
                <UserPage
                  setSinglePost={setSinglePost}
                  setSinglePoem={setSinglePoem}
                />
              }
            />
            <Route
              path='/posts/:id'
              element={
                <PostPage
                  singlePost={singlePost}
                  setSinglePost={setSinglePost}
                />
              }
            />
          </Routes>
        </Router>
        <ToastContainer />
      </div>
    </ThemeProvider>
  );
}

export default App;
