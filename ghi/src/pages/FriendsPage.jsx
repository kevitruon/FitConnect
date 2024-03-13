import React, { useState, useEffect } from 'react';
import useToken from '@galvanize-inc/jwtdown-for-react';
import FriendRequestButton from './FriendRequestButton';
import FriendRequestList from './FriendRequestList';

const FriendsPage = () => {
  const [friendRequests, setFriendRequests] = useState([]);
  const { accessToken } = useToken();

  useEffect(() => {
    fetchFriendRequests();
  }, []);

  const fetchFriendRequests = async () => {
    try {
      const response = await fetch('http://localhost:8000/friendships', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setFriendRequests(data);
      } else {
        console.error('Failed to fetch friend requests');
      }
    } catch (error) {
      console.error('Error fetching friend requests:', error);
    }
  };

  const handleAddFriend = async (userId) => {
    try {
      const response = await fetch('http://localhost:8000/friendships', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ friend_id: userId }),
      });
      if (response.ok) {
        console.log('Friend request sent');
      } else {
        console.error('Failed to send friend request');
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  const handleAcceptFriend = async (requestId) => {
    try {
      const response = await fetch(`http://localhost:8000/friendships/${requestId}/accepted`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.ok) {
        console.log('Friend request accepted');
        fetchFriendRequests();
      } else {
        console.error('Failed to accept friend request');
      }
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const handleRejectFriend = async (requestId) => {
    try {
      const response = await fetch(`http://localhost:8000/friendships/${requestId}/rejected`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.ok) {
        console.log('Friend request rejected');
        fetchFriendRequests();
      } else {
        console.error('Failed to reject friend request');
      }
    } catch (error) {
      console.error('Error rejecting friend request:', error);
    }
  };

  return (
    <div>
      <h2>Friends</h2>
      {/* Render other friend-related components */}
      <FriendRequestButton userId={/* User ID */} onAddFriend={handleAddFriend} />
      <FriendRequestList
        friendRequests={friendRequests}
        onAcceptFriend={handleAcceptFriend}
        onRejectFriend={handleRejectFriend}
      />
    </div>
  );
};

export default FriendsPage;
