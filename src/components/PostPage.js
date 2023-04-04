import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API } from '../lib/api';
import { AUTH } from '../lib/auth';
import { NOTIFY } from '../lib/notifications';
import { IconContext } from 'react-icons';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { HiOutlineThumbUp, HiThumbUp } from 'react-icons/hi';

import { Container, Box, TextareaAutosize, Typography } from '@mui/material';

import CommentCard from './common/CommentCard';
import CommonButton from './common/CommonButton';
import { useAuthenticated } from '../hooks/useAuthenticated';

export default function PostPage({ singlePost, setSinglePost }) {
  // const [isLoggedIn] = useAuthenticated();
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const navigateToUser = (e) => navigate(`/users/${e.target.id}`);
  const navigateToNewPost = () => navigate(`/new-post`);
  const [isLoggedIn] = useAuthenticated();
  const { id } = useParams();

  // const [currentUser, setCurrentUser] = useState(null);
  const [isUpdated, setIsUpdated] = useState(false);
  const initialData = {
    text: '',
    post: id
  };
  const [data, setData] = useState(initialData);
  const [updateData, setUpdateData] = useState(false);
  const currentUserId = AUTH.getPayload().sub;

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
  function OrangeThumbUp() {
    return (
      <IconContext.Provider
        value={{
          color: '#ffa500',
          style: { display: 'flex', alignItems: 'center' }
        }}
      >
        <div>
          <HiThumbUp />
        </div>
      </IconContext.Provider>
    );
  }

  useEffect(() => {
    API.GET(API.ENDPOINTS.singlePost(id))
      .then(({ data }) => {
        console.log(data);
        setSinglePost(data);
      })
      .catch(({ message, response }) => {
        console.error(message, response);
      });
    setIsUpdated(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isUpdated]);

  const addComment = () => {
    console.log(data);
    API.POST(API.ENDPOINTS.allComments, data, API.getHeaders())
      .then(({ data }) => {
        console.log(data);
      })
      .catch(({ message, response }) => {
        console.error(message, response);
      });
    setIsUpdated(true);
    setData(initialData);
  };

  const toggleLike = () => {
    const data = {
      author: singlePost.author.id,
      post_likes: [...singlePost.post_likes]
    };
    const index = data.post_likes.indexOf(currentUserId);

    singlePost.post_likes.includes(currentUserId)
      ? data.post_likes.splice(index, 1)
      : data.post_likes.push(currentUserId);
    setUpdateData(data);
  };

  const toggleFavorite = () => {
    const data = {
      author: singlePost.author.id,
      post_favorites: [...singlePost.post_favorites]
    };
    const index = data.post_favorites.indexOf(currentUserId);

    singlePost.post_favorites.includes(currentUserId)
      ? data.post_favorites.splice(index, 1)
      : data.post_favorites.push(currentUserId);
    setUpdateData(data);
  };

  useEffect(() => {
    API.PUT(
      API.ENDPOINTS.singlePost(id),
      { ...singlePost, ...updateData },
      API.getHeaders()
    )
      .then(({ data }) => {
        console.log(data);
        setUpdateData(false);
        setIsUpdated(true);
      })
      .catch((e) => console.log(e));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateData]);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const deletePost = () =>
    API.DELETE(API.ENDPOINTS.singlePost(id), API.getHeaders())
      .then(() => {
        NOTIFY.SUCCESS(`Post deleted`);
        console.log(data);
        navigate(`/users/${AUTH.getPayload().sub}`);
      })
      .catch((e) => console.log(e));

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '100px',
        marginLeft: '50px'
      }}
      className='Page'
    >
      <CommonButton sx={{ justifyContent: 'left' }} onClick={goBack}>
        GO BACK
      </CommonButton>
      <p className='post-title'>{singlePost?.title}</p>
      <Typography onClick={navigateToUser} id={singlePost?.author.id}>
        {singlePost?.author.name}
      </Typography>
      <Typography
        sx={{ padding: '20px' }}
      >{`${singlePost?.content}`}</Typography>
      {AUTH.isOwner(singlePost?.author.id) && (
        <Box name='edit-delete-buttons' sx={{ justifyContent: 'left' }}>
          <CommonButton onClick={navigateToNewPost}>EDIT</CommonButton>{' '}
          <CommonButton onClick={deletePost}>DELETE</CommonButton>
        </Box>
      )}
      {isLoggedIn && (
        <Box
          name='like-favourite-buttons'
          sx={{
            display: 'flex',
            justifyContent: 'left',
            alignItems: 'center',
            mb: 2
          }}
        >
          {singlePost?.post_likes.includes(currentUserId) ? (
            <OrangeThumbUp />
          ) : (
            <HiOutlineThumbUp />
          )}
          <CommonButton onClick={toggleLike} name='post_likes'>
            {singlePost?.post_likes.length}{' '}
            {singlePost?.post_likes.length === 1 ? 'like' : 'likes'}
          </CommonButton>
          {singlePost?.post_favorites.includes(currentUserId) ? (
            <OrangeHeart />
          ) : (
            <AiOutlineHeart />
          )}
          <CommonButton onClick={toggleFavorite} name='post_favorites'>
            {singlePost?.post_favorites.length}{' '}
            {singlePost?.post_favorites.length === 1
              ? 'favourite'
              : 'favourites'}
          </CommonButton>
        </Box>
      )}
      {singlePost?.comments?.map((comment) => {
        return (
          <CommentCard
            key={comment.id}
            text={comment.text}
            owner={comment.owner}
            commentId={comment.id}
            post={comment.post}
            created_at={comment.created_at}
            // currentUser={currentUser}
            setIsUpdated={setIsUpdated}
          />
        );
      })}
      {isLoggedIn && (
        <Box name='add-comment' sx={{ flexDirection: 'column' }}>
          <TextareaAutosize
            name='text'
            value={data.text}
            onChange={handleChange}
            placeholder='Leave a comment'
            style={{
              display: 'flex',
              width: '250px',
              height: '40px',
              marginLeft: '10px',
              marginTop: '10px'
            }}
          />
          <CommonButton
            sx={{ display: 'flex', paddingBottom: '30px', paddingTop: '10px' }}
            onClick={addComment}
          >
            ADD COMMENT
          </CommonButton>
        </Box>
      )}
    </Container>
  );
}
