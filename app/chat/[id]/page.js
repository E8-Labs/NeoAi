// pages/chat/[id].js
'use client'
import imageCompression from 'browser-image-compression';
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
import Image from 'next/image';

function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}


const Page = () => {
  const fileInputRef = useRef(null);
  const { id, data } = useParams();
  const router = useRouter();
  // const id = 1
  // const data = router.query; // Access the dynamic route parameter
  const [projectData, setProjectData] = useState(null);
  // //console.log("Dta ", id)
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileShow, setSelectedFileShow] = useState(false);
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
  const [testLoader, setTestLoader] = useState(false);
  const [active, setActive] = useState(0);
  const controls = [useAnimation(), useAnimation(), useAnimation()];
  const [subscribePlanPopup, setSubscribePlanPopup] = useState(false);
  const [getProfileData, setGetProfileData] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [rows, setRows] = useState(1);

  const [scrollHeight, setScrollHeight] = useState(0)
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true)
  const previousScrollHeight = usePrevious(scrollHeight);


  const handleOpenEditproject = () => setOpen(true);
  const handleCloseEditProject = () => setOpen(false);
  const handleOpenShareproject = () => setOpenShareApp(true);
  const handleCloseShareProject = () => setOpenShareApp(false);


  const handleInputChange = (e) => {
    const textareaLineHeight = 24; // Adjust this value to match the line-height of your textarea
    const maxRows = 5;
    const previousRows = e.target.rows;
    e.target.rows = 1; // Reset number of rows in textarea 

    const currentRows = Math.min(Math.floor(e.target.scrollHeight / textareaLineHeight), maxRows);

    if (currentRows === previousRows) {
      e.target.rows = currentRows;
    }

    setUserChatMessage(e.target.value);
    setRows(currentRows);
  };

  //code for showing subscribeplan popup
  useEffect(() => {
    const Test = localStorage.getItem('User');

    if (Test) {
      const Data = JSON.parse(Test);
      console.log('Test data', Data.data.user.message);

      if (Data.data.user.plan === null && Data.data.user.message === 3) {
        console.log("test should work");
        // setSubscribePlanPopup(true);
      } else {
        setSubscribePlanPopup(false);
      }
    } else {
      console.log("no data");
    }
  }, []);

  // const handleKeyDownInputMsg = (e) => {
  //   if (e.key === 'Enter' && !e.shiftKey) {
  //     e.preventDefault();
  //     // Handle the message submit action here, like sending the message
  //     // //console.log('Message submitted:', userChatMsg);
  //     setRows(1);
  //   } 
  //   else
  //     if (e.key === 'Enter') {
  //       setUserChatMessage('');
  //       handleSubmit();
  //       setRows(1);
  //     }
  // };

  const handleKeyDownInputMsg = (e) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        setRows(1)
        // Allow the default behavior for Shift+Enter (adding a new line)
        return;
      } else {
        e.preventDefault();
        handleSubmit();
        setRows(1)
      }
    }
  };

  useEffect(() => {
    getProfileResponse()
  }, []);

  const getProfileResponse = async () => {
    const ApiPath = Apis.GetProfile;
    const LD = localStorage.getItem('User');
    const LocalData = JSON.parse(LD);
    const AuthToken = LocalData.data.token;
    const response = await axios.get(ApiPath, {
      headers: {
        'Authorization': 'Bearer ' + AuthToken,
        'Content-Type': 'multipart/form-data',
      }
    });
    try {
      if (response.status === 200) {
        //console.log('Profiledata', response.data.data);
        if (response.data.data.profileImage) {
          setGetProfileData(response.data.data)
        }
        else if (response.data.data.name) {
          const reduceName = (name) => {
            if (name.length) {
              return name.slice(0, 1).toUpperCase()
            }
          }
          const userName = response.data.data.name;
          setUserEmail(reduceName(userName));
        }
        else {
          const reduceemail = (email) => {
            if (email.length) {
              return email.slice(0, 1).toUpperCase()
            }
          }
          const userEmail = response.data.data.email;
          setUserEmail(reduceemail(userEmail));
        }
      }
    } catch (error) {
      //console.log('Error occured in profile api', error);

    }
  }

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
    //console.log('Selected logo file:', file);
  };

  const handleInputFileChange = () => {
    fileInputRef.current.click();
  };

  const urlToFile = async (url, filename, mimeType) => {
    const res = await axios.get(url, { responseType: 'blob' });
    const blob = res.data;
    return new File([blob], filename, { type: mimeType });
  };

  const [sendImgMsg, setSendImg] = useState(null);
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    setSelectedFileShow(true);
    setSelectedFile(file);

    if (file) {
      try {
        // Compress the image
        const options = {
          maxSizeMB: 1, // Target size in MB
          maxWidthOrHeight: 1920, // Resize dimensions
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(file, options);

        const reader = new FileReader();
        reader.onloadend = async () => {
          const previewURL = reader.result;
          setPreviewURL(previewURL);

          if (previewURL) {
            const fileConverted = await urlToFile(previewURL, 'image.png', 'image/png');
            // const formData = new FormData();
            // formData.append('media', fileConverted);

            console.log("File converted is", fileConverted);
            setSendImg(fileConverted);
            // Make your API call here using formData
          }
        };

        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error('Error compressing the file:', error);
      }
    }

    // const reader = new FileReader();
    // reader.onloadend = () => {
    //   const previewURL = reader.result;
    //   // //console.log("Image url is :", previewURL);
    //   setPreviewURL(previewURL);
    //   // onFile({ file, previewURL }); // Callback to parent component
    // };

    // if (file) {
    //   reader.readAsDataURL(file);
    // }
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
      
      if (SelectedLogo) {
        //console.log('Imagr sending in');
        const file = await urlToFile(SelectedLogo, 'image.png', 'image/png');
        formData.append('media', file);
      }
      //console.log('Data for update project', formData);

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
        //console.log("UpdateProject Api Response is", PData);
        localStorage.setItem('projectDetails', JSON.stringify(PData));
        const event = new CustomEvent('apiSuccess', { detail: 'Api call was successfull' });
        document.dispatchEvent(event);
        setOpen(false);
        if (PData) {
          setAppName(PData.projectName)
        } else if (projectData) {
          setAppName(projectData.projectName)
        }
        // window.location.reload();
      }
    } catch (error) {
      //console.log("Error occured in update project api :", error);
    } finally {
      setPUpdateLoader(false);
    }


  };

  // const getProjectDetails = async () => {
  //   const LD = localStorage.getItem('projectDetails');
  //   const LocalData = await JSON.parse(LD);
  //   setProjectData(LocalData);
  //   //console.log('Project  name is', LocalData.projectName);
  // }

  // useEffect(() => {
  //   getProjectDetails();
  // }, [])

  // useEffect(() => {
  //   //console.log('Data of project details is :', projectData);
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
      //console.log("Data recieved from local of project details is", storedData);
      setProjectData(JSON.parse(storedData));
    }
  }, []);

  useEffect(() => {
    if (projectData !== null) {
      //console.log('Data is not null:', projectData);
    } else {
      //console.log('data is not found');
    }
  }, [projectData]);

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


  const handleSubmit = async () => {
    // //console.log('test working');
    setShouldScrollToBottom(false)
    setUserChatMessage("");
    setSelectedFileShow(false);
    const LSD = localStorage.getItem('User');
    const localStorageData = JSON.parse(LSD);
    //console.log('Data from localstorage is :', localStorageData.data.user.message);
    const AuthToken = localStorageData.data.token;

    if (localStorageData) {
      const prevMsg = localStorageData.data.user.message;
      const msg = prevMsg + 1;
      localStorageData.data.user.message = msg;
      localStorage.setItem('User', JSON.stringify(localStorageData));
    }

    const Test = localStorage.getItem('User');
    const Data = JSON.parse(Test);
    //console.log('Test data', Data.data.user);

    if (Test) {
      if (Data.data.user.plan === null) {
        if (Data.data.user.message === 3) {
          // setSubscribePlanPopup(true)
        }
      } else {
        setSubscribePlanPopup(false);
      }
    }

    // getProfile();

    const newChat = { role: 'user', content: userChatMsg, senderType: 'user', imageThumb: selectedFile };
    const updatedChat = [...chat, newChat];
    setChat(updatedChat);
    setLoading(true);

    setTimeout(async () => {
      if (chatContainerRef.current) {
        setScrollHeight(chatContainerRef.current.scrollHeight)
        // chatContainerRef.current.scrollTo({
        //   top: chatContainerRef.current.scrollHeight,
        //   behavior: 'smooth'
        // });
      };

      // //console.log('User chat msg is', userChatMsg);

      const formData = new FormData();
      formData.append('chatId', id);
      formData.append('content', userChatMsg);
      formData.append('media', sendImgMsg)

      // Convert the image URL to a File object and append it to the form data
      

      // return


      try {
        const response = await axios.post(Apis.SendMessage, formData, {
          headers: {
            'Authorization': 'Bearer ' + AuthToken,
            'Content-Type': 'multipart/form-data',
          },
          timeout: 120000
        });

        if (response.status === 200) {
          const Result = response.data.data;
          //console.log('Response of API is', Result);

          // Update the chat state by removing the last message and appending the response messages
          setChat((prevChat) => {
            // Remove the last message (user's message)
            const updatedItems = prevChat.slice(0, -1);
            // Append the response messages
            return [...updatedItems, ...Result];
          });
        } else {
          //console.log('Response is not ok:', response);
        }
      } catch (error) {
        console.error('Error calling API:', error);
        return "Sorry, I can't respond right now.";
      } finally {
        setLoading(false);
      }
    }, 1000);


  };



  const determineTextType = (text) => {
    if (/^####\s/.test(text)) {
      return 'heading4';
    }
    else if (/^###\s/.test(text)) {
      return 'heading3';
    } else if (/^##\s/.test(text)) {
      return 'heading2';
    } else if (/^#\s/.test(text)) {
      return 'heading1';
    } else if (/^-\s/.test(text)) {
      return 'bullet';
    } else if (/^\d+\.\s/.test(text)) {
      return 'numbered';
    } else if (/•\s/.test(text)) {
      return 'dot';
    } else if (/\(https?:\/\/.*\.(?:png|jpg|jpeg|gif)\)/.test(text)) {
      return 'image';
    } else {
      return 'simpleText';
    }
  };

  const RenderText = ({ text }) => {
    const textType = determineTextType(text);
    // //console.log(`Text ${text} is of ${textType}`)
    switch (textType) {
      case 'heading1':
        return <h1>{text.replace(/^#\s/, '')}</h1>;
      case 'heading2':
        return <h2>{text.replace(/^##\s/, '')}</h2>;
      case 'heading3':
        return <h3>{text.replace(/^###\s/, '')}</h3>;
      case 'heading4':
        return <h2 className='text-xl font-bold'>{text.replace(/^####\s/, '')}</h2>;
      case 'bullet':
        return <li>{formatText(text.replace(/^-/, ''))}</li>;
      case 'numbered':
        return <li>{formatText(text.replace(/^\d+\.\s/, ''))}</li>;
      case 'dot':
        return <li>{formatText(text.replace(/^•\s/, ''))}</li>;
      case 'image':
        const imageUrl = text.match(/\((https?:\/\/.*\.(?:png|jpg|jpeg|gif))\)/)[1];
        return <img src={imageUrl} alt="image" style={{ maxWidth: '100%', margin: '20px 0' }} />;
      case 'simpleText':
        // Check for bold text patterns
        return <p>{formatText(text)}</p>;
      case 'code':
        return <pre><code>{text}</code></pre>;
      default:
        return <p>{text}</p>;
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


  const formatText = (text) => {
    const parts = text.split(/\*\*(.*?)\*\*/).map((part, index) =>
      index % 2 === 1 ? <strong key={index}>{part}</strong> : part
    );

    return parts.map((part, index) => {
      if (typeof part === 'string') {
        const imageParts = part.split(/(!\[icon\]\((https?:\/\/.*\.(?:png|jpg|jpeg|gif))\))/g);
        return imageParts.map((imagePart, imageIndex) => {
          if (imagePart.startsWith('http')) {
            return <img key={`img-${index}-${imageIndex}`} src={imagePart} alt="icon" style={{ width: '30vw', margin: '0 5px' }} />;
          } else {
            return imagePart;
          }
        });
      } else {
        return part;
      }
    });
  };

  const separateTextAndCode = (input) => {
    const regex = /(```.*?```)/gs;
    const parts = input.split(regex);

    return parts.map(part => {
      if (part.startsWith('```') && part.endsWith('```')) {
        let code = part.slice(3, -3).trim();

        // Remove any file type name that might be after the opening triple backticks
        const firstLine = code.split('\n')[0].trim();
        if (['jsx', 'javascript', 'js', 'ts', 'tsx'].includes(firstLine)) {
          code = code.split('\n').slice(1).join('\n').trim();
        }

        return {
          type: 'code',
          value: code,
        };
      } else {
        return {
          type: 'string',
          value: part.trim(),
        };
      }
    });
  };



  const handleCopy = async (index, value) => {
    await navigator.clipboard.writeText(value);
    setCopied(index);
    setTimeout(() => {
      setCopied(null);
    }, 2000);
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
      <div className='flex flex-row mt-8 mb-8' style={{ width: "80%" }}>
        <div className='py-4 pl-1' style={{ backgroundColor: 'transparent' }}>
          <img src='/assets/logo.png' alt='bot' className=''
            style={{ height: '30px', width: '30px', resize: 'cover', borderRadius: '50%', objectFit: 'cover', backgroundColor: 'green', }} />
        </div>
        <div className='flex  flex-col px-1 py-2 ms-2'
          style={{
            borderTopLeftRadius: 25, backgroundColor: 'transparent', borderTopRightRadius: 25,
            borderBottomRightRadius: 25, width: '90%'
          }}>
          {separatedContent.map((part, index) => (
            <div style={{ backdropColor: 'yellow' }} key={index}>
              {part.type === 'code' ? (
                // <pre><code>{part.value}</code></pre>
                <div className='' style={{
                  backgroundColor: "#ffffff40", paddingLeft: 1, paddingRight: 1, paddingBottom: 1, borderTop: 15,
                  flexDirection: 'column',

                }}>
                  <div className='w-full flex items-end justify-end' style={{ backgroundColor: 'white' }}>
                    <button style={{ paddingRight: 2 }} onClick={() => handleCopy(index, part.value)}>
                      {
                        copied === index ?
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
    // console.log("Scroll height changed", scrollHeight)
    console.log("Scroll height changed", scrollHeight);
    console.log("Previous scroll height", previousScrollHeight);
    console.log("Should scroll to bottom ", shouldScrollToBottom)
    chatContainerRef.current.scrollTo({
      top: shouldScrollToBottom ? scrollHeight : previousScrollHeight,
      behavior: 'smooth'
    });

  }, [scrollHeight])

  useEffect(() => {
    // console.log("Chat data chanved ")
    if (chatContainerRef.current) {
      setScrollHeight(chatContainerRef.current.scrollHeight)
      // //console.log("chatContainerRef is not null")
      // chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
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


  return (
    <div className='w-full flex  flex-col justify-center' style={{ height: '100vh' }}>
      <div className='text-white' style={{ borderBottom: '1px solid grey' }}>
        <div className='mb-2 px-4 flex flex-row justify-between items-center'>
          <div className='flex flex-row items-center gap-12 mt-4' style={{ width: "fit-content" }}>
            <div className='flex flex-row gap-2 items-center text-white'>

              {/* {projectData ?
                <img src={projectData.projectImage} alt='Applogo' style={{ height: '45px', width: '45px', resize: 'cover' }} /> :
                <img src='/assets/applogo.png' alt='Applogo' style={{ height: '45px', width: '45px', objectFit: 'cover', resize: 'cover' }} />
              } */}
              {/* <img src='/assets/applogo.png' alt='Applogo' style={{ height: '45px', width: '45px', objectFit: 'cover', resize: 'cover' }} /> */}
              {/* <div style={{ fontWeight: '500', fontSize: 15, fontFamily: 'inter' }}>
                {
                  updatedData ?
                    <div>
                      <img src={updatedData.projectImage} alt='Applogo' style={{ height: '45px', width: '45px', objectFit: 'cover', resize: 'cover' }} />
                    </div> :
                    <div>
                      {
                        projectData ?
                          <img src={projectData.projectImage} alt='Applogo' style={{ height: '45px', width: '45px', objectFit: 'cover', resize: 'cover' }} /> :
                          <img src='/assets/applogo.png' alt='logo' style={{ height: '45px', width: '45px', objectFit: 'cover', resize: 'cover' }} />
                      }
                    </div>
                }
              </div> */}
              <div>
                <img
                  src={
                    updatedData
                      ? updatedData.projectImage
                      : projectData && projectData.projectImage
                        ? projectData.projectImage
                        : '/assets/applogo.png'
                  }
                  alt='Applogo'
                  style={{ height: '45px', width: '45px', objectFit: 'cover', resize: 'cover' }}
                />
              </div>

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
        <div className='w-9/12' style={{ backgroundColor: '#ffffff10', height: "92vh" }}>

          <div className='w-full flex flex-col items-center' style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div className='w-full' style={{ overflow: 'auto', height: '80vh', scrollbarWidth: 'none', msOverflowStyle: 'none', }} ref={chatContainerRef}>
              {chat.map((message, index) => (
                <div key={index}>
                  {
                    message.senderType === 'user' ?
                      <div className='flex flex-col items-end justify-end w-full pe-4 mt-8 gap-2'>
                        {
                          message.imageThumb ? (
                            <Image
                              src={message.imageThumb}
                              height={70}
                              width={70}
                              unoptimized
                            />
                          ) : ""
                        }

                        <div className='flex flex-row justify-end w-full pe-4 gap-2' style={{ width: "70%" }}>
                          <div className='px-2 py-2'
                            style={{
                              color: 'white', textAlign: 'start',
                              borderTopLeftRadius: 20, backgroundColor: '#ffffff20', borderTopRightRadius: 20,
                              borderBottomLeftRadius: 20, maxWidth: "90%"
                            }}>
                            {message.content}
                          </div>
                          {
                            getProfileData && getProfileData.profile_image ?
                              <div>
                                <img src={getProfileData.profile_image} style={{ height: '30px', width: '30px', resize: 'cover', borderRadius: '50%', objectFit: 'cover', backgroundColor: 'green', }} />
                              </div> :
                              <div className='flex items-center justify-center'
                                style={{
                                  height: '40px', width: '40px', borderRadius: "50%",
                                  backgroundColor: "#4011FA", color: "white", fontWeight: "500", fontSize: 20
                                }}>
                                {userEmail}
                              </div>
                          }
                        </div>
                      </div> :
                      (
                        <div style={{ maxWidth: "80%" }}>
                          {getResponseView(message.content)}
                        </div>
                      )
                  }
                </div>
              ))}


              {loading &&
                <div className='flex flex-row ms-2'>
                  {controls.map((control, index) => (
                    <div key={control.id}>
                      <div>
                        <motion.div
                          key={index}
                          animate={control}
                          initial={{ opacity: 0.2 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          style={{ height: '20px', width: "20px", borderRadius: "50%", backgroundColor: "grey", display: "flex", flexDirection: "row" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>}


            </div>

            <div className='flex rounded-xl w-7/12 flex-row justify-between'
              style={{ position: 'absolute', bottom: 0, paddingLeft: 10, marginBottom: 30, borderWidth: 1, borderRadius: '33px', backgroundColor: '#1D1B37' }}>
              <div className='w-full flex flex-col items-center'>
                <div className='text-white w-full items-start px-4 py-1'>
                  {selectedFileShow ?
                    <div style={{ width: "fit-content" }}>
                      <div className='' style={{ position: "absolute", top: 9, marginLeft: 5 }}> {/*marginBottom: -22, paddingRight: 5, zIndex: 1, position: 'relative'*/}
                        <div className='flex items-center justify-center' style={{ height: "20px", width: "20px", borderRadius: "50%", backgroundColor: "#ffffff20" }}>
                          <button onClick={() => setSelectedFileShow(false)}>
                            <img src='/assets/cross2.png' alt='cross'
                              style={{ height: "10px", width: "10px", resize: "cover", objectFit: "cover" }}
                            />
                          </button>
                        </div>
                      </div>
                      <img src={previewURL} alt='Inputimg' className='rounded-md'
                        style={{ height: '77px', width: '107px', resize: 'cover', objectFit: 'cover' }} />
                    </div> : ''
                  }
                </div>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                <div className='flex flex-row gap-2 w-full pb-2 items-end'>
                  <button>
                    <img src='/assets/attachmentIcon.png' alt='attachfile' style={{ height: '30px', width: '30px', resize: 'cover' }} />
                  </button>
                  <button onClick={handleInputFileChange}>
                    <img src='/assets/imageIcon.png' alt='attachfile' style={{ height: '30px', width: '30px', resize: 'cover' }} />
                  </button>
                  <textarea
                    rows={rows}
                    placeholder='Message GPT'
                    value={userChatMsg}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDownInputMsg}
                    className='rounded w-full'
                    style={{
                      backgroundColor: 'transparent',
                      fontWeight: '500',
                      fontSize: 12,
                      fontFamily: 'inter',
                      color: 'white',
                      paddingLeft: 10,
                      paddingTop: 8,
                      paddingBottom: 4,
                      outline: 'none',
                      border: 'none',
                      resize: 'none',
                      overflowY: rows >= 5 ? 'auto' : 'hidden',
                      maxHeight: `${5 * 24}px`, // Limit the height to 5 rows
                      scrollbarWidth: 'none', msOverflowStyle: 'none',
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
                I am building <b style={{ color: 'white' }}>AirBnB</b>. Powered by Neo
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
