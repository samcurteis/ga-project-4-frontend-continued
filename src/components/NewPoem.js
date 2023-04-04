import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NOTIFY } from '../lib/notifications';
import {
  TextField,
  Container,
  Box,
  TextareaAutosize,
  Autocomplete,
  Typography
} from '@mui/material';
import { API } from '../lib/api';

import CommonButton from './common/CommonButton';

export default function NewPoemPage({ singlePoem }) {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const [authors, setAuthors] = useState(null);
  const [foundAuthor, setFoundAuthor] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    content: ''
  });

  useEffect(() => {
    API.GET(API.ENDPOINTS.allAuthors)
      .then(({ data }) => {
        setAuthors(data);
        console.log(data);
      })
      .catch(({ message, response }) => {
        console.error(message, response);
      });
  }, []);

  useEffect(() => {
    singlePoem &&
      setFormData({
        title: singlePoem.title,
        author: singlePoem.author.id,
        content: singlePoem.content
      });
    console.log(singlePoem);
  }, [singlePoem]);

  const [error, setError] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    singlePoem ? editPoem() : createPoem();
  };

  const createNewAuthor = () => {
    API.POST(
      API.ENDPOINTS.allAuthors,
      { name: formData.author, favorites: [] },
      API.getHeaders()
    )
      .then(({ data }) => {
        NOTIFY.SUCCESS(`Created new author ${data.name}`);
        setFormData({ ...formData, author: data.id });
        console.log(data);
      })
      .catch((e) => {
        if (e.status === 301) {
          setError(true);
        }
        console.log(e);
      });
    setFoundAuthor(true);
  };

  const createPoem = (e) => {
    console.log(formData);
    // if (typeof formData.author !== number) {
    const foundAuthor = authors.filter(
      (author) => author.id === formData.author
    );
    foundAuthor.length < 1
      ? API.POST(
          API.ENDPOINTS.allAuthors,
          { name: formData.author, favorites: [] },
          API.getHeaders()
        )
          .then(({ data }) => {
            NOTIFY.SUCCESS(`Created new author ${data.name}`);
            console.log(data);
            API.POST(
              API.ENDPOINTS.popularPoems,
              { ...formData, author: data.id },
              API.getHeaders()
            )
              .then(({ data }) => {
                NOTIFY.SUCCESS(`Created new poem ${data.title}`);
                navigate(`/poems/${data.id}`);
                console.log(data);
              })
              .catch((e) => {
                if (e.status === 301) {
                  setError(true);
                }
                console.log(e);
              });
          })
          .catch((e) => {
            if (e.status === 301) {
              setError(true);
            }
            console.log(e);
          })
      : API.POST(API.ENDPOINTS.popularPoems, formData, API.getHeaders())
          .then(({ data }) => {
            NOTIFY.SUCCESS(`Created new poem ${data.title}`);
            console.log(data);
          })
          .catch((e) => {
            if (e.status === 301) {
              setError(true);
            }
            console.log(e);
          });
  };

  const editPoem = (e) => {
    console.log(singlePoem);
    const test = {
      ...singlePoem,
      ...formData
    };
    console.log('test data ', test);
    API.PUT(API.ENDPOINTS.singlePoem(singlePoem.id), test, API.getHeaders())
      .then(({ data }) => {
        NOTIFY.SUCCESS(`Edited ${data.title}`);
        navigate(`/poems/${data.id}`);
        console.log(data);
      })
      .catch((e) => {
        if (e.status === 301) {
          setError(true);
        }
        console.log(e);
      });
  };

  return (
    <>
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column'
        }}
        className='Page'
      >
        <CommonButton sx={{ justifyContent: 'left' }} onClick={goBack}>
          GO BACK
        </CommonButton>
        <Box
          sx={{
            flexDirection: 'column',
            alignSelf: 'center',
            paddingTop: 10
          }}
        >
          <Box sx={{ mb: 2 }}>
            <TextField
              size='small'
              type='text'
              value={formData?.title}
              onChange={handleChange}
              error={error}
              label='Title'
              name='title'
            />
          </Box>
          {authors ? (
            <Autocomplete
              sx={{ mb: 2 }}
              freeSolo
              autoSelect
              value={singlePoem?.author.name}
              options={authors?.map((author) => ({
                id: author.id,
                label: author.name
              }))}
              renderInput={(params) => <TextField {...params} label='Author' />}
              onChange={(event, value) => {
                const foundAuthor = authors.filter(
                  (author) => author.name === value
                );
                foundAuthor.length > 0
                  ? setFormData({ ...formData, author: foundAuthor[0].id })
                  : setFormData({ ...formData, author: value });
                foundAuthor.length > 0
                  ? setFoundAuthor(true)
                  : setFoundAuthor(false);
              }}
            />
          ) : (
            <Typography sx={{ mb: 3, ml: 1 }}>Loading authors...</Typography>
          )}
          {formData.author !== singlePoem?.author.id &&
          foundAuthor === false ? (
            <CommonButton onClick={createNewAuthor}>
              Create new author
            </CommonButton>
          ) : (
            console.log('author found')
          )}
          <TextareaAutosize
            rows={10}
            style={{ display: 'flex', width: '300px', height: '100px' }}
            type='text'
            value={formData?.content}
            onChange={handleChange}
            error={toString(error)}
            label='Write your post here'
            name='content'
          />
          <CommonButton
            sx={{ padding: '20px', mb: 50 }}
            type='submit'
            onClick={handleSubmit}
          >
            {singlePoem ? 'SAVE CHANGES' : 'CREATE POST'}
          </CommonButton>
        </Box>
      </Container>
    </>
  );
}
