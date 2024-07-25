// pages/chat/[id].js
'use client'
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Apis from '@/public/Apis/Apis';

const Page = () => {
  const {id} = useParams();
  // const id = 1
  // const data = router.query; // Access the dynamic route parameter
  console.log("Dta ", id)
  const [chat, setChat] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchChatData(id);
    }
  }, [id]);

  const fetchChatData = async (chatId) => {
    try {
      setLoading(true);
      const ApiPath = Apis.GetMessages
      const LSD = localStorage.getItem('User');
      const localStorageData = JSON.parse(LSD);
      const AuthToken = localStorageData.data.token;

      const response = await axios.get(`${ApiPath}?chatId=${chatId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AuthToken}`
        }
      });

      if (response.status === 200) {
        setChat(response.data.data);
        console.log("Chat history is:", response.data)
      } else {
        console.error('Error fetching chat data:', response);
      }
    } catch (error) {
      console.error('Error occurred in API call:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!chat) {
    return <div>No chat found for ID {id}</div>;
  }

  console.log('Chat to test :', chat);

  return (
    <div>
      <h1>Chat ID: {id}</h1>
      <div>
        {chat.map((message, index) => (
          <p key={index}>{message.content}</p>
        ))}
      </div>
    </div>
  );
};

export default Page;
