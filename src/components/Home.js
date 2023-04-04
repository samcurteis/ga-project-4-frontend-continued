import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../lib/api';

import { Box, Typography } from '@mui/material';
import CommonButton from './common/CommonButton';
import CommonTypography from './common/CommonTypography';
import ProfilePicture from './common/ProfilePicture';

export default function Home() {
  // const [poems, setPoems] = useState(null);
  const [randomPoem, setRandomPoem] = useState(null);
  // const [posts, setPosts] = useState(null);
  const [popularAuthors, setPopularAuthors] = useState(null);
  const [popularPoems, setPopularPoems] = useState(null);
  const [popularPosts, setPopularPosts] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);
  // const [users, setUsers] = useState(null);
  const [isUpdated, setIsUpdated] = useState(true);
  const navigate = useNavigate();
  const navigateToAuthor = (e) => navigate(`/authors/${e.target.id}`);
  const navigateToUser = (e) => navigate(`/users/${e.target.id}`);
  const navigateToPoem = (e) => navigate(`/poems/${e.target.id}`);
  const navigateToPost = (e) => navigate(`/posts/${e.target.id}`);
  // const goBack = () => navigate(-1);

  const getRandomPoem = () => setIsUpdated(true);

  useEffect(() => {
    API.GET(API.ENDPOINTS.singlePoem(Math.round(Math.random() * 15652)))
      .then(({ data }) => {
        setRandomPoem(data);
      })
      .catch(({ message, response }) => {
        console.error(message, response);
      });
    setIsUpdated(false);

    API.GET(API.ENDPOINTS.popularAuthors).then(({ data }) => {
      const filterData = data.filter((i) => i.favorites.length > 0);
      setPopularAuthors(filterData);
    });

    API.GET(API.ENDPOINTS.popularPoems).then(({ data }) => {
      const filterData = data.filter((i) => i.poem_favorites.length > 0);
      setPopularPoems(filterData);
    });

    API.GET(API.ENDPOINTS.allPosts).then(({ data }) => {
      const filterData = data.filter((i) => i.post_favorites.length > 0);
      setPopularPosts(filterData);
    });

    API.GET(API.ENDPOINTS.recentPosts).then(({ data }) => {
      setRecentPosts(data);
    });
  }, [isUpdated]);

  const title = randomPoem?.title.split('\n').join('<br><br/>');

  return (
    <section className='home Page'>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '80vh',
          width: '100vw'
        }}
      >
        <h1>Welcome to Poet's Corner</h1>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          // alignItems: 'center',
          width: '70vw'
        }}
      >
        <Box name='random-poem'>
          <h2>Random poem</h2>
          <Box sx={{ paddingLeft: '20px' }}>
            <p
              className='poem-title'
              onClick={navigateToPoem}
              key={randomPoem?.id}
              id={randomPoem?.id}
              dangerouslySetInnerHTML={{ __html: title }}
            ></p>
      <CommonTypography 
      onClick={navigateToAuthor} 
      id={randomPoem?.author.id} 
      >{randomPoem?.author.name}
      </CommonTypography>
      <CommonButton sx={{ padding: '20px' }} onClick={getRandomPoem}>
      get random poem
            </CommonButton>
          </Box>
        </Box>
        <Box
          name='recent-posts'
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'wrap'
          }}
        >
          <h2>Recent posts</h2>
          <Box
            sx={{
              paddingLeft: '20px',
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              paddingBottom: '50px'
            }}
          >
            {recentPosts?.map((post) => (
              <Box key={post.id} sx={{ mr: 10 }}>
                <p className='post-title' onClick={navigateToPost} id={post.id}>
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
            ))}
          </Box>
        </Box>
        <Box
          name='popular-authors'
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'wrap'
          }}
        >
          <h2>Popular authors</h2>
          <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
            {popularAuthors?.map((author) => (
              <Box key={author.id} sx={{ padding: '20px', mr: 5 }}>
                <CommonTypography
                  sx={{ fontSize: '18px' }}
                  onClick={navigateToAuthor}
                  id={author.id}
                >
                  {author.name}
                </CommonTypography>
                <Typography>
                  {author.favorites.length}{' '}
                  {author.favorites.length === 1 ? 'favourite' : 'favourites'}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
        <Box
          name='popular-poems'
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'wrap'
          }}
        >
          <h2>Popular poems</h2>
          <Box
            sx={{
              paddingLeft: '20px',
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap'
            }}
          >
            {popularPoems?.map((poem) => {
              const popularPoemTitle = poem.title.split('\n').join('<br><br/>');
              return (
                <Box key={poem.id} sx={{ width: 200 }}>
                  <p
                    className='poem-title'
                    onClick={navigateToPoem}
                    key={poem?.id}
                    id={poem?.id}
                    dangerouslySetInnerHTML={{ __html: popularPoemTitle }}
                  ></p>
                  <CommonTypography
                    sx={{ fontSize: '18px' }}
                    onClick={navigateToAuthor}
                    id={poem.author.id}
                  >
                    {poem?.author.name}
                  </CommonTypography>
                  <Typography sx={{ padding: '20px' }}>
                    {poem.poem_favorites.length}{' '}
                    {poem.poem_favorites.length === 1
                      ? 'favourite'
                      : 'favourites'}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
        <Box
          name='popular-posts'
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'wrap'
          }}
        >
          <h2>Popular posts</h2>
          <Box
            sx={{
              paddingLeft: '20px',
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              paddingBottom: '50px'
            }}
          >
            {popularPosts?.map((post) => (
              <Box key={post.id} sx={{ mr: 10 }}>
                <p className='post-title' onClick={navigateToPost} id={post.id}>
                  {post.title}
                </p>
                <Typography>
                  {post.post_favorites.length}{' '}
                  {post.post_favorites.length === 1
                    ? 'favourite'
                    : 'favourites'}
                </Typography>
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
            ))}
          </Box>
        </Box>
      </Box>
    </section>
  );
}
