'use client'
import { Button, CircularProgress, Grid, TextField } from '@mui/material';
import { motion, useAnimation } from 'framer-motion';
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
import { useRouter } from 'next/navigation';
import styles from '../Home.module.css';
import Link from 'next/link';

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












    const router = useRouter();
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
    const [myProjectsLoader, setMyProjectsLoader] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const [getMessagesLoader, setGetMessagesLoader] = useState(false);
    const [showImgInput, setShowInputImg] = useState(false);
    const [addTeamLoader, setAddTeamLoader] = useState(false);
    const [addTeamError, setAddTeamError] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [loadTeamLoader, setLoadTeamLoader] = useState(false);
    const [showAcceptBtn, setShowAcceptBtn] = useState(false);
    const [teamProfiles, setTeamProfiles] = useState([]);
    const [copied, setCopied] = useState(false);
    const [boatReplyLoader, setBotReplyLoader] = useState(false);
    const chatContainerRef = useRef(null);
    const [projectDetails, setProjectDetails] = useState(null);
    const [pUpdateLoader, setPUpdateLoader] = useState(false);
    const [active, setActive] = useState(0);
    const controls = [useAnimation(), useAnimation(), useAnimation()];
    const [subscribePlanPopup, setSubscribePlanPopup] = useState(false);
    const [projDet, showProjDet] = useState(false);
    const [updatedData, setUpdatedData] = useState(null);
    const [localImg, setImage] = useState(null);



    useEffect(() => {
        fetchGetMessagesApi()
    }, [])

    const fetchGetMessagesApi = async () => {
        const NewProject = localStorage.getItem('NewProject');
        if (NewProject) {
            const projectChatId = JSON.parse(NewProject);
            console.log('New project id from local storage for get messages api is :', projectChatId.data.chat.id);
            const ID = projectChatId.data.chat.id;
            const LSD = localStorage.getItem('User');
            const localStorageData = JSON.parse(LSD);
            const AuthToken = localStorageData.data.token;
            const ApiPath = Apis.GetMessages; // 'http://localhost:8005/api/chat/get_messages'
            const Data = {
                chatId: ID
            }
            const response = await axios.get(`${ApiPath}?chatId=${ID}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${AuthToken}`
                }
            });
            if (response.status === 200) {
                setUserChat(response.data.data);
                console.log("Chat history is:", response.data)
            } else {
                console.error('Error fetching chat data:', response);
            }
        }
    }



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
            console.log('New project id from local storage is :', projectChatId.data.chat.id);
            setChatId(projectChatId.data.chat.id);
            showProjDet(true);
        } else {
            showProjDet(false);
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


    const callOpenAIAPI = async (messages) => {
        const LSD = localStorage.getItem('User');
        const localStorageData = JSON.parse(LSD);
        console.log('Data from localstorage is :', localStorageData);
        const AuthToken = localStorageData.data.token;

        const urlToFile = async (url, filename, mimeType) => {
            const res = await axios.get(url, { responseType: 'blob' });
            const blob = res.data;
            return new File([blob], filename, { type: mimeType });
        };

        const formData = new FormData();
        formData.append('chatId', chatId);
        formData.append('content', UserChatMessage);

        // Convert the image URL to a File object and append it to the form data
        if (previewURL) {
            console.log('Imagr sending in');
            const file = await urlToFile(previewURL, 'image.png', 'image/png');
            formData.append('media', file);
        }

        console.log('form Data sending in api is', formData);

        try {
            setBotReplyLoader(true);
            const ApiPath = Apis.SendMessage;
            // const data = {
            //   chatId: chatId,
            //   content: UserChatMessage,
            // };
            // console.log('Data sending in api is', data);
            const response = await axios.post(ApiPath, formData, {
                headers: {
                    'Authorization': 'Bearer ' + AuthToken,
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                const Result = response.data;
                console.log('response of api is', Result);
                return Result.data[1].content;
                // setPreviewURL(null)
            } else {
                console.log('Response is not ok :', response);
            }
        } catch (error) {
            console.error('Error calling OpenAI API:', error);
            return "Sorry, I can't respond right now.";
        } finally {
            // setPreviewURL(null);
            setBotReplyLoader(false);
        }
    };

    //test code for popup


    const handleSubmit = async (e) => {
        setMessage('');
        if (previewURL) {
            localStorage.setItem('Image', JSON.stringify(previewURL));
        }
        const FileSelected = localStorage.getItem('Image')
        if (FileSelected) {
            // setImage()
            const LocalImg = JSON.parse(FileSelected);
            setImage(LocalImg);
            // console.log('Localimage is', LocalImg);
        }
        // setSelectedFile(null);
        const LSD = localStorage.getItem('User');
        const localStorageData = JSON.parse(LSD);
        // console.log('Data from localstorage is :', localStorageData.data.user.message);
        // const AuthToken = localStorageData.data.token;

        setSelectedFile(null);

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
                if (Data.data.user.message > 5) {
                    setSubscribePlanPopup(true);
                }
            } else {
                setSubscribePlanPopup(false);
            }
        }

        e.preventDefault();
        setLoading(true);
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        };


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

    //code for selecting previous chat
    const handleChatSelect = (index) => {
        setActiveChat(index);
        setUserChat(chatHistory[index]);
    };

    function getResponseView(text) {
        let separatedContent = separateTextAndCode(text)

        return (
            <div className='flex mt-8 mb-8' style={{ width: "80%" }}>
                {/* <div>
          <img src='/assets/logo.png' alt='bot'
            style={{ height: '30px', width: '30px', resize: 'cover', objectFit: 'cover' }} />
        </div> */}
                <div className='px-2 py-2'
                    style={{
                        borderTopLeftRadius: 25, backgroundColor: '#ffffff00', borderTopRightRadius: 25,
                        borderBottomRightRadius: 25,
                    }}>
                    {separatedContent.map((part, index) => (
                        <div key={index}>
                            {part.type === 'code' ? (
                                // <pre><code>{part.value}</code></pre>
                                <div className='w-full' style={{
                                    backgroundColor: "#ffffff40", paddingLeft: 1, paddingRight: 1, paddingBottom: 1, borderTop: 15,
                                    flexDirection: 'column',

                                }}>
                                    <div className='w-full flex items-end justify-end' style={{ backgroundColor: 'grey' }}>
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
                                                    <div className='flex flex-row gap-2 items-center'>
                                                        <img src='/assets/copied.png' alt='copy' style={{ height: '30px', width: '30px', resize: 'cover', objectFit: 'cover' }} />
                                                        <p>Copy</p>
                                                    </div>
                                            }
                                        </button>
                                    </div>
                                    <SyntaxHighlighter language="javascript" style={vs2015}>
                                        {part.value}
                                    </SyntaxHighlighter>
                                </div>
                            ) : (
                                <div className='flex flex-row items-center gap-2' style={{ color: 'white' }}>
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

    const handleTeamClick = async () => {
        setOpenTeam(true);
        setOpenProjects(false);
        setOpenPlan(false);
        setOpenSetting(false);
        try {
            //Auth token from local storage add team loader
            const LSD = localStorage.getItem('User');
            const localStorageData = JSON.parse(LSD);
            const AuthToken = localStorageData.data.token;
            // console.log('Auth token is', AuthToken);
            setLoadTeamLoader(true);
            const response = await axios.get(Apis.GetTeamMembers, {
                headers: {
                    'Authorization': 'Bearer ' + AuthToken
                }
            });
            if (response) {
                console.log('Response of get team members api is :', response);
            }
            if (response.status === 200) {
                setTeamProfiles(response.data.data);
            } else {
                console.log("Status is not ok");
            }
        } catch (error) {
            console.error("Error occured in api is :", error);
        } finally {
            setLoadTeamLoader(false);
        }

        //code for showing and hiding accept and decline button

        // const LSD = localStorage.getItem('User');
        // const localStorageData = JSON.parse(LSD);
        // console.log('Data2 from localstorage for add btn is :', localStorageData);
        // const toUser2 = localStorageData.data.user.email;
        // console.log('email to match is:',toUser2);
        // // const toUserId = teamProfiles.toUser.id;
        // // console.log('Id getting is:', teamProfiles[0].toUser.id);
        // teamProfiles.forEach(element => {
        //   if (element.fromuser.email !== toUser2) {
        //     console.log('Email id of user and sender user donot matches');
        //   }else{
        //     console.log('Log matches');
        //   }
        // });

    }

    useEffect(() => {
        const LSD = localStorage.getItem('User');
        const localStorageData = JSON.parse(LSD);
        // console.log('Data2 from localstorage for match email is :', localStorageData);
        const toUser2 = localStorageData.data.user.id;
        // console.log('email to match is:', toUser2);
        // const toUserId = teamProfiles.toUser.id;
        // console.log('Id getting is:', teamProfiles[0].toUser.id);
        teamProfiles.forEach(element => {
            if (element.toUser.id == toUser2) {
                console.log('Id of user and ined user matches');
                setShowAcceptBtn(true);
            } else {
                console.log('id donot match');
            }
        });
    }, [handleTeamClick])

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
    }

    const handleUpdateEditProject = async () => {

        try {
            setPUpdateLoader(true);
            const ApiPath = Apis.UpdateProject;
            const LD = localStorage.getItem('User');
            const LocalData = JSON.parse(LD);
            const AuthToken = LocalData.data.token;
            const formData = new FormData();
            formData.append("projectId", chatId);
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
            if (response) {
                console.log("UpdateProject Api Response is", response);
            }
            if (response.status === 200) {
                const PData = response.data.data;
                localStorage.setItem('ProjectDetails', JSON.stringify(PData));
                console.log('Data updated', PData);
                const D = localStorage.getItem('NewProject');
                const LocalD = JSON.parse(D);
                if (LocalD) {
                    const updatedProjName = PData.projectName;
                    LocalD.data.projectName = updatedProjName;
                    localStorage.setItem('NewProject', JSON.stringify(LocalD))
                }
                setUpdatedData(PData);
                setOpen(false);
                setOpenRefer(false);
                setOpenAddTeam(false);
                setOpenSupport(false);
                setOpenProfile(false);
            }
        } catch (error) {
            console.log("Error occured in update project api :", error);
        } finally {
            setPUpdateLoader(false);
        }

    };

    useEffect(() => {
        const L = localStorage.getItem('NewProject');
        if (L) {
            const D = JSON.parse(L);
            setProjectDetails(D.data);
            console.log('Data recieved is', D);
        }
    }, []);

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

    const style2 = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        // bgcolor: 'background.paper',
        // border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
        backgroundColor: '#0F0C2D'
    };

    const handleAddTeam = async (e) => {
        if (name && email && role) {

            //api call for adding team member

            try {
                setAddTeamLoader(true)
                const AddMember = {
                    toUserEmail: email,
                    name: name,
                    role: role,
                }

                //Auth token from local storage add team loader
                const LSD = localStorage.getItem('User');
                const localStorageData = JSON.parse(LSD);
                // console.log('Data2 from localstorage for add team is :', localStorageData);
                const AuthToken = localStorageData.data.token;
                // console.log('Auth token is', AuthToken);

                const response = await axios.post(Apis.AddTeamMember, AddMember, {
                    headers: {
                        'Authorization': 'Bearer ' + AuthToken,
                        'Content-Type': 'application/json'
                    }
                });

                if (response) {
                    console.log('Response of add team member is :', response);
                }

                // e.preventDefault();
                // const newMember = {
                //   id: teamProfiles.length + 1,
                //   name,
                //   email,
                //   role,
                //   status: 'Pending'
                // }
                // setTeamProfiles([...teamProfiles, newMember]);
                setName('');
                setEmail('');
                setRole('');
            } catch (error) {
                console.error("Error occured in api call is :", error);
            } finally {
                setOpenAddTeam(false);
                setAddTeamLoader(false);
            }

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

    const [openEditProject, setOpenEditProject] = useState(false);
    const handleEditProject = async (item) => {
        setOpenEditProject(true);
        // console.log('Project id is', item);
        // setSelectedProjectId(item);
        // try {
        //   setGetMessagesLoader(true);
        //   const ApiPath = Apis.GetMessages;
        //   const LSD = localStorage.getItem('User');
        //   const localStorageData = JSON.parse(LSD);
        //   console.log('Data2 from localstorage for edit project is :', localStorageData);
        //   const AuthToken = localStorageData.data.token;
        //   console.log('Auth token is', AuthToken);

        //   const response = await axios.get(ApiPath + `?chatId=${item}`,
        //     {
        //       headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': 'Bearer ' + AuthToken
        //       }
        //       // body: JSON.stringify({ chatId: item })
        //     }
        //   );
        //   if (response) {
        //     console.log('Response is :', response);
        //   }
        //   if (response.status === 200) {
        //     let data = response.data;
        //     console.log("Data is ", data)
        //     let messages = data.data
        //     setUserChat(messages)
        //     console.log("Chat is ", messages)
        //   } else {
        //     console.log('Response is not ok :', response);
        //   }
        // } catch (error) {
        //   console.error('Error occured in api is :', error);
        // } finally {
        //   setGetMessagesLoader(false);
        // }
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
        <div className='text-white' style={{ display: 'flex', backgroundColor: '#050221' }}>


            <div className='w-full flex flex-col'>
                <div className='flex w-full items-center' style={{ display: 'flex', justifyContent: 'center', borderBottom: '1px solid #555555' }}>
                    <div className='w-full px-4 flex flex-row items-center justify-center'>
                        <div className='w-6/12 '>
                            {
                                openProjects &&
                                <div className='w-full mb-2'>
                                    {
                                        projDet ?
                                            <div className='flex flex-row items-center gap-12 mt-4'>
                                                <div className='flex flex-row gap-2 items-center'>
                                                    {/*
                                                        SelectedLogo ?
                                                            <img src={projectDetails.projectImage} alt='Applogo' style={{ height: '45px', width: '45px', resize: 'cover' }} /> :
                                                            <img src='/assets/applogo.png' alt='Applogo' style={{ height: '45px', width: '45px', objectFit: 'cover', resize: 'cover' }} />
                                    */}
                                                    <img src='/assets/applogo.png' alt='Applogo'
                                                        style={{ height: '45px', width: '45px', objectFit: 'cover', resize: 'cover' }}
                                                    />
                                                    <div style={{ fontWeight: '500', fontSize: 15, fontFamily: 'inter' }}>
                                                        {updatedData ?
                                                            <div style={{ fontWeight: '500', fontSize: 15, fontFamily: 'inter' }}>
                                                                {updatedData.projectName}
                                                            </div> :
                                                            <div style={{ fontWeight: '500', fontSize: 15, fontFamily: 'inter' }}>
                                                                {projectDetails.projectName}
                                                            </div>
                                                        }
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
                                            </div> : ""
                                    }
                                </div>
                            }
                        </div>
                        <div className='w-6/12 flex justify-end py-2'>
                            <button>
                                <img src='/assets/notification.png' alt='notify' style={{ height: "18px", width: "20px", resize: 'cover', objectFit: 'contain' }} />
                            </button>
                        </div>
                    </div>
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
                                                                {item.toUserEmail}
                                                            </span>
                                                        </div>
                                                        {item.status === 'accepted' ?
                                                            <div className='flex items-center justify-center mt-3'
                                                                style={{
                                                                    height: '35px', width: '96px', borderRadius: 1,
                                                                    backgroundColor: '#00EE7C07', color: '#00EE7C', fontWeight: '500', fontFamily: 'inter', fontSize: 12
                                                                }}>
                                                                Accepted
                                                            </div> :
                                                            <div>
                                                                {
                                                                    showAcceptBtn ?
                                                                        <div className='flex flex-row justify-between w-full'>
                                                                            <Button className='flex items-center justify-center mt-3'
                                                                                style={{
                                                                                    height: '35px', width: '96px', borderRadius: 5,
                                                                                    backgroundColor: '#00EE7C07', color: '#00EE7C', fontWeight: '500', fontFamily: 'inter', fontSize: 12
                                                                                }}>
                                                                                Accept
                                                                            </Button>
                                                                            <Button className='flex items-center justify-center mt-3'
                                                                                style={{
                                                                                    height: '35px', width: '96px', borderRadius: 1,
                                                                                    backgroundColor: '#D4474050', color: '#D44740', fontWeight: '500', fontFamily: 'inter', fontSize: 12
                                                                                }}>
                                                                                Decline
                                                                            </Button>
                                                                        </div> :
                                                                        <div>
                                                                            {item.status === 'pending' && (
                                                                                <div className='flex items-center justify-center mt-3'
                                                                                    style={{
                                                                                        height: '35px', width: '96px', borderRadius: 1,
                                                                                        backgroundColor: '#FFB54707', color: '#FFB547', fontWeight: '500', fontFamily: 'inter', fontSize: 12
                                                                                    }}>
                                                                                    Pending
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                }
                                                            </div>
                                                        }

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
                                    <Button onClick={handleUpdateEditProject} sx={{ textTransform: 'none' }}
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

                {/* {
                    openSetting &&
                    <div style={{ height: '100vh' }}>
                        Settings screen
                    </div>
                } */}

                {
                    openEditProject && (
                        <div className='flex flex-row justify-center'>
                            <div className='w-11/12 flex justify-center '
                                style={{ height: '100vh', padding: 15, backgroundColor: '#ffffff10' }}>
                                <div className='w-11/12'>
                                    <div className='w-full flex justify-center'>
                                        {/* replace with the component */}
                                        <div className='flex justify-center w-full'>
                                            edit project here
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }

                {
                    openProjects &&
                    <div className='flex flex-row justify-center'>
                        <div className='w-11/12 flex justify-center '
                            style={{ height: '95vh', padding: 15, backgroundColor: '#ffffff10' }}>
                            <div className='w-11/12'>
                                <div className='w-full flex justify-center'>
                                    {/* replace with the component */}
                                    <div className='flex justify-center w-full'>
                                        {userChat.length === 0 ? (
                                            <div className='w-full'>
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
                                                <div style={{ overflow: 'auto', height: '75vh', scrollbarWidth: 'none', msOverflowStyle: 'none' }} ref={chatContainerRef}>
                                                    {userChat.map((chat, index) => (
                                                        <div key={index} style={{ gap: 20 }}>
                                                            {
                                                                chat.role === "user" ? (
                                                                    <div>
                                                                        <div className='flex flex-col w-full justify-end items-end gap-2'>
                                                                            {/* <div>
                                                                                {
                                                                                    localImg ?
                                                                                        <div>
                                                                                            <img src={localImg} style={{ height: 50, width: 50, resize: 'cover', objectFit: 'cover' }} />
                                                                                        </div> : ""
                                                                                }
                                                                            </div> */}
                                                                            {
                                                                                chat.imageThumb ?
                                                                                    <div>
                                                                                        <img src={chat.imageThumb} style={{ height: 50, width: 50, resize: 'cover', objectFit: 'cover' }} />
                                                                                    </div> : ""
                                                                            }
                                                                            <div className='px-2 py-2'
                                                                                style={{
                                                                                    color: 'white', textAlign: 'end', width: 'fit-content',
                                                                                    maxWidth: '60%', borderTopLeftRadius: 20, backgroundColor: '#ffffff20', borderTopRightRadius: 20,
                                                                                    borderBottomLeftRadius: 20
                                                                                }}>
                                                                                {chat.content}
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
                                            </div>
                                        )}
                                    </div>

                                    <div className='flex rounded-xl w-7/12 flex-row justify-between'
                                        style={{ position: 'absolute', bottom: 0, paddingLeft: 10, borderWidth: 1, borderRadius: '33px', backgroundColor: '#1D1B37' }}>
                                        <div className='w-full flex flex-col items-center'>
                                            <div className='text-white w-full items-start px-4 py-2'>
                                                {selectedFile ?
                                                    <div style={{ width: "fit-content" }}>
                                                        <div className='flex flex-row justify-end w-full'
                                                            style={{ position: "absolute", top: 9, marginLeft: 5, left: 0 }}>
                                                            <div className='flex items-center justify-center'
                                                                style={{ height: "20px", width: "20px", borderRadius: "50%", backgroundColor: "#ffffff20" }}>
                                                                <button onClick={() => setSelectedFile(null)}>
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
                                {
                                    addTeamLoader ?
                                        <CircularProgress size={30} /> :
                                        "Add"
                                }
                            </Button>
                        </div>
                    </Box>
                </Modal>
            </div>

            {/* Code for subscribe plan modal */}

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
                            <div className='pb-2'>
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
