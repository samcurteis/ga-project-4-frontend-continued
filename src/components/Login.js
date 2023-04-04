import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';
import { API } from '../lib/api';
import { NOTIFY } from '../lib/notifications';
import { useNavigate } from 'react-router-dom';
import { AUTH } from '../lib/auth';
import { useAuthenticated } from '../hooks/useAuthenticated';
import CommonTypography from './common/CommonTypography';

export default function Login({ theme }) {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const goToRegister = () => navigate('/register');
  const [formFields, setFormFields] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState({ email: false, password: false });
  const [isLoggedIn] = useAuthenticated();

  if (isLoggedIn) {
    navigate('/');
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    API.POST(API.ENDPOINTS.login, formFields)
      .then(({ data }) => {
        AUTH.setToken(data.token);
        NOTIFY.SUCCESS(data.message);
        navigate('/');
      })
      .catch((e) => {
        console.log(e);
        if (e.response.data.message === 'Unauthorized, invalid password') {
          setError({ ...error, password: true });
        } else {
          setError({ email: true, password: true });
        }
      });
  };

  const handleChange = (e) => {
    setFormFields({ ...formFields, [e.target.name]: e.target.value });
  };

  return (
    <ThemeProvider theme={theme}>
      <Button onClick={goBack}>GO BACK</Button>
      <Container
        component='main'
        maxWidth='xs'
        sx={{ marginBottom: '100px' }}
        className='sign-in'
      >
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: '#ef7b45' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component='h1' variant='h5'>
            Sign in
          </Typography>
          <Box
            component='form'
            onSubmit={handleSubmit}
            noValidate
            sx={{
              mt: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <TextField
              margin='normal'
              required
              fullWidth
              id='email'
              label='Email Address'
              name='email'
              autoComplete='email'
              onChange={handleChange}
              autoFocus
            />
            <TextField
              margin='normal'
              required
              fullWidth
              name='password'
              label='Password'
              type='password'
              id='password'
              autoComplete='current-password'
              onChange={handleChange}
            />
            <Button
              type='submit'
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2, backgroundColor: 'white', color: 'black' }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <CommonTypography
                  onClick={{ goToRegister }}
                  variant='body2'
                  sx={{ mt: '5px', display: 'flex' }}
                >
                  {"Don't have an account? Register here"}
                </CommonTypography>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
