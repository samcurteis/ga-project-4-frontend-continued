import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Container, Button } from '@mui/material';
import { API } from '../lib/api';
import { AUTH } from '../lib/auth';
import { NOTIFY } from '../lib/notifications';

export default function Register({ theme }) {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const [formFields, setFormFields] = useState({
    email: '',
    first_name: '',
    last_name: '',
    username: '',
    password: '',
    password_confirmation: '',
    poem_favorites: [],
    poem_likes: [],
    post_favorites: [],
    post_likes: [],
    comments: [],
    posts: [],
    favorite_authors: []
  });
  const [error, setError] = useState(false);
  const [file, setFile] = useState(null);

  const handleChange = (e) =>
    setFormFields({ ...formFields, [e.target.name]: e.target.value });

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    const imageData = new FormData();
    console.log(process.env.REACT_APP_CLOUDINARY_CLOUD_NAME);

    imageData.append('file', file);
    imageData.append(
      'upload_preset',
      process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET
    );
    try {
      let cloudinaryResponse = false;
      if (file) {
        cloudinaryResponse = await API.POST(
          API.ENDPOINTS.cloudinary,
          imageData
        );
        console.log(cloudinaryResponse);
      }
      const apiRegBody = {
        ...formFields,
        profile_image: cloudinaryResponse
          ? cloudinaryResponse.data.public_id
          : 'trmxhnakuc50dbq5a16q'
      };

      await API.POST(API.ENDPOINTS.register, apiRegBody);

      const loginData = await API.POST(API.ENDPOINTS.login, {
        email: formFields.email,
        password: formFields.password
      });

      AUTH.setToken(loginData.data.token);
      NOTIFY.SUCCESS(`Welcome, ${loginData.data.username}!`);
      navigate(-1);
    } catch (e) {
      console.log(e);
      setError(true);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Button onClick={goBack}>GO BACK</Button>
      <Container component='main' maxWidth='xs'>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'link.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component='h1' variant='h5'>
            Sign up
          </Typography>
          <Box
            component='form'
            noValidate
            onSubmit={handleCreateUser}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <TextField
                  autoComplete='username'
                  name='username'
                  required
                  fullWidth
                  id='username'
                  label='Username'
                  autoFocus
                  value={formFields.username}
                  onChange={handleChange}
                  error={error}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete='given-name'
                  name='first_name'
                  required
                  fullWidth
                  id='firstName'
                  label='First Name'
                  autoFocus
                  value={formFields.first_name}
                  onChange={handleChange}
                  error={error}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id='lastName'
                  label='Last Name'
                  name='last_name'
                  autoComplete='family-name'
                  value={formFields.last_name}
                  onChange={handleChange}
                  error={error}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id='email'
                  label='Email Address'
                  name='email'
                  autoComplete='email'
                  value={formFields.email}
                  onChange={handleChange}
                  error={error}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name='password'
                  label='Password'
                  type='password'
                  id='password'
                  autoComplete='new-password'
                  value={formFields.password}
                  onChange={handleChange}
                  error={error}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name='password_confirmation'
                  label='Password Confirmation'
                  type='password'
                  id='passwordConfirmation'
                  autoComplete='new-password'
                  value={formFields.password_confirmation}
                  onChange={handleChange}
                  error={error}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography component='h12' variant='h12'>
                  Add a profile picture
                </Typography>
                <TextField
                  size='small'
                  name='profile_picture'
                  id='profile-picture'
                  type='file'
                  onChange={handleFileChange}
                  sx={{ mb: 2 }}
                />
              </Grid>
            </Grid>
            <Button
              type='submit'
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2, color: 'black' }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent='flex-end'>
              <Grid item>
                <Link href='#' variant='body2'>
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
