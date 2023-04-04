import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../lib/api';

import { Container, Grid, Typography, Box } from '@mui/material';
import CommonButton from './common/CommonButton';
import CommonTypography from './common/CommonTypography';
import ProfilePicture from './common/ProfilePicture';

export default function SearchPage({ searchedData, setIsUpdated, isUpdated }) {
  const [poems, setPoems] = useState(null);
  const [posts, setPosts] = useState(null);
  const [authors, setAuthors] = useState(null);
  const [users, setUsers] = useState(null);
  const [isPoemDropdownOpen, setIsPoemDropdownOpen] = useState(true);
  const [visiblePoems, setVisiblePoems] = useState(null);
  const navigate = useNavigate();
  const navigateToAuthor = (e) => navigate(`/authors/${e.target.id}`);
  const navigateToUser = (e) => navigate(`/users/${e.target.id}`);
  const navigateToPoem = (e) => navigate(`/poems/${e.target.id}`);
  const navigateToPost = (e) => navigate(`/posts/${e.target.id}`);
  const goBack = () => navigate(-1);

  useEffect(() => {
    API.GET(API.ENDPOINTS.searchPoemTitles(searchedData))
      .then(({ data }) => {
        const initialData = [...data];
        initialData.splice(6);
        console.log(data);
        setPoems(data);
        setVisiblePoems(initialData);
        console.log(data);
      })
      .catch(({ message, response }) => {
        console.error(message, response);
      });
    API.GET(API.ENDPOINTS.searchPosts(searchedData))
      .then(({ data }) => {
        setPosts(data);
      })
      .catch(({ message, response }) => {
        console.error(message, response);
      });
    API.GET(API.ENDPOINTS.searchAuthors(searchedData))
      .then(({ data }) => {
        setAuthors(data);
      })
      .catch(({ message, response }) => {
        console.error(message, response);
      });
    API.GET(API.ENDPOINTS.searchUsers(searchedData))
      .then(({ data }) => {
        setUsers(data);
      })
      .catch(({ message, response }) => {
        console.error(message, response);
      });

    setIsUpdated(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdated]);

  const togglePoemDropdown = () => {
    setIsPoemDropdownOpen(!isPoemDropdownOpen);
    console.log(isPoemDropdownOpen);
    const dropdownPoems = [...poems];
    dropdownPoems.splice(6);
    const visiblePoems = isPoemDropdownOpen === true ? poems : dropdownPoems;
    setVisiblePoems(visiblePoems);
  };

  return (
    <Container maxWidth='lg' className='Page'>
      <CommonButton onClick={goBack}>GO BACK</CommonButton>
      <Grid
        sx={{ display: 'flex', flexDirection: 'column' }}
        container
        spacing={2}
      >
        {users?.length === 0 ? (
          <></>
        ) : (
          <Typography sx={{ fontSize: '25px', padding: '20px' }}>
            Users
          </Typography>
        )}
        <Box
          sx={{
            width: 200,
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            paddingLeft: '20px'
          }}
        >
          {users?.map((user) => (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
              }}
              className='user-data'
            >
              <ProfilePicture cloudinaryImageId={user.profile_image} />
              <CommonTypography
                sx={{ fontSize: '18px' }}
                onClick={navigateToUser}
                id={user.id}
              >
                {user.username}
              </CommonTypography>
            </Box>
          ))}
        </Box>
        {authors?.length === 0 ? (
          <></>
        ) : (
          <Typography sx={{ fontSize: '25px', padding: '20px' }}>
            Authors
          </Typography>
        )}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap'
          }}
        >
          {authors?.map((author) => (
            <CommonTypography
              onClick={navigateToAuthor}
              id={author.id}
              key={author.id}
              sx={{ fontSize: '17px', padding: '20px' }}
            >
              {author.name}
            </CommonTypography>
          ))}
        </Box>
        {poems?.length === 0 ? (
          <></>
        ) : (
          <Typography sx={{ fontSize: '25px', padding: '20px' }}>
            Poems
          </Typography>
        )}
        {poems?.length > 6 ? (
          <CommonTypography
            onClick={togglePoemDropdown}
            sx={{ padding: '20px' }}
          >
            {isPoemDropdownOpen === true
              ? 'View more poems'
              : 'View less poems'}
          </CommonTypography>
        ) : (
          <></>
        )}
        <Box
          sx={{
            width: '70vw',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap'
          }}
        >
          {visiblePoems?.map((poem) => {
            const title = poem.title.split('\n').join('<br><br/>');

            return (
              <Box
                sx={{
                  width: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  flexWrap: 'wrap',
                  paddingLeft: '20px',
                  paddingRight: '20px'
                }}
                key={poem.id}
              >
                <p
                  className='poem-title'
                  onClick={navigateToPoem}
                  id={poem.id}
                  dangerouslySetInnerHTML={{ __html: title }}
                ></p>
                <CommonTypography
                  onClick={navigateToAuthor}
                  id={poem.author.id}
                  key={poem.author.id}
                >
                  {poem.author.name}
                </CommonTypography>
              </Box>
            );
          })}
        </Box>

        {posts?.length === 0 ? (
          <></>
        ) : (
          <Typography key='posts' sx={{ fontSize: '25px', padding: '20px' }}>
            Posts
          </Typography>
        )}
        <Box
          sx={{
            width: '70vw',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginBottom: '80px'
          }}
        >
          {posts?.map((post) => {
            return (
              <Box
                sx={{
                  width: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  flexWrap: 'wrap',
                  paddingLeft: '20px',
                  paddingRight: '20px'
                }}
                key={post.id}
              >
                <p
                  className='post-title'
                  onClick={navigateToPost}
                  id={post.id}
                  key={post.title}
                  // sx={{ fontSize: '18px', fontWeight: 'bold' }}
                >
                  {post.title}
                </p>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}
                  className='user-data'
                >
                  <ProfilePicture
                    cloudinaryImageId={post.author.profile_image}
                  />
                  <CommonTypography
                    sx={{ fontSize: '18px' }}
                    onClick={navigateToUser}
                    id={post.author.id}
                  >
                    {post.author.username}
                  </CommonTypography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Grid>
    </Container>
  );
}
