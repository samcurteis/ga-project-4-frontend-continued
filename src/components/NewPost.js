import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NOTIFY } from '../lib/notifications';
import { TextField, Container, Box, TextareaAutosize } from '@mui/material';
import { API } from '../lib/api';

import CommonButton from './common/CommonButton';

export default function NewPostPage({ singlePost }) {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });

  useEffect(() => {
    singlePost &&
      setFormData({
        title: singlePost.title,
        content: singlePost.content
      });
  }, [singlePost]);

  const postTemplateData = {
    post_likes: [],
    post_favorites: [],
    comments: []
  };

  const [error, setError] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    singlePost ? editPost() : createPost();
  };

  const createPost = (e) => {
    API.POST(
      API.ENDPOINTS.allPosts,
      { ...formData, ...postTemplateData },
      API.getHeaders()
    )
      .then(({ data }) => {
        NOTIFY.SUCCESS(`Created ${data.title}`);
        navigate(`/posts/${data.id}`);
        console.log(data);
      })
      .catch((e) => {
        if (e.status === 301) {
          setError(true);
        }
        console.log(e);
      });
  };

  const editPost = (e) => {
    console.log(singlePost);
    const comments = singlePost.comments.map((comment) => comment.id);
    const test = {
      ...singlePost,
      ...formData,
      author: singlePost.author.id,
      comments: comments
    };
    console.log('test data ', test);
    API.PUT(API.ENDPOINTS.singlePost(singlePost.id), test, API.getHeaders())
      .then(({ data }) => {
        NOTIFY.SUCCESS(`Edited ${data.title}`);
        navigate(`/posts/${data.id}`);
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
              value={formData.title}
              onChange={handleChange}
              error={error}
              label='Title'
              name='title'
            />
          </Box>
          <TextareaAutosize
            rows={10}
            style={{ display: 'flex', width: '300px', height: '100px' }}
            type='text'
            value={formData.content}
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
            {singlePost ? 'SAVE CHANGES' : 'CREATE POST'}
          </CommonButton>
        </Box>
      </Container>
    </>
  );
}
