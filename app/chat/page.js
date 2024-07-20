'use client'
import { Button, CircularProgress, Grid, TextField } from '@mui/material';
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import docco from 'react-syntax-highlighter/dist/esm/styles/hljs/docco';
import vs from 'react-syntax-highlighter/dist/esm/styles/hljs/vs';
import vs2015 from 'react-syntax-highlighter/dist/esm/styles/hljs/vs2015';
import ChoosePlan from '@/public/ui/ChoosePlan';
import ImagePicker from '@/public/ui/ImagePicker';
import LogoPicker from '@/public/ui/LogoPicker';
import Apis from '@/public/Apis/Apis';

SyntaxHighlighter.registerLanguage('javascript', js);

const darkDocco = {
  ...docco,
  'code[class*="language-"]': {
    ...docco['code[class*="language-"]'],
    backgroundColor: '#2D2D2D',
    color: '#f8f8f2',
  },
  'pre[class*="language-"]': {
    ...docco['pre[class*="language-"]'],
    backgroundColor: '#2D2D2D',
    color: '#f8f8f2',
  },
  'pre[class*="language-"]::before': {
    backgroundColor: '#2D2D2D',
  },
  'pre[class*="language-"]::after': {
    backgroundColor: '#2D2D2D',
  },
};

const Page = () => {
  const Suggestion = {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
    textTransform: 'none',
  };

  const [message, setMessage] = useState('');
  const [userChat, setUserChat] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [UserChatMessage, setUserChatMessage] = useState('');
  const [activeChat, setActiveChat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openTeam, setOpenTeam] = useState(false);
  const [openPlan, setOpenPlan] = useState(false);
  const [openProjects, setOpenProjects] = useState(true);
  const [openSetting, setOpenSetting] = useState(false);
  const [open, setOpen] = useState(false);
  const [openRef, setOpenRefer] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [openSupport, setOpenSupport] = useState(false);
  const [openShareApp, setOpenShareApp] = useState(false);
  const [openAddTeam, setOpenAddTeam] = useState(false);
  const [appName, setAppName] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [SelectedLogo, setSelectedLogo] = useState(null);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [chatId, setChatId] = useState(null);
  const [myProjects, setMyProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [getMessagesLoader, setGetMessagesLoader] = useState(false);

  //test useeffect

  // useEffect(() => {
  //   console.log("Test history is :", UserChatMessage);
  // }, [UserChatMessage]);

  useEffect(() => {
    const storedHistory = localStorage.getItem('chatHistory');
    if (storedHistory) {
      setChatHistory(JSON.parse(storedHistory));
    }
  }, []);

  useEffect(() => {
    const NewProject = localStorage.getItem('NewProject');
    if (NewProject) {
      // setChatHistory(JSON.parse(storedHistory));
      const projectChatId = JSON.parse(NewProject);
      console.log('New project from local storage is :', projectChatId.data.chat.id);
      setChatId(projectChatId.data.chat.id);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
  }, [chatHistory]);

  //code to separate text and code
  const separateTextAndCode = (input) => {
    const regex = /(```.*?```)/gs;
    const parts = input.split(regex);

    return parts.map(part => {
      if (part.startsWith('```') && part.endsWith('```')) {
        return {
          type: 'code',
          value: part.slice(3, -3).trim(),
        };
      } else {
        return {
          type: 'string',
          value: part.trim(),
        };
      }
    });
  };

  const callOpenAIAPI = async (messages) => {
    const LSD = localStorage.getItem('User');
    const localStorageData = JSON.parse(LSD);
    console.log('Data from localstorage is :', localStorageData);
    const AuthToken = localStorageData.data.token;
    try {
      const ApiPath = Apis.SendMessage;
      const data = {
        chatId: chatId,
        content: UserChatMessage
      }
      console.log('Data sending in api is', data);
      const response = await fetch(ApiPath, {
        method: 'post',
        headers: {
          'Authorization': 'Bearer ' + AuthToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chatId: chatId,
          content: UserChatMessage
        })
      });
      if (response.ok) {
        const Result = await response.json()
        console.log('response of  api is', Result);
        return Result.data[1].content;
      } else if (!response.ok) { console.log('Response is not ok :', response); }
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      return "Sorry, I can't respond right now.";
    }
  };

  const handleSubmit = async (e) => {
    setSelectedFile(null);
    e.preventDefault();
    setLoading(true);

    const newChat = { role: 'user', content: message };
    const updatedChat = [...userChat, newChat];

    if (activeChat !== null) {
      const updatedHistory = chatHistory.map((chat, index) =>
        index === activeChat ? updatedChat : chat
      );
      setChatHistory(updatedHistory);
    } else {
      const newHistory = [...chatHistory, updatedChat];
      setChatHistory(newHistory);
      setActiveChat(chatHistory.length);
    }

    setUserChat(updatedChat);
    setMessage('');

    // Call OpenAI API
    const botMessage = await callOpenAIAPI(updatedChat);
    const updatedChatWithBot = [...updatedChat, { role: 'assistant', content: botMessage }];

    if (activeChat !== null) {
      const updatedHistory = chatHistory.map((chat, index) =>
        index === activeChat ? updatedChatWithBot : chat
      );
      setChatHistory(updatedHistory);
    } else {
      const newHistory = [...chatHistory.slice(0, -1), updatedChatWithBot];
      setChatHistory(newHistory);
    }

    setUserChat(updatedChatWithBot);
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  //code for calling get projects api
  const getProjects = async () => {
    try {
      const ApiPath = Apis.GetProjects;
      const LSD = localStorage.getItem('User');
      const localStorageData = JSON.parse(LSD);
      console.log('Data2 from localstorage is :', localStorageData);
      const AuthToken = localStorageData.data.token;
      console.log('Auth token is', AuthToken);
      const response = await axios.get(ApiPath, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + AuthToken
        }
      });
      if (response) {
        console.log('Response is', response);
      }
      if (response.status === 201) {
        console.log('Response of api is', response.data);
        setMyProjects(response.data.data)
      } else if (!response.status === 201) {
        console.log('Response is not ok due to:', response);
      }
    } catch (error) {
      console.log('error occured is', error);
    }
  };

  useEffect(() => {
    getProjects();
  }, []);

  //code for selecting previous chat
  const handleChatSelect = (index) => {
    setActiveChat(index);
    setUserChat(chatHistory[index]);
  };

  function getResponseView(text) {
    let separatedContent = separateTextAndCode(text)

    return (
      <div className='flex flex-row gap-4 mt-8 mb-8' style={{ width: "80%" }}>
        <div>
          <img src='/assets/logo.png' alt='bot'
            style={{ height: '30px', width: '30px', resize: 'cover', objectFit: 'cover' }} />
        </div>
        <div className='px-4 py-3'
          style={{
            borderTopLeftRadius: 25, backgroundColor: '#ffffff60', borderTopRightRadius: 25,
            borderBottomRightRadius: 25,
          }}>
          {separatedContent.map((part, index) => (
            <div key={index}>
              {part.type === 'code' ? (
                // <pre><code>{part.value}</code></pre>
                <SyntaxHighlighter language="javascript" style={vs2015}>
                  {part.value}
                </SyntaxHighlighter>
              ) : (
                <div className='flex flex-row items-center gap-2' style={{ color: 'white' }}>
                  {/*<strong>Chat GPT:</strong>*/}
                  {/* <div>
                  <img src='/assets/logo.png' alt='bot'
                    style={{ height: '50px', width: '50px', resize: 'cover' }} />
                </div> */}
                  {/* <div style={{
                  marginTop: 10, marginBottom: 10, color: 'white',
                  maxWidth: '80%', borderTopLeftRadius: 25, borderTopRightRadius: 25,
                  borderBottomRightRadius: 25, backgroundColor: '#ffffff40'
                }}> */}
                  <p
                    style={{
                      color: 'white', padding: 15,
                      borderTopLeftRadius: 25, borderTopRightRadius: 25, borderBottomRightRadius: 25
                    }}>
                    {part.value}
                  </p>
                  {/* </div> */}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  //code for getProjects api



  //code for opening my team and plans
  const handleProjectClick = () => {
    setOpenProjects(true);
    setOpenPlan(false);
    setOpenTeam(false);
    setOpenSetting(false);
  }

  const handleSettingClick = () => {
    setOpenSetting(true);
    setOpenPlan(false);
    setOpenProjects(false);
    setOpenTeam(false);
  }

  const handlePlanClick = () => {
    setOpenPlan(true);
    setOpenProjects(false);
    setOpenTeam(false);
    setOpenSetting(false);
  }

  const handleTeamClick = () => {
    setOpenTeam(true);
    setOpenProjects(false);
    setOpenPlan(false);
    setOpenSetting(false);
  }

  //code for projects modal

  const handleOpenEditproject = () => setOpen(true);
  const handleOpenShareproject = () => setOpenShareApp(true);
  const handleOpenRefer = () => setOpenRefer(true);
  const handleOpenSupport = () => setOpenSupport(true);
  const handleOpenProfile = () => setOpenProfile(true);
  const handleOpenAddTeam = () => setOpenAddTeam(true);
  const handleCloseShareProject = () => setOpenShareApp(false);
  const handleCloseEditProject = () => {
    setOpen(false);
    setOpenRefer(false);
    setOpenAddTeam(false);
    setOpenSupport(false);
    setOpenProfile(false);
  };


  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    // border: '2px solid #000',
    boxShadow: 24,
    p: 2,
    borderRadius: 2,
    backgroundColor: '#0F0C2D'
  };

  const referStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    height: 450,
    bgcolor: 'background.paper',
    // border: '2px solid #000',
    boxShadow: 24,
    p: 2,
    borderRadius: 2,
    backgroundColor: '#0F0C2D'
  };

  const addTeamStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    // height: 450,
    bgcolor: 'background.paper',
    // border: '2px solid #000',
    boxShadow: 24,
    p: 3,
    borderRadius: 2,
    backgroundColor: '#0F0C2D'
  };

  const referStyle2 = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 550,
    bgcolor: 'background.paper',
    // border: '2px solid #000',
    boxShadow: 24,
    // p: 2,
    borderRadius: 2,
    backgroundColor: '#0F0C2D'
  };

  //code for tema profile
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [teamProfiles, setTeamProfiles] = useState([
    {
      id: 1,
      name: 'James J.',
      role: 'Web Developer',
      email: 'james@gmail.com',
      status: 'Accepted'
    },
    {
      id: 2,
      name: 'John D.',
      role: 'App Developer',
      email: 'john@gmail.com',
      status: 'Pending'
    },
    {
      id: 3,
      name: 'Jony J.',
      role: 'Web Designer',
      email: 'jony@gmail.com',
      status: 'Accepted'
    },
    {
      id: 4,
      name: 'David J.',
      role: 'Bank Manager',
      email: 'david@gmail.com',
      status: 'Pending'
    },
    {
      id: 5,
      name: 'Anya.',
      role: 'Cook',
      email: 'anya@gmail.com',
      status: 'Accepted'
    }
  ]);

  const handleAddTeam = (e) => {
    if (name && email && role) {
      e.preventDefault();
      setOpenAddTeam(false);
      const newMember = {
        id: teamProfiles.length + 1,
        name,
        email,
        role,
        status: 'Pending'
      }
      setTeamProfiles([...teamProfiles, newMember]);
      setName('');
      setEmail('');
      setRole('');
    } else {
      console.log('Cannot');
    }
  }

  const handleFileSelect = (file) => {
    // Handle the selected file here (e.g., upload to server, display preview, etc.)
    console.log('Selected file:', file);
    setSelectedImage(file.previewURL);
  };

  const handleLogoSelect = (file) => {
    // Handle the selected file here (e.g., upload to server, display preview, etc.)
    setSelectedLogo(file.previewURL);
    console.log('Selected logo file:', file);
  };

  //code for adding image in input

  const handleInputFileChange = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      const previewURL = reader.result;
      // console.log("Image url is :", previewURL);
      setPreviewURL(previewURL);
      // onFile({ file, previewURL }); // Callback to parent component
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  //code for editing project
  const handleEditProject = async (item) => {
    console.log('Project id is', item);
    setSelectedProjectId(item);
    try {
      setGetMessagesLoader(true);
      const ApiPath = Apis.GetMessages;
      const LSD = localStorage.getItem('User');
      const localStorageData = JSON.parse(LSD);
      console.log('Data2 from localstorage is :', localStorageData);
      const AuthToken = localStorageData.data.token;
      // console.log('Auth token is', AuthToken);
      const response = await axios.get(ApiPath, {
        chatId: item
      },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + AuthToken
          }
          // body: JSON.stringify({ chatId: item })
        }
      );
      if (response) {
        console.log('Response is :', response);
      }
      if (response.status === 200) {
        console.log('messages of selected id are :', response.data.data);
      } else {
        console.log('Response is not ok :', response);
      }
    } catch (error) {
      console.error('Error occured in api is :', error);
    } finally {
      setGetMessagesLoader(false);
    }
  }

  //code for calling get messages api
  // const getMessages = async () => {

  // }

  return (
    <div className='text-white' style={{ display: 'flex', backgroundColor: '#050221' }}>
      <div className='w-2/12 flex flex-col items-center'
        style={{ padding: 7, borderRight: '1px solid #555555' }}>
        <div className='w-11/12'>
          <div className='flex flex-row justify-center'>
            <button>
              <img src='/assets/logo.png' alt='logo'
                style={{ height: '60px', width: '100%', resize: 'cover', objectFit: 'cover' }} />
            </button>
          </div>
          <Button
            sx={{ textTransform: 'none' }}
            className='flex flex-row justify-canter items-center gap-4 mt-4'
            variant='contained'
            style={{
              borderRadius: 5, width: '100%', display: 'flex',
              backgroundColor: '#4011FA', height: '50px', fontWeight: '500', fontSize: 15, fontFamily: 'inter'
            }}
            onClick={() => {
              setUserChat([]);
              setActiveChat(null);
            }}>
            <img src='/assets/addIcon.png' alt='addIcon' style={{ height: '16px', width: '16px' }} />
            <p style={{ textTransform: 'none', fontWeight: '500', fontSize: 15, fontFamily: 'inter' }}>
              New Project
            </p>
          </Button>
        </div>

        <div className='w-11/12' style={{ marginTop: 15, overflow: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <Button
            sx={{ textTransform: 'none' }}
            onClick={handleProjectClick}
            style={{
              color: openProjects ? '#2548FD' : '#ffffff60', fontWeight: '500',
              fontSize: 12, fontFamily: 'inter', backgroundColor: openProjects ? '#2548FD30' : ''
            }}>
            My Projects
          </Button>

          <div style={{ maxHeight: '40vh', overflow: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {
              myProjects.map((item) => (
                <div key={item.id} className='w-full flex flex-row items-center mt-6 p-3' style={{ backgroundColor: '#ffffff20', borderRadius: 3 }}>
                  <div className='w-8/12'>
                    {item.projectName ? item.projectName : "App Name"}
                  </div>
                  <div className='w-4/12 flex justify-end'>
                    <button onClick={() => handleEditProject(item.chat.id)}>
                      <img src='/assets/edit.png' alt='edit' style={{ height: '28px', width: '28px', resize: 'cover', objectFit: 'cover' }} />
                    </button>
                  </div>
                </div>
              ))
            }
          </div>

          {/* {chatHistory.map((chat, index) => (
            <Button
              sx={{ textTransform: 'none' }}
              key={index}
              variant='contained'
              style={{
                borderRadius: 5, width: '100%', margin: '5px 0', textTransform: 'none',
                fontWeight: '500', fontSize: 15, fontFamily: 'inter'
              }}
              onClick={() => handleChatSelect(index)}
            >
              {chat[0].content}
            </Button>
          ))} */}
        </div>

        <div className='flex flex-col items-start w-full p-1'>
          <Button onClick={handleSettingClick} sx={{ textTransform: 'none' }}
            style={{
              fontWeight: '500', fontSize: 12, fontFamily: 'inter',
              color: openSetting ? '#2548FD' : '#ffffff60', backgroundColor: openSetting ? '#2548FD30' : ''
            }}>
            Settings
          </Button>
          <Button onClick={handleTeamClick} sx={{ textTransform: 'none' }}
            style={{ fontWeight: '500', fontSize: 15, fontFamily: 'inter', color: openTeam ? '#2548FD' : '#ffffff', backgroundColor: openTeam ? '#2548FD30' : '' }}>
            My Team
          </Button>
          <Button onClick={handlePlanClick} sx={{ textTransform: 'none' }}
            style={{ fontWeight: '500', fontSize: 15, fontFamily: 'inter', color: openPlan ? '#2548FD' : '#ffffff', backgroundColor: openPlan ? '#2548FD30' : '' }}>
            Plans
          </Button>
        </div>

        {/* Code for modals of side menu */}
        {/* Support modal */}
        <div>
          <div>
            <Modal
              open={openSupport}
              onClose={handleCloseEditProject}
            >
              <Box sx={referStyle}>
                <div className='text-white'>
                  <div className='w-full flex flex-row justify-end'>
                    <button onClick={handleCloseEditProject}>
                      <img src='/assets/cross2.png' alt='cross' style={{ height: '10px', width: '10px', resize: 'cover' }} />
                    </button>
                  </div>
                  <div style={{ fontWeight: '500', fontSize: 24, fontFamily: 'inter' }}>
                    Submit Ticket
                  </div>
                  <div className='mt-3 w-9/12' style={{ fontWeight: '400', fontSize: 12, fontFamily: 'inter' }}>
                    Lorem ipsum dolor sit amet consectetur. Et interdum duis lectus
                  </div>
                  <textarea
                    rows={6}
                    // value={appIdea}
                    // onChange={(e) => setAppIdea(e.target.value)}
                    className="mt-4 w-full"
                    style={{
                      outline: 'none', border: 'none', backgroundColor: '#00000000',
                      fontWeight: '400', fontSize: 13, resize: 'none', fontFamily: 'inter', borderBottom: '1px solid #ffffff60'
                    }}
                    placeholder="Type here" />
                  <Button className='mt-4' sx={{ textTransform: 'none' }}
                    style={{ backgroundColor: '#2548FD', fontWeight: '400', fontFamily: 'inter', color: '#ffffff' }}>
                    Submit
                  </Button>
                  <div className='flex flex-row items-center mt-6'>
                    <div style={{ fontWeight: '400', fontSize: 12, fontFamily: 'init', color: '#ffffff' }}>
                      Need one one help?
                    </div>
                    <div>
                      <Button sx={{ textTransform: 'none' }}
                        style={{ fontWeight: '400', fontSize: 12, fontFamily: 'init', color: '#2548FD' }}>
                        Get dev support
                      </Button>
                    </div>
                  </div>
                </div>
              </Box>
            </Modal>
          </div>
        </div>

        {/* Refer modal */}
        <div>
          <div>
            <Modal
              open={openRef}
              onClose={handleCloseEditProject}
            >
              <Box sx={referStyle2}>
                <div className='text-white'>
                  <div className='flex flex-row justify-between'>
                    <img src='/assets/logo4.png' alt='logo2'
                      style={{ height: '354px', width: '354px', resize: 'cover' }} />
                    <div className='pe-4 pt-3'>
                      <button onClick={handleCloseEditProject}>
                        <img src='/assets/cross2.png' alt='cross' style={{ height: '10px', width: '10px', resize: 'cover' }} />
                      </button>
                    </div>
                  </div>
                  <div className='p-3' style={{ fontWeight: '500', fontSize: 24, fontFamily: 'inter' }}>
                    Refer a founder and get 40%
                  </div>
                  <div className='mt-3 w-9/12 p-3' style={{ fontWeight: '400', fontSize: 12, fontFamily: 'inter' }}>
                    Lorem ipsum dolor sit amet consectetur. Et interdum duis lectus
                  </div>
                  <div className='p-3'>
                    <Button sx={{ textTransform: 'none' }}
                      className='mt-8 px-3 p-2' style={{ backgroundColor: '#2548FD', fontSize: 12, fontWeight: '400', fontFamily: 'inter', color: '#ffffff' }}>
                      Copy Link
                    </Button>
                  </div>
                </div>
              </Box>
            </Modal>
          </div>
        </div>

        {/* Support modal */}
        <div>
          <div>
            <Modal
              open={openProfile}
              onClose={handleCloseEditProject}
            >
              <Box sx={referStyle}>
                <div className='text-white'>
                  <div className='w-full flex flex-row justify-end'>
                    <button onClick={handleCloseEditProject}>
                      <img src='/assets/cross2.png' alt='cross' style={{ height: '10px', width: '10px', resize: 'cover' }} />
                    </button>
                  </div>
                  {/*<div className='w-full flex mt-3 items-center justify-center'>
                    <button>
                      <img src='/assets/profile1.png' alt='profile' style={{ height: '131px', width: '131px', resize: 'cover' }} />
                      <div className='w-11/12 flex justify-end' style={{ position: 'relative', top: -30 }}>
                        <img src='/assets/camera.png' alt='cam' style={{ height: '24px', width: '24px', resize: 'cover' }} />
                      </div>
                    </button>
                  </div>*/}
                  <div className='w-full flex mt-3 items-center justify-center'>
                    <button>
                      {selectedImage ? <img src={selectedImage} alt="Preview" style={{ height: '131px', width: '131px', resize: 'cover', objectFit: 'cover', borderRadius: '50%' }} /> :
                        <img src='/assets/profile1.jpeg' alt="Preview" style={{ height: '131px', width: '131px', resize: 'cover', borderRadius: '50%' }} />}
                      <ImagePicker onFile={handleFileSelect} />
                    </button>
                  </div>
                  {/*<ImagePicker onFile={handleFileSelect} />*/}
                  <input
                    // rows={6}
                    // value={appIdea}
                    // onChange={(e) => setAppIdea(e.target.value)}
                    className="mt-8 w-full"
                    style={{
                      outline: 'none', border: 'none', backgroundColor: '#00000000', height: '40px',
                      fontWeight: '400', fontSize: 13, resize: 'none', fontFamily: 'inter',
                      borderBottom: '1px solid #ffffff'
                    }}
                    placeholder="Enter Email" />
                  <div className='w-full flex justify-center mt-14'>
                    <Button sx={{ textTransform: 'none' }}
                      className='mt-4 px-4 py-3' style={{ backgroundColor: '#2548FD', fontWeight: '400', fontFamily: 'inter', color: '#ffffff' }}>
                      Save Changes
                    </Button>
                  </div>
                </div>
              </Box>
            </Modal>
          </div>
        </div>

        {/* side menu modals ends here */}

        <div className='w-2/12' style={{ position: 'absolute', bottom: 0, padding: 10 }}>
          <div className='flex mt-4'>
            <Button sx={{ textTransform: 'none' }}
              onClick={handleOpenRefer}
              style={{ fontWeight: '500', fontSize: 13, fontFamily: 'inter', color: 'white' }}>
              Refer
            </Button>
          </div>
          <div className='flex mt-3'>
            <Button sx={{ textTransform: 'none' }}
              onClick={handleOpenSupport}
              style={{ fontWeight: '500', fontSize: 13, fontFamily: 'inter', color: 'white' }}>
              Support
            </Button>
          </div>
          <div className='flex mt-3'>
            <Button sx={{ textTransform: 'none' }}
              style={{ fontWeight: '500', fontSize: 13, fontFamily: 'inter', color: 'white' }}>
              Feedback
            </Button>
          </div>
          <div className='flex flex-row mt-3 gap-3 items-center w-full'>
            <button onClick={handleOpenProfile} className='flex flex-row mt-3 gap-3 items-center w-full'>
              {selectedImage ? <img
                className='w-2/12'
                src={selectedImage} alt='Profile'
                style={{ height: '33px', width: '33px', resize: 'cover', objectFit: 'cover', borderRadius: '50%' }} /> :
                <img
                  className='w-2/12'
                  src='/assets/profile1.jpeg' alt='Profile'
                  style={{ height: '33px', width: '33px', resize: 'cover', objectFit: 'cover', borderRadius: '50%' }} />}
              <div className='w-8/12 text-start' style={{ fontWeight: '500', fontSize: 12, fontFamily: 'inter' }}>
                hamza@gmail.com
              </div>
              <div className='w-1/12' style={{}}>
                <img src='/assets/nextIcon.png' alt='nextarrow' style={{ height: '10', width: '13px' }} />
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className='w-10/12 flex flex-col'>
        <div className='flex w-full' style={{ display: 'flex', justifyContent: 'center', borderBottom: '1px solid #555555' }}>
          {
            openProjects &&
            <div className='w-11/12 mb-2'>
              <div className='flex flex-row items-center justify-between w-3/12 mt-8'>
                <div className='flex flex-row gap-2 items-center'>
                  {
                    SelectedLogo ?
                      <img src={SelectedLogo} alt='Applogo' style={{ height: '45px', width: '45px', resize: 'cover' }} /> :
                      <img src='/assets/applogo.png' alt='Applogo' style={{ height: '45px', width: '45px', objectFit: 'cover', resize: 'cover' }} />
                  }
                  <div style={{ fontWeight: '500', fontSize: 15, fontFamily: 'inter' }}>
                    {appName ?
                      <div style={{ fontWeight: '500', fontSize: 15, fontFamily: 'inter' }}>
                        {appName}
                      </div> :
                      <div>
                        App Name
                      </div>}
                  </div>
                </div>
                <div className='flex flex-row gap-2 items-center'>
                  <button onClick={handleOpenEditproject}>
                    <img src='/assets/edit.png' alt='edit' style={{ height: '24px', width: '24px', resize: 'cover', objectFit: 'cover' }} />
                  </button>
                  <button onClick={handleOpenShareproject}>
                    <img src='/assets/share.png' alt='edit' style={{ height: '24px', width: '24px', resize: 'cover', objectFit: 'cover' }} />
                  </button>
                </div>
              </div>
            </div>
          }
          {openPlan &&
            <div className='flex items-center w-11/12'
              style={{ height: '50px', fontSize: 20, fontWeight: '500', fontFamily: 'inter' }}>
              Subscription Plan
            </div>
          }
          {
            openSetting &&
            <div className='flex items-center w-11/12' style={{ height: '50px' }}>
              Settings
            </div>
          }
          {openTeam &&
            <div className='flex items-center w-11/12' style={{ height: '50px' }}>
              My Team
            </div>
          }
        </div>

        {
          openPlan &&
          <div className='flex justify-center w-full' style={{ height: '100vh', overflow: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <ChoosePlan />
          </div>
        }

        {
          openTeam &&
          <div className='w-full flex justify-center' style={{ height: '100vh' }}>
            <div className='w-11/12 mt-8 flex gap-6'>
              {
                teamProfiles ?
                  <Grid container spacing={2} style={{ height: 'fit-content', display: 'flex', alignItems: 'flex-start' }}>
                    {teamProfiles.map((item) => (
                      <Grid key={item.id} item xs={12} sm={6} md={4} lg={4} xl={3} style={{ height: 'fit-content' }}>
                        <div className='w-full gap-8 p-4 flex flex-row'
                          style={{ backgroundColor: '#ffffff20', borderRadius: 2, height: 'fit-content', width: '100%', maxWidth: '335px' }}>
                          <div>
                            <img src='/assets/profile1.png' alt='TM_Profile' style={{ height: '50px', width: '50px', objectFit: 'cover' }} />
                          </div>
                          <div>
                            <div style={{ fontSize: 15, fontWeight: '500', fontFamily: 'inter', color: '#ffffff' }}>
                              {item.name}
                            </div>
                            <div style={{ fontSize: 12, fontWeight: '500', fontFamily: 'inter', color: '#ffffff' }}>
                              {item.role}
                            </div>
                            <div style={{ fontSize: 12, fontWeight: '500', fontFamily: 'inter', color: '#ffffff60' }}>
                              Email:
                              <span style={{ fontSize: 12, fontWeight: '500', fontFamily: 'inter', color: '#ffffff', marginLeft: 3 }}>
                                {item.email}
                              </span>
                            </div>
                            {item.status === 'Accepted' && (
                              <div className='flex items-center justify-center mt-3'
                                style={{
                                  height: '35px', width: '96px', borderRadius: 1,
                                  backgroundColor: '#00EE7C07', color: '#00EE7C', fontWeight: '500', fontFamily: 'inter', fontSize: 12
                                }}>
                                Accepted
                              </div>
                            )}
                            {item.status === 'Pending' && (
                              <div className='flex items-center justify-center mt-3'
                                style={{
                                  height: '35px', width: '96px', borderRadius: 1,
                                  backgroundColor: '#FFB54707', color: '#FFB547', fontWeight: '500', fontFamily: 'inter', fontSize: 12
                                }}>
                                Pending
                              </div>
                            )}
                          </div>
                        </div>
                      </Grid>
                    ))}
                    <Grid item xs={12} sm={6} md={4} lg={4} xl={3} style={{ height: 'fit-content' }}>
                      <div className='w-full p-4 flex flex-col justify-center items-center'
                        style={{
                          backgroundColor: '#ffffff20', borderRadius: 2, height: '137px',
                          border: '1px dashed #ffffff60', width: '100%', maxWidth: '335px'
                        }}>
                        <div className='flex flex-row justify-center gap-2'>
                          <button
                            sx={{ textTransform: 'none' }}
                            onClick={handleOpenAddTeam}
                            className='flex items-center justify-center'
                            style={{ height: '30px', width: '30px', backgroundColor: '#2548FD', borderRadius: '50%' }}>
                            <img src='/assets/addIcon.png' alt='Add' style={{ height: '10px', width: '10px', objectFit: 'cover' }} />
                          </button>
                          <div style={{ fontSize: 12, fontWeight: '500', fontFamily: 'inter', color: '#ffffff', marginTop: 8 }}>
                            New Team Member
                          </div>
                        </div>
                      </div>
                    </Grid>
                  </Grid> :
                  <div className='text-white flex items-center justify-center w-full'>
                    <div className='lg:w-3/12 w-4/12 flex flex-col items-center p-4'>
                      <div style={{ width: '100%', height: '276px', backgroundColor: '#ffffff13' }} />
                      <div className='text-center mt-4'
                        style={{ fontWeight: '500', fontSize: 20, fontFamily: 'inter' }}>
                        Looks like you have no active team members
                      </div>
                      <Button className='rounded mt-6' sx={{ textTransform: 'none' }}
                        style={{
                          backgroundColor: '#4011FA', fontWeight: '500', fontSize: 15, fontFamily: 'inter', color: 'white',
                          height: '47px', width: '170px'
                        }}>
                        Create Invite
                      </Button>
                    </div>
                  </div>
              }
            </div>
          </div>
        }

        {/* Modal for sharing and editing project */}
        <div>
          <Modal
            open={open}
            onClose={handleCloseEditProject}
          >
            <Box sx={style}>
              <div className='w-full'>
                <button onClick={handleCloseEditProject} className='w-full flex flex-row justify-end'>
                  <img src='/assets/cross2.png' alt='cross' style={{ height: '10px', width: '10px', resize: 'cover' }} />
                </button>
                <div className='w-full flex mt-3 items-center justify-center'>
                  <div>
                    {SelectedLogo ? <img src={SelectedLogo} alt='profile' style={{ height: '124px', width: '129px', borderRadius: 5, resize: 'cover', objectFit: 'cover' }} /> :
                      <img src='/assets/applogo.png' alt='profile' style={{ height: '124px', width: '129px', borderRadius: 5, resize: 'cover' }} />}
                    <LogoPicker onFileSelect={handleLogoSelect} />
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <input
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    className="mt-8 w-10/12"
                    style={{
                      outline: 'none', border: 'none', backgroundColor: '#00000000',
                      fontWeight: '400', fontSize: 13, resize: 'none', fontFamily: 'inter', color: '#ffffff'
                    }}
                    placeholder="App Name" />
                  <div className='w-10/12' style={{ height: '1px', backgroundColor: '#ffffff', marginTop: 15 }} />
                </div>
                <div className='w-full flex flex-row justify-center mt-14 pb-4'>
                  <Button onClick={handleCloseEditProject} sx={{ textTransform: 'none' }}
                    style={{
                      height: '46px', width: '186px', backgroundColor: '#4011FA', fontWeight: '500',
                      fontSize: 15, color: 'white'
                    }}>
                    Save Changes
                  </Button>
                </div>
              </div>
            </Box>
          </Modal>
        </div>
        <div>
          <Modal
            open={openShareApp}
            onClose={handleCloseShareProject}
          >
            <Box sx={style}>
              <div className='w-full'>
                <button onClick={handleCloseShareProject} className='w-full flex flex-row justify-end pe-2'>
                  <img src='/assets/cross2.png' alt='cross' style={{ height: '10px', width: '10px', resize: 'cover' }} />
                </button>
                <div className='flex flex-col items-start'>
                  <img src='/assets/applogo.png' alt='applogo' style={{ height: '124px', width: '129px', borderRadius: 5, resize: 'cover' }} />
                </div>
                <div className='mt-4' style={{ fontWeight: '500', fontSize: 24, fontFamily: 'inter', color: 'white' }}>
                  Changes
                </div>
                <div style={{ fontSize: 12, fontWeight: '500', fontFamily: 'inter', color: '#ffffff60' }}>
                  I’m building <b style={{ color: 'white' }}>AirBnB</b>. Powered by Neo
                </div>
                <div className='w-full mt-8 pb-4'>
                  <Button onClick={handleCloseEditProject} sx={{ textTransform: 'none' }}
                    style={{
                      height: '35px', width: '97px', backgroundColor: '#2548FD', fontWeight: '400',
                      fontSize: 12, color: 'white'
                    }}>
                    Copy Link
                  </Button>
                </div>
              </div>
            </Box>
          </Modal>
        </div>

        {
          openProjects &&
          <div className='flex flex-row justify-center'>
            <div className='w-11/12 flex justify-center '
              style={{ height: '100vh', padding: 15, backgroundColor: '#ffffff10' }}>
              <div className='w-11/12'>
                <div className='flex justify-center'>
                  {
                    selectedProjectId ?
                      <div>
                        {
                          getMessagesLoader ?
                            <div className='mt-8'>
                              <CircularProgress size={50} />
                            </div> :
                            <div style={{ color: 'red' }}>
                              Hello
                            </div>
                        }
                      </div> :
                      <div className='flex justify-center'>
                        {userChat.length === 0 ? (
                          <div>
                            <p style={{ fontSize: 24, fontWeight: 'bolder', textAlign: 'center' }}>Webflow GPT</p>
                            <div className='flex justify-center' style={{ gap: 10, marginTop: 30 }}>
                              <div className='w-2/6'>
                                <p style={{ textAlign: 'center', fontWeight: '500' }}>Examples</p>
                                <Button variant='contained' className='rounded-lg w-full' sx={{ textTransform: 'none' }}
                                  style={{ padding: 7, border: '1px solid #ffffff40', marginTop: 10, backgroundColor: '#ffffff30', textAlign: 'center' }}>
                                  <p style={Suggestion}>How to learn Webflow to become expert?</p>
                                </Button>
                                <Button variant='contained' className='rounded-lg w-full' sx={{ textTransform: 'none' }}
                                  style={{ fontSize: 14, padding: 7, border: '1px solid #ffffff40', marginTop: 18, backgroundColor: '#ffffff30', textAlign: 'center' }}>
                                  <p style={Suggestion}>How to learn Figma to become expert?</p>
                                </Button>
                                <Button variant='contained' className='rounded-lg w-full' sx={{ textTransform: 'none' }}
                                  style={{ fontSize: 14, padding: 7, border: '1px solid #ffffff40', marginTop: 18, backgroundColor: '#ffffff30', textAlign: 'center' }}>
                                  <p style={Suggestion}>What does the French Webflow agency Digidop do?</p>
                                </Button>
                              </div>
                              <div className='w-2/6'>
                                <p style={{ textAlign: 'center', fontWeight: '500' }}>Capabilities</p>
                                <Button variant='contained' className='rounded-lg w-full' style={{ fontSize: 14, padding: 7, border: '1px solid #ffffff40', marginTop: 10, backgroundColor: '#ffffff30', textAlign: 'center' }}>
                                  <p style={Suggestion}>Give answers based on keyword with Webflow CMS</p>
                                </Button>
                                <Button variant='contained' className='rounded-lg w-full' style={{ fontSize: 14, padding: 7, border: '1px solid #ffffff40', marginTop: 18, backgroundColor: '#ffffff30', textAlign: 'center' }}>
                                  <p style={Suggestion}>Simulate a ChatGPT by Open AI answer</p>
                                </Button>
                                <Button variant='contained' className='rounded-lg w-full' style={{ fontSize: 14, padding: 7, border: '1px solid #ffffff40', marginTop: 18, backgroundColor: '#ffffff30', textAlign: 'center' }}>
                                  <p style={Suggestion}>How to learn Webflow to become expert?</p>
                                </Button>
                              </div>
                              <div className='w-2/6'>
                                <p style={{ textAlign: 'center', fontWeight: '500' }}>Limitations</p>
                                <Button variant='contained' className='rounded-lg w-full' style={{ fontSize: 14, padding: 7, border: '1px solid #ffffff40', marginTop: 10, backgroundColor: '#ffffff30', textAlign: 'center' }}>
                                  <p style={Suggestion}>How to learn Webflow to become expert?</p>
                                </Button>
                                <Button variant='contained' className='rounded-lg w-full' style={{ fontSize: 14, padding: 7, border: '1px solid #ffffff40', marginTop: 18, backgroundColor: '#ffffff30', textAlign: 'center' }}>
                                  <p style={Suggestion}>How to learn Webflow to become expert?</p>
                                </Button>
                                <Button variant='contained' className='rounded-lg w-full' style={{ fontSize: 14, padding: 7, border: '1px solid #ffffff40', marginTop: 18, backgroundColor: '#ffffff30', textAlign: 'center' }}>
                                  <p style={Suggestion}>How to learn Webflow to become expert?</p>
                                </Button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div style={{ width: '100%' }}>
                            <div style={{ overflow: 'auto', height: '80vh', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                              {userChat.map((chat, index) => (
                                <div key={index} style={{ gap: 20 }}>
                                  {
                                    chat.role === "user" ? (
                                      <div>
                                        <div className='flex flex-row w-full justify-end items-center gap-3'>
                                          <div className='px-4 py-3'
                                            style={{
                                              color: 'white', textAlign: 'end', width: 'fit-content',
                                              maxWidth: '60%', borderTopLeftRadius: 25, backgroundColor: '#ffffff40', borderTopRightRadius: 25,
                                              borderBottomLeftRadius: 25
                                            }}>
                                            {chat.content}
                                          </div>
                                          <div>
                                            <img src='/assets/profile1.jpeg' alt='user'
                                              style={{ height: '50px', width: '50px', resize: 'cover', borderRadius: '50%' }} />
                                          </div>
                                        </div>
                                      </div>
                                    ) :
                                      (
                                        <div>
                                          {getResponseView(chat.content)}
                                        </div>
                                      )
                                  }

                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                  }
                  <div className='flex rounded-xl w-5/12 flex-row justify-between'
                    style={{ position: 'absolute', bottom: 5, paddingLeft: 10, borderWidth: 1, borderRadius: '33px', backgroundColor: '#1D1B37' }}>
                    <div className='w-full flex flex-col items-center'>
                      <div className='text-white w-full items-start px-4 py-2'>
                        {selectedFile ?
                          <img src={previewURL} alt='Inputimg' className='rounded-md'
                            style={{ height: '50px', width: '50px', resize: 'cover', objectFit: 'cover' }} /> : ''
                        }
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                      />
                      <div className='flex flex-row gap-2 w-full pb-2'>
                        <button>
                          <img src='/assets/attachmentIcon.png' alt='attachfile' style={{ height: '20px', width: '20px', resize: 'cover' }} />
                        </button>
                        <button onClick={handleInputFileChange}>
                          <img src='/assets/imageIcon.png' alt='attachfile' style={{ height: '20px', width: '20px', resize: 'cover' }} />
                        </button>
                        <input
                          type='text'
                          placeholder='Message GPT'
                          value={message}
                          onChange={(e) => {
                            setMessage(e.target.value)
                            setUserChatMessage(e.target.value)
                          }}
                          onKeyDown={handleKeyDown}
                          className='rounded w-full'
                          style={{
                            backgroundColor: 'transparent', fontWeight: '500', fontSize: 12, fontFamily: 'inter',
                            color: 'white', paddingLeft: 10, outline: 'none', border: 'none'
                          }}
                        />
                        <div
                          style={{ textTransform: 'none', backgroundColor: '#00000000' }} disabled={loading}>
                          <div
                            className='flex items-center justify-center'
                            style={{ height: '34px', width: '34px', borderRadius: '50%' }}>
                            {loading ?
                              <div
                                className='flex items-center justify-center me-6'
                                style={{ height: '34px', width: '34px', borderRadius: '50%', backgroundColor: '#2548FD40' }}>
                                <Button variant='disabled' style={{ backgroundColor: '#00000000' }}>
                                  <img src='/assets/upIcon.png' alt='sendIcon' style={{ height: '13px', width: '10px', resize: 'cover' }} />
                                </Button>
                              </div> :
                              <div
                                className='flex items-center justify-center me-6'
                                style={{ height: '34px', width: '34px', borderRadius: '50%', backgroundColor: '#2548FD' }}>
                                <button onClick={handleSubmit}
                                  className='flex justify-center items-center'
                                  style={{ height: '34px', width: '34px' }}>
                                  <img src='/assets/upIcon.png' alt='sendIcon' style={{ height: '13px', width: '10px', resize: 'cover' }} />
                                </button>
                              </div>
                            }
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>

                </div>
              </div>
            </div>
          </div>
        }
      </div>

      {/* Code for adding team member */}

      <div>
        <Modal
          open={openAddTeam}
          onClose={handleCloseEditProject}
        >
          <Box sx={addTeamStyle}>
            <div>
              <div className='w-full flex flex-row justify-end'>
                <button onClick={handleCloseEditProject}>
                  <img src='/assets/cross2.png' alt='cross' style={{ height: '10px', width: '10px', resize: 'cover' }} />
                </button>
              </div>
              <div style={{ fontWeight: '500', fontSize: 24, fontFamily: 'inter', color: '#ffffff' }}>
                Add Team Member
              </div>
              <TextField id="standard-basic" label="Name" variant="standard"
                placeholder="Enter Name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                sx={{
                  width: '100%', // Change the width here
                  '& .MuiInputBase-root': {
                    color: 'white', // Change the text color here
                    fontWeight: '400',
                    fontSize: 13,
                    fontFamily: 'inter'
                  },
                  '& .MuiInput-underline:before': {
                    borderBottomColor: '#ffffff60', // Change the underline color here
                  },
                  '& .MuiInput-underline:hover:before': {
                    borderBottomColor: '#ffffff', // Change the underline color on hover here
                  },
                  '& .MuiInput-underline:after': {
                    borderBottomColor: '#ffffff', // Change the underline color on hover here
                  },
                  '& .MuiFormLabel-root': {
                    color: '#ffffff60', // Change the label color here
                  },
                  '& .MuiFormLabel-root.Mui-focused': {
                    color: '#ffffff', // Change the label color when focused
                  },
                  marginTop: 1
                }}
              />
              <TextField id="standard-basic" label="Role" variant="standard"
                placeholder="Role"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                sx={{
                  width: '100%', // Change the width here
                  '& .MuiInputBase-root': {
                    color: 'white', // Change the text color here
                    fontWeight: '400',
                    fontSize: 13,
                    fontFamily: 'inter'
                  },
                  '& .MuiInput-underline:before': {
                    borderBottomColor: '#ffffff60', // Change the underline color here
                  },
                  '& .MuiInput-underline:hover:before': {
                    borderBottomColor: '#ffffff', // Change the underline color on hover here
                  },
                  '& .MuiInput-underline:after': {
                    borderBottomColor: '#ffffff', // Change the underline color on hover here
                  },
                  '& .MuiFormLabel-root': {
                    color: '#ffffff60', // Change the label color here
                  },
                  '& .MuiFormLabel-root.Mui-focused': {
                    color: '#ffffff', // Change the label color when focused
                  },
                  marginTop: 2
                }}
              />
              <TextField id="standard-basic" label="Email" variant="standard"
                placeholder="Enter Email"
                value={role}
                onChange={(e) => {
                  setRole(e.target.value);
                }}
                sx={{
                  width: '100%', // Change the width here
                  '& .MuiInputBase-root': {
                    color: 'white', // Change the text color here
                    fontWeight: '400',
                    fontSize: 13,
                    fontFamily: 'inter'
                  },
                  '& .MuiInput-underline:before': {
                    borderBottomColor: '#ffffff ', // Change the underline color here
                  },
                  '& .MuiInput-underline:hover:before': {
                    borderBottomColor: '#ffffff60', // Change the underline color on hover here
                  },
                  '& .MuiInput-underline:after': {
                    borderBottomColor: '#ffffff', // Change the underline color on hover here
                  },
                  '& .MuiFormLabel-root': {
                    color: '#ffffff60', // Change the label color here
                  },
                  '& .MuiFormLabel-root.Mui-focused': {
                    color: '#ffffff', // Change the label color when focused
                  },
                  marginTop: 2
                }}
              />
              <Button onClick={handleAddTeam} className='mt-4' sx={{ textTransform: 'none' }}
                style={{ backgroundColor: '#2548FD', fontWeight: '400', fontFamily: 'inter', color: '#ffffff' }}>
                Add
              </Button>
            </div>
          </Box>
        </Modal>
      </div>

    </div>
  );
};

export default Page;
