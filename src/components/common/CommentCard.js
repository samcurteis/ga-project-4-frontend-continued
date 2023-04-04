import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { Button, TextareaAutosize, Box } from '@mui/material';
import Typography from '@mui/material/Typography';

import { AUTH } from '../../lib/auth';
import { API } from '../../lib/api';
import { NOTIFY } from '../../lib/notifications';

import ProfilePicture from './ProfilePicture';
import CommonTypography from './CommonTypography';

export default function ReviewCard({
  text,
  commentId,
  owner,
  post,
  created_at,
  // currentUser,
  setIsUpdated
}) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [commentText, setCommentText] = useState(text);
  const navigate = useNavigate();
  const navigateToOwner = () => navigate(`/users/${owner.id}`);

  const toggleEditMode = () => setIsEditMode(!isEditMode);

  const handleCommentTextChange = (e) => setCommentText(e.target.value);

  const saveChanges = () => {
    if (text !== commentText) {
      API.PUT(
        API.ENDPOINTS.singleComment(commentId),
        {
          text: commentText,
          created_at: created_at,
          post: post,
          owner: owner.id
        },
        API.getHeaders()
      )
        .then(() => {
          NOTIFY.SUCCESS('Done!');
          toggleEditMode();
          setIsUpdated(true);
        })
        .catch((e) => console.log(e));
    }
  };

  const deleteComment = () =>
    API.DELETE(API.ENDPOINTS.singleComment(commentId), API.getHeaders())
      .then(() => {
        NOTIFY.SUCCESS('Deleted!');
        setIsUpdated(true);
      })
      .catch((e) => console.log(e));

  return (
    <Card sx={{ minWidth: 200, maxWidth: 500, marginRight: '20px' }}>
      <CardContent>
        <Box
          className='user-data'
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          {owner.profile_image && (
            <ProfilePicture cloudinaryImageId={owner.profile_image} />
          )}
          <CommonTypography
            onClick={navigateToOwner}
            sx={{ fontSize: 14 }}
            color='text.secondary'
            gutterBottom
          >
            {owner.username}
          </CommonTypography>
        </Box>
        {isEditMode ? (
          <TextareaAutosize
            value={commentText}
            onChange={handleCommentTextChange}
            style={{ width: '100%', height: '22px' }}
          />
        ) : (
          <Typography variant='h8' component='div'>
            {text}
          </Typography>
        )}
      </CardContent>
      {(AUTH.isOwner(owner.id) || AUTH.getPayload().isAdmin) && (
        <CardActions>
          {AUTH.isOwner(owner.id) && (
            <Button onClick={toggleEditMode} size='small'>
              {isEditMode ? 'CANCEL' : 'EDIT COMMENT'}
            </Button>
          )}
          <Button
            size='small'
            onClick={isEditMode ? saveChanges : deleteComment}
          >
            {isEditMode ? 'SAVE CHANGES' : 'DELETE COMMENT'}
          </Button>
        </CardActions>
      )}
    </Card>
  );
}
