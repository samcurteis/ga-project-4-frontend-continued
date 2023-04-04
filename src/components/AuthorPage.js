import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API } from '../lib/api';
import { AUTH } from '../lib/auth';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { useAuthenticated } from '../hooks/useAuthenticated';
import { NOTIFY } from '../lib/notifications';

import { Container, Box, Typography } from '@mui/material';
import { IconContext } from 'react-icons';

import CommonTypography from './common/CommonTypography';
import CommonButton from './common/CommonButton';

export default function AuthorPage() {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const navigateToPoem = (e) => navigate(`/poems/${e.target.id}`);
  const { id } = useParams();
  const [singleAuthor, setSingleAuthor] = useState(null);
  const currentUserId = AUTH.getPayload().sub;
  const [isUpdated, setIsUpdated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn] = useAuthenticated();

  function OrangeHeart() {
    return (
      <IconContext.Provider
        value={{
          color: '#ffa500',
          style: { display: 'flex', alignItems: 'center' }
        }}
      >
        <div>
          <AiFillHeart />
        </div>
      </IconContext.Provider>
    );
  }

  useEffect(() => {
    API.GET(API.ENDPOINTS.singleAuthor(id))
      .then(({ data }) => {
        setSingleAuthor(data);
      })
      .catch(({ message, response }) => {
        console.error(message, response);
      });
    API.GET(API.ENDPOINTS.singleUser(currentUserId))
      .then(({ data }) => {
        setCurrentUser(data);
        console.log('current user is', data);
      })
      .catch(({ message, response }) => {
        console.error(message, response);
      });
      setIsUpdated(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isUpdated]);

  const toggleFavorite = () => {
    const data = {
      ...singleAuthor,
      author: singleAuthor.id,
      favorites: singleAuthor.favorites.includes(currentUserId)
        ? singleAuthor.favorites.filter((i) => i !== currentUserId)
        : [...singleAuthor.favorites, currentUserId]
    };
      console.log(data);

    API.PUT(API.ENDPOINTS.singleAuthor(id), data, API.getHeaders())
      .then(({ data }) => {
        console.log('from put', data);
        setIsUpdated(true);
      })
      .catch((e) => console.log(e));
      setIsUpdated(true);
  };

  const deleteAuthor = () =>
    API.DELETE(API.ENDPOINTS.singleAuthor(id), API.getHeaders())
      .then(({ data }) => {
        NOTIFY.SUCCESS(`${singleAuthor.name} deleted`);
        console.log(data);
        navigate(-1);
      })
      .catch((e) => console.log(e));

  // useEffect(() => {

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [singleAuthor.favorites.length]);

  return (
    <Container className='Page'>
      <CommonButton onClick={goBack}>GO BACK</CommonButton>
      {currentUser?.is_staff ? (
        <>
          <CommonButton onClick={deleteAuthor}>Delete author</CommonButton>
        </>
      ) : (
        <></>
      )}
      <Typography
        sx={{ fontSize: '30px', marginTop: '10px', marginBottom: '15px' }}
      >
        {singleAuthor?.name}
      </Typography>
      {isLoggedIn && (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {singleAuthor?.favorites.includes(currentUserId) ? (
            <OrangeHeart />
          ) : (
            <AiOutlineHeart />
          )}
          <CommonButton
            sx={{ padding: '10px' }}
            onClick={toggleFavorite}
            name='post_favorites'
          >
            {singleAuthor?.favorites.length}{' '}
            {singleAuthor?.favorites.length === 1 ? 'favourite' : 'favourites'}
          </CommonButton>
        </Box>
      )}
      <p>Poems</p>
      {singleAuthor?.poems.map((poem) => (
        <CommonTypography
          className='poem-list'
          onClick={navigateToPoem}
          key={poem.id}
          id={poem.id}
        >
          {poem.title}
        </CommonTypography>
      ))}
    </Container>
  );
}
