// pages/chat/[id].js
'use client'
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Apis from '@/public/Apis/Apis';
import vs2015 from 'react-syntax-highlighter/dist/esm/styles/hljs/vs2015';
import styles from '../../Home.module.css';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { Box, Button, CircularProgress, Drawer, Modal } from '@mui/material';
import LogoPicker from '@/public/ui/LogoPicker';
import Notifications from '@/public/assets/notifications/Notifications';
import { motion, useAnimation } from 'framer-motion';

const Page = () => {
  const fileInputRef = useRef(null);
  const { id, data } = useParams();
  const router = useRouter();
  // const id = 1
  // const data = router.query; // Access the dynamic route parameter
  const [projectData, setProjectData] = useState(null);
  // console.log("Dta ", id)
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [userChatMsg, setUserChatMessage] = useState("");
  const chatContainerRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [openShareApp, setOpenShareApp] = useState(false);
  const [copied, setCopied] = useState(false);
  // const [chatMessage, setChatMessage] = useState([]);
  const [pUpdateLoader, setPUpdateLoader] = useState(false);
  const [appName, setAppName] = useState("");
  const [SelectedLogo, setSelectedLogo] = useState(null);
  const [openSideNav, setOpenSideNav] = useState(false);
  const [updatedData, setUpdatedData] = useState(null);
  const [testLoader, setTestLoader] = useState(false)
  const [active, setActive] = useState(0);
  const controls = [useAnimation(), useAnimation(), useAnimation()];
  const [subscribePlanPopup, setSubscribePlanPopup] = useState(false);
  const [getProfileData, setGetProfileData] = useState(null);


  const handleOpenEditproject = () => setOpen(true);
  const handleCloseEditProject = () => setOpen(false);
  const handleOpenShareproject = () => setOpenShareApp(true);
  const handleCloseShareProject = () => setOpenShareApp(false);


  const handleCopyLink = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl)
      .then(() => {
        alert('Link copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  }

  const handleLogoSelect = (file) => {
    // Handle the selected file here (e.g., upload to server, display preview, etc.)
    setSelectedLogo(file.previewURL);
    console.log('Selected logo file:', file);
  };

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


  const handleUpdateEditProject = async () => {

    try {
      setPUpdateLoader(true);
      const ApiPath = Apis.UpdateProject;
      const LD = localStorage.getItem('User');
      const LocalData = JSON.parse(LD);
      const AuthToken = LocalData.data.token;
      const formData = new FormData();
      formData.append("projectId", id);
      formData.append("projectName", appName);
      const urlToFile = async (url, filename, mimeType) => {
        const res = await axios.get(url, { responseType: 'blob' });
        const blob = res.data;
        return new File([blob], filename, { type: mimeType });
      };
      if (SelectedLogo) {
        console.log('Imagr sending in');
        const file = await urlToFile(SelectedLogo, 'image.png', 'image/png');
        formData.append('media', file);
      }
      const response = await axios.post(ApiPath, formData, {
        headers: {
          'Authorization': 'Bearer ' + AuthToken,
          'Content-Type': 'multipart/form-data',
        }
      });
      // if (response) {
      // }
      if (response.status === 200) {
        const PData = response.data.data;
        setUpdatedData(PData);
        console.log("UpdateProject Api Response is", PData);
        localStorage.setItem('projectDetails', JSON.stringify(PData));
        const event = new CustomEvent('apiSuccess', { detail: 'Api call was successfull' });
        document.dispatchEvent(event);
        setOpen(false);
        // window.location.reload();
      }
    } catch (error) {
      console.log("Error occured in update project api :", error);
    } finally {
      setPUpdateLoader(false);
    }


  };

  // const getProjectDetails = async () => {
  //   const LD = localStorage.getItem('projectDetails');
  //   const LocalData = await JSON.parse(LD);
  //   setProjectData(LocalData);
  //   console.log('Project  name is', LocalData.projectName);
  // }

  // useEffect(() => {
  //   getProjectDetails();
  // }, [])

  // useEffect(() => {
  //   console.log('Data of project details is :', projectData);
  // }, [])

  const updatProj = () => {
    setPUpdateLoader(true);
    setTimeout(() => {
      handleUpdateEditProject();
      setAppName("");
    }, 2000);
  }

  useEffect(() => {
    const storedData = localStorage.getItem('projectDetails');
    if (storedData) {
      console.log("Data recieved from local of project details is", storedData);
      setProjectData(JSON.parse(storedData));
    }
  }, []);

  useEffect(() => {
    if (projectData !== null) {
      console.log('Data is not null:', projectData);
    } else {
      console.log('data is not found');
    }
  }, [projectData]);



  //code for calling send msg api
  // const handleSubmit = async () => {
  //   const newChat = { role: 'user', content: userChatMsg, senderType: 'user' };
  //   const updatedChat = [...chat, newChat];
  //   setChat(updatedChat)
  //   setTimeout(async()=> {
  //     setUserChatMessage("");
  //     if (chatContainerRef.current) {
  //       chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  //     };
  //     const LSD = localStorage.getItem('User');
  //     const localStorageData = JSON.parse(LSD);
  //     console.log('Data from localstorage is :', localStorageData);
  //     const AuthToken = localStorageData.data.token;

  //     const urlToFile = async (url, filename, mimeType) => {
  //       const res = await axios.get(url, { responseType: 'blob' });
  //       const blob = res.data;
  //       return new File([blob], filename, { type: mimeType });
  //     };

  //     const formData = new FormData();
  //     formData.append('chatId', id);
  //     formData.append('content', userChatMsg);

  //     // Convert the image URL to a File object and append it to the form data
  //     if (previewURL) {
  //       console.log('Imagr sending in');
  //       const file = await urlToFile(previewURL, 'image.png', 'image/png');
  //       formData.append('media', file);
  //     }

  //     console.log("Data sending in api is :", formData);

  //     try {
  //       const response = await axios.post(Apis.SendMessage, formData, {
  //         headers: {
  //           'Authorization': 'Bearer ' + AuthToken,
  //           'Content-Type': 'multipart/form-data',
  //         }
  //       });
  //       if (response.status === 200) {
  //         const Result = response.data.data;
  //         console.log('response of api is', Result);
  //         // const updatedItems = chat;
  //         // console.log("Previous chat is ", chat)
  //         // updatedItems.pop(); // Remove the last item
  //         // console.log("Previous chat after pop ", updatedItems)
  //         // let newArray = [...updatedItems, ...Result] // Add the new object
  //         // console.log(" chat after append ", newArray)
  //         // setChat(newArray)

  //         // setChat((prevChat) => [...prevChat, ...Result]);
  //         setChat((prevChat) => {
  //           const updatedItems = prevChat;
  //           console.log("Previous chat is ", prevChat)
  //           updatedItems.pop(); // Remove the last item
  //           console.log("Previous chat after pop ", updatedItems)
  //          let newArray = [...updatedItems, ...Result] // Add the new object
  //          console.log(" chat after append ", newArray)
  //           return newArray;
  //         });
  //       } else {
  //         console.log('Response is not ok :', response);
  //       }
  //     } catch (error) {
  //       console.error('Error calling OpenAI API:', error);
  //       return "Sorry, I can't respond right now.";
  //     }
  //     return () => {

  //     }
  //   }, 2000)


  // }

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

  const style2 = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    // bgcolor: 'background.paper',
    // border: '2px solid #000',
    boxShadow: 24,
    p: 2,
    borderRadius: 2,
    backgroundColor: '#0F0C2D'
  };


  const handleSubmit = async () => {
    // console.log('test working');
    setUserChatMessage("");
    const LSD = localStorage.getItem('User');
    const localStorageData = JSON.parse(LSD);
    console.log('Data from localstorage is :', localStorageData.data.user.message);
    const AuthToken = localStorageData.data.token;

    if (localStorageData) {
      const prevMsg = localStorageData.data.user.message;
      const msg = prevMsg + 1;
      localStorageData.data.user.message = msg;
      localStorage.setItem('User', JSON.stringify(localStorageData));
    }

    const Test = localStorage.getItem('User');
    const Data = JSON.parse(Test);
    console.log('Test data', Data.data.user);

    if (Test) {
      if (Data.data.user.plan === null) {
        if (Data.data.user.message > 1) {
          setSubscribePlanPopup(true)
        }
      } else {
        const newChat = { role: 'user', content: userChatMsg, senderType: 'user' };
        const updatedChat = [...chat, newChat];
        setChat(updatedChat);
        setLoading(true);

        setTimeout(async () => {
          if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
              top: chatContainerRef.current.scrollHeight,
              behavior: 'smooth'
            });
          };

          const urlToFile = async (url, filename, mimeType) => {
            const res = await axios.get(url, { responseType: 'blob' });
            const blob = res.data;
            return new File([blob], filename, { type: mimeType });
          };

          const formData = new FormData();
          formData.append('chatId', id);
          formData.append('content', userChatMsg);

          // Convert the image URL to a File object and append it to the form data
          if (previewURL) {
            console.log('Image sending in');
            const file = await urlToFile(previewURL, 'image.png', 'image/png');
            formData.append('media', file);
          }

          console.log("Data sending in api is :", formData);

          try {
            const response = await axios.post(Apis.SendMessage, formData, {
              headers: {
                'Authorization': 'Bearer ' + AuthToken,
                'Content-Type': 'multipart/form-data',
              }
            });

            if (response.status === 200) {
              const Result = response.data.data;
              console.log('Response of API is', Result);

              // Update the chat state by removing the last message and appending the response messages
              setChat((prevChat) => {
                // Remove the last message (user's message)
                const updatedItems = prevChat.slice(0, -1);
                // Append the response messages
                return [...updatedItems, ...Result];
              });
            } else {
              console.log('Response is not ok:', response);
            }
          } catch (error) {
            console.error('Error calling API:', error);
            return "Sorry, I can't respond right now.";
          } finally {
            setLoading(false);
          }
        }, 1000);
      }
    }

    // getProfile();

  };

  //code for getprofile
  // const getProfile = async () => {
  //   try {
  //     const L = localStorage.getItem('User');
  //     const LocalData = JSON.parse(L);
  //     const AuthToken = LocalData.data.token;
  //     const ApiPath = Apis.GetProfile;
  //     const response = await axios.get(ApiPath, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': 'Bearer ' + AuthToken
  //       }
  //     });
  //     if (response.status === 20) {
  //       const Result = response.data.data.messages;
  //       console.log('Response is', response.data.data);
  //       const PlanStatus = LocalData.data.user.plan;
  //       setGetProfileData(Result);
  //       // if(PlanStatus === null){
  //       //   if(Result > 2){
  //       //     setSubscribePlanPopup(true);
  //       //   }else{
  //       //     setSubscribePlanPopup(false);
  //       //   }
  //       // }else{
  //       //   setSubscribePlanPopup(false);
  //       // }
  //     }
  //   } catch (error) {
  //     console.error('error occured is', error);
  //   }
  // }

  // useEffect(() => {
  //   getProfile()
  // }, [handleSubmit])

  //code for code separation

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
  const determineTextType = (text) => {
    if (/^###\s/.test(text)) {
      return 'heading3';
    } else if (/^##\s/.test(text)) {
      return 'heading2';
    } else if (/^#\s/.test(text)) {
      return 'heading1';
    } else if (/^-\s/.test(text)) {
      return 'bullet';
    } else if (/^\d+\.\s/.test(text)) {
      return 'numbered';
    } else if (/^•\s/.test(text)) {
      return 'dot';
    } else {
      return 'simpleText';
    }
  };

  const formatInlineText = (text) => {
    const parts = text.split(/(\*{1,2}[^*]+\*{1,2})/);
    return parts.map((part, index) => {
      if (/^\*\*[^*]+\*\*$/.test(part)) {
        return <strong key={index}>{part.replace(/^\*\*(.*)\*\*$/, '$1')}</strong>;
      } else if (/^\*[^*]+\*$/.test(part)) {
        return <em key={index}>{part.replace(/^\*(.*)\*$/, '$1')}</em>;
      } else {
        return part;
      }
    });
  };

  const RenderText = ({ text }) => {
    // return <p className={styles.simpleText}>{text}</p>;
    const textType = determineTextType(text);

    switch (textType) {
      case 'heading1':
        return <h1 className={styles.heading1}>{formatInlineText(text.replace(/^#\s/, ''))}</h1>;
      case 'heading2':
        return <h2 className={styles.heading2}>{formatInlineText(text.replace(/^##\s/, ''))}</h2>;
      case 'heading3':
        return <h3 className={styles.heading3}>{formatInlineText(text.replace(/^###\s/, ''))}</h3>;
      case 'bullet':
        return <li className={styles.bullet}>{formatInlineText(text.replace(/^-/, ''))}</li>;
      case 'numbered':
        return <li className={styles.numbered}>{formatInlineText(text.replace(/^\d+\.\s/, ''))}</li>;
      case 'dot':
        return <li className={styles.dot}>{formatInlineText(text.replace(/^•\s/, ''))}</li>;
      default:
        return <p className={styles.simpleText}>{formatInlineText(text)}</p>;
    }
  };


  const ShowMessageTextBubble = (textContent) => {
    const textLines = textContent.trim().split('\n').filter(line => line.trim() !== '');
    return (<div style={{
      color: 'white', padding: 7,
      borderTopLeftRadius: 20, borderTopRightRadius: 20, borderBottomRightRadius: 20
    }}>{textLines.map((line, index) => (<RenderText key={index} text={line} />))} </div>);
  }
  function getResponseView(text) {
    // return <p className={styles.simpleText}>{formatInlineText(text)}</p>;
    let separatedContent = separateTextAndCode(text);

    // setTestLoader(true);

    return (
      <div className='flex mt-8 mb-8' style={{ width: "80%" }}>
        {/* <div>
      <img src='/assets/logo.png' alt='bot'
        style={{ height: '30px', width: '30px', resize: 'cover', objectFit: 'cover' }} />
    </div> */}
        <div className='px-2 py-2'
          style={{
            borderTopLeftRadius: 25, backgroundColor: '#ffffff00', borderTopRightRadius: 25,
            borderBottomRightRadius: 25, width: '55vw'
          }}>
          {separatedContent.map((part, index) => (
            <div key={index}>
              {part.type === 'code' ? (
                // <pre><code>{part.value}</code></pre>
                <div className='w-ful' style={{
                  backgroundColor: "#ffffff40", paddingLeft: 1, paddingRight: 1, paddingBottom: 1, borderTop: 15,
                  flexDirection: 'column',

                }}>
                  <div className='w-full flex items-end justify-end' style={{ backgroundColor: 'white' }}>
                    <button style={{ paddingRight: 2 }} onClick={async () => {
                      await navigator.clipboard.writeText(part.value);
                      setCopied(true);
                      setTimeout(() => {
                        setCopied(false);
                      }, 2000);
                    }}>
                      {
                        copied ?
                          <div>
                            Copied
                          </div> :
                          <div className='flex flex-row  items-center'>
                            <img src='/assets/copied.png' alt='copy' style={{ height: '30px', width: '30px', resize: 'cover', objectFit: 'cover' }} />
                            <p>Copy</p>
                          </div>
                      }
                    </button>
                  </div>
                  {/* <p>{part.value}</p> */}
                  <SyntaxHighlighter language="javascript" style={vs2015}>
                    {part.value}
                  </SyntaxHighlighter>
                </div>
              ) : (
                <div className='flex w-ful flex-row items-center gap-2' style={{ color: 'white' }}>
                  {
                    ShowMessageTextBubble(part.value)
                  }
                  {/* <p
                style={{
                  color: 'white', padding: 7,
                  borderTopLeftRadius: 20, borderTopRightRadius: 20, borderBottomRightRadius: 20
                }}>
                {part.value}
              </p> */}
                  {/* </div> */}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
    setTestLoader(false);
  }


  useEffect(() => {
    if (id) {
      fetchChatData(id);
    }
  }, [id]);


  useEffect(() => {
    console.log("Chat data chanved ")
    if (chatContainerRef.current) {
      console.log("chatContainerRef is not null")
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chat])

  const fetchChatData = async (chatId) => {
    try {
      // setLoading(true);
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
      // setLoading(false);
    }
  };


  if (!chat) {
    return <div>No chat found for ID {id}</div>;
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  //code for opening and closing drawer
  const openSideBar = () => {
    setOpenSideNav(true);
  }

  const closeSideNav = () => {
    setOpenSideNav(false);
  }



  //code for animation loader

  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setActive((prev) => (prev === 2 ? 0 : prev + 1));
      }, 300);
    } else {
      setActive(0);
    }

    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    controls.forEach((control, index) => {
      if (index === active) {
        control.start({
          opacity: 1,
          scale: 0.8
        });
      } else {
        control.start({
          opacity: 0.2,
          scale: 0.5
        });
      }
    });
  }, [active, controls]);

  return (
    <div className='w-full flex  flex-col justify-center' style={{ height: '100vh' }}>
      <div className='text-white' style={{ borderBottom: '1px solid grey' }}>
        <div className='mb-2 px-4 flex flex-row justify-between items-center'>
          <div className='flex flex-row items-center gap-12 mt-8' style={{ width: "fit-content" }}>
            <div className='flex flex-row gap-2 items-center text-white'>

              {/* {projectData ?
                <img src={projectData.projectImage} alt='Applogo' style={{ height: '45px', width: '45px', resize: 'cover' }} /> :
                <img src='/assets/applogo.png' alt='Applogo' style={{ height: '45px', width: '45px', objectFit: 'cover', resize: 'cover' }} />
              } */}
              <img src='/assets/applogo.png' alt='Applogo' style={{ height: '45px', width: '45px', objectFit: 'cover', resize: 'cover' }} />
              <div style={{ fontWeight: '500', fontSize: 15, fontFamily: 'inter' }}>
                {
                  updatedData ?
                    <div>
                      {updatedData ? updatedData.projectName : ""}
                    </div> :
                    <div>
                      {projectData ? projectData.projectName : ""}
                    </div>
                }
              </div>
            </div>
            <div className='flex flex-row gap-2 items-center'>
              <button
                onClick={handleOpenEditproject}
              >
                <img src='/assets/edit.png' alt='edit' style={{ height: '24px', width: '24px', resize: 'cover', objectFit: 'cover' }} />
              </button>
              <button
                onClick={handleOpenShareproject}
              >
                <img src='/assets/share.png' alt='edit' style={{ height: '24px', width: '24px', resize: 'cover', objectFit: 'cover' }} />
              </button>
            </div>
          </div>
          <button onClick={openSideBar}>
            <img src='/assets/notification.png' alt='notify' style={{ height: "18px", width: "20px", resize: 'cover', objectFit: 'contain' }} />
          </button>
        </div>
      </div>
      <div className='w-full flex justify-center'>
        <div className='w-9/12' style={{ backgroundColor: '#ffffff10', height: "85vh" }}>

          <div className='w-full flex flex-col items-center' style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div className='w-full' style={{ overflow: 'auto', height: '75vh', scrollbarWidth: 'none', msOverflowStyle: 'none', }} ref={chatContainerRef}>
              {chat.map((message, index) => (
                <div key={index}>
                  {
                    message.senderType === 'user' ?
                      <div className='flex justify-end w-full pe-4'>
                        <div className='px-2 py-2'
                          style={{
                            color: 'white', textAlign: 'end', width: 'fit-content',
                            maxWidth: '60%', borderTopLeftRadius: 20, backgroundColor: '#ffffff20', borderTopRightRadius: 20,
                            borderBottomLeftRadius: 20
                          }}>
                          {message.content}
                        </div>
                      </div> :
                      (
                        <div style={{ maxWidth: "60%" }}>
                          {getResponseView(message.content)}
                        </div>
                      )
                  }
                </div>
              ))}

              {
                loading &&
                <div className='flex flex-row ms-2'>
                  {controls.map((control, index) => (
                    <motion.div
                      key={index}
                      animate={control}
                      initial={{ opacity: 0.2 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      style={{ height: '20px', width: "20px", borderRadius: "50%", backgroundColor: "grey", display: "flex", flexDirection: "row" }}
                    />
                  ))}
                </div>
              }

            </div>

            <div className='flex rounded-xl w-7/12 flex-row justify-between'
              style={{ position: 'absolute', bottom: 0, paddingLeft: 10, marginBottom: 30, borderWidth: 1, borderRadius: '33px', backgroundColor: '#1D1B37' }}>
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
                    value={userChatMsg}
                    onChange={(e) => {
                      // setMessage(e.target.value)
                      setUserChatMessage(e.target.value);
                    }}
                    onKeyDown={handleKeyDown}
                    className='rounded w-full'
                    style={{
                      backgroundColor: 'transparent', fontWeight: '500', fontSize: 12, fontFamily: 'inter',
                      color: 'white', paddingLeft: 10, outline: 'none', border: 'none'
                    }}
                  />
                  <div
                    style={{ textTransform: 'none', backgroundColor: '#00000000' }}>
                    <div
                      className='flex items-center justify-center'
                      style={{ height: '34px', width: '34px', borderRadius: '50%' }}>
                      {loading ?
                        <div
                          className='flex items-center justify-center me-6'
                          style={{ height: '34px', width: '34px', borderRadius: '50%', backgroundColor: '#2548FD40' }}>
                          <button
                            // onClick={handleSubmit}
                            disabled
                            className='flex justify-center items-center'
                            style={{ height: '34px', width: '34px' }}>
                            <img src='/assets/upIcon.png' alt='sendIcon' style={{ height: '13px', width: '10px', resize: 'cover' }} />
                          </button>
                        </div> :
                        <div
                          className='flex items-center justify-center me-6'
                          style={{ height: '34px', width: '34px', borderRadius: '50%', backgroundColor: '#2548FD' }}>
                          <button
                            onClick={handleSubmit}
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
                <Button onClick={updatProj} sx={{ textTransform: 'none' }}
                  style={{
                    height: '46px', width: '186px', backgroundColor: '#4011FA', fontWeight: '500',
                    fontSize: 15, color: 'white'
                  }}>
                  {
                    pUpdateLoader ?
                      <CircularProgress size={30} /> :
                      "Save Changes"
                  }
                </Button>
              </div>
            </div>
          </Box>
        </Modal>

        <div className='w-full'>
          <Drawer open={openSideNav}
            onClose={() => setOpenSideNav(false)}
            anchor='right'
            sx={{ '& .MuiDrawer-paper': { width: '25%' } }}>
            <div className='pt-6 px-4 text-white' style={{ backgroundColor: "#0F0C2D", height: "100%" }}>
              <div>
                <Notifications closeNav={closeSideNav} />
              </div>
            </div>
          </Drawer>
        </div>

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
                I'm building <b style={{ color: 'white' }}>AirBnB</b>. Powered by Neo
              </div>
              <div className='w-full mt-8 pb-4'>
                <Button onClick={handleCopyLink} sx={{ textTransform: 'none' }}
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


      <div>
        <Modal
          open={subscribePlanPopup}
        // onClose={() => setSubscribePlanPopup(false)}
        >
          <Box sx={style2}>
            <div className='text-white flex flex-col items-center justify-center'>
              <img src='/assets/logo2.png' alt='logo' style={{ height: "184px", width: "184px", resize: "cover", objectFit: "conver" }} />
              <div style={{ fontWeight: "600", fontSize: 24, fontFamily: "inter", marginTop: 10 }}>
                UPGRADE TO A PLAN
              </div>
              <div>
                <button onClick={() => router.push('/chat/plans')} style={{ backgroundColor: "#2548FD", color: "white", marginTop: 10, padding: 8, borderRadius: 5 }}>
                  Upgrade
                </button>
              </div>
            </div>
          </Box>
        </Modal>
      </div>


    </div>
  );
};

export default Page;
