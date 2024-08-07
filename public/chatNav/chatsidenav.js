"use client"
import { Box, Button, CircularProgress, Link, Modal } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import ImagePicker from '@/public/ui/ImagePicker';
import Apis from '../Apis/Apis';
import GetProjects from './GetProjects';
import axios from 'axios';

const Chatsidenav = () => {
    const router = useRouter();
    const pathName = usePathname();

    const [myProjectsLoader, setMyprojectsLoader] = useState(false);
    const [myProjects, setMyProjects] = useState([]);
    const [openTeam, setOpenTeam] = useState(false);
    const [openPlan, setOpenPlan] = useState(false);
    const [openProjects, setOpenProjects] = useState(true);
    const [openSetting, setOpenSetting] = useState(false);
    const [openSupport, setOpenSupport] = useState(false);
    const [openRef, setOpenRefer] = useState(false);
    const [openProfile, setOpenProfile] = useState(false);
    const [openFeedback, setOpenFeedback] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [SelectedLogo, setSelectedLogo] = useState(null);
    const [openAddTeam, setOpenAddTeam] = useState(false);
    const [loadTeamLoader, setLoadTeamLoader] = useState(false);
    const [open, setOpen] = useState(false);
    const [updateLoader, setUpdateLoader] = useState(false);
    const [userProfiledata, setUserProfiledata] = useState("");
    const [userName, setUserName] = useState("");
    const [getProfileData, setProfileData] = useState(null);
    const [showProfileImg, setShowProfileImg] = useState(false);
    const [showProfileName, setShowProfileName] = useState(false);
    const [formattedEmail, setFormattedEmail] = useState('');
    const [separateLetters, setSeparateLetters] = useState('');

    const links1 = [
        {
            id: 1,
            name: 'Settings',
            href: '/chat/settings'
        },
        {
            id: 2,
            name: 'My Team',
            href: '/chat/team'
        },
        {
            id: 3,
            name: 'Plans',
            href: '/chat/plans'
        }
    ]

    //test code

    const handleCreateNewProject = () => {
        localStorage.removeItem('AppScreen');
        const FromScreen = "CahtScreen";
        localStorage.setItem('ChatScreen', JSON.stringify(FromScreen));
        router.push('/onboarding');
    }

    //code for image picker1
    const handleFileSelect = (file) => {




        // Handle the selected file here (e.g., upload to server, display preview, etc.)
        console.log('Selected file:', file);
        setSelectedImage(file.previewURL);
    };

    const handleInputFileChange = () => {
        fileInputRef.current.click();
    };

    const getUserProfile = async () => {
        const ApiPath = Apis.GetProfile;
        const Ls = localStorage.getItem('User');
        const LocalData = JSON.parse(Ls);
        const AuthToken = LocalData.data.token;
        const response = await axios.get(ApiPath, {
            headers: {
                'Authorization': 'Bearer ' + AuthToken,
                'Content-Type': 'multipart/form-data',
            }
        });
        if (response.status === 200) {
            console.log('Response of getprofile', response.data.data);
            setProfileData(response.data.data)

            if (response.data.data.name) {
                setShowProfileName(true);
            }
            if (response.data.data.profileImage) {
                setShowProfileImg(true)
            }
        }
    }

    useEffect(() => {
        getUserProfile()
    }, [])

    //code for update profile api
    const handleSaveChanges = async () => {

        try {
            setUpdateLoader(true);
            const ApiPath = Apis.UpdateProfile;
            const Ls = localStorage.getItem('User');
            const LocalData = JSON.parse(Ls);
            const AuthToken = LocalData.data.token;

            const formData = new FormData();
            formData.append('name', userName);

            const urlToFile = async (url, filename, mimeType) => {
                const res = await axios.get(url, { responseType: 'blob' });
                const blob = res.data;
                return new File([blob], filename, { type: mimeType });
            };
            if (selectedImage) {
                console.log('Imagr sending in');
                const file = await urlToFile(selectedImage, 'image.png', 'image/png');
                formData.append('media', file);
            };

            const response = await axios.post(ApiPath, formData, {
                headers: {
                    'Authorization': 'Bearer ' + AuthToken,
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (response) {
                console.log("Update profile api reponse:", response);
            }

            if (response.status === 200) {
                const Result = response.data.data;
                LocalData.data.user = Result
                console.log('Profile data updated', Result);
                setProfileData(Result);
                setShowProfileImg(true);
                setShowProfileName(true);

                localStorage.setItem('User', JSON.stringify(LocalData));
            } else {
                console.log('Profile not updated');
            }

            setOpen(false);
            setOpenRefer(false);
            setOpenAddTeam(false);
            setOpenSupport(false);
            setOpenProfile(false);
        } catch (error) {
            console.error('error in update profile api', error);
        } finally {
            setUpdateLoader(false)
        }
    }


    //code for closing modals
    const handleCloseEditProject = () => {
        setOpen(false);
        setOpenRefer(false);
        setOpenAddTeam(false);
        setOpenSupport(false);
        setOpenProfile(false);
    };




    const handleOpenRefer = () => setOpenRefer(true);
    const handleOpenSupport = () => setOpenSupport(true);
    const handleOpenProfile = () => setOpenProfile(true);
    const handleOpenAddTeam = () => setOpenAddTeam(true);
    const handleCloseShareProject = () => setOpenShareApp(false);





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
        width: 500,
        // height: 450,
        bgcolor: 'background.paper',
        // border: '2px solid #000',
        boxShadow: 24,
        px: 4,
        py: 3,
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

    //code for loging out the user
    const handleLogout = () => {
        localStorage.removeItem('User');
        router.push('/onboarding');
    }

    const dashboardPath = "/chat";

    //code for profiledata

    // const formatEmail = (email) => {
    //     if (email.length <= 10) {
    //         return email;
    //     }
    //     return email.slice(0, 10) + "...";
    // }

    useEffect(() => {
        const formatEmail = (email) => {
            if (email.length <= 15) {
                return email;
            }
            else if (email.length > 15) {
                return email.slice(0, 15) + "...";
            }
        };
        const reduceemail = (email) => {
            if (email.length) {
                return email.slice(0, 1).toUpperCase()
            }
        }
        const A = localStorage.getItem('User');
        const B = JSON.parse(A);
        const email = B.data.user.email;
        // setProfileData(B);
        if (email) {
            setFormattedEmail(formatEmail(email));
            setSeparateLetters(reduceemail(email));
        };

        if (B.data.user.name) {
            setUserName(B.data.user.name)
        }
    }, []);


    return (
        <div className='w-full flex flex-flex-col justify-center' style={{ backgroundColor: '#050221', height: '100%' }}>
            <div className='w-9/12'>
                <div className='flex justify-center mt-6 w-full'>
                    <button>
                        <img src='/assets/logo.png' alt='logo'
                            style={{ height: '60px', width: '100%', resize: 'cover', objectFit: 'cover' }} />
                    </button>
                </div>
                <Button
                    sx={{ textTransform: 'none' }}
                    className='flex flex-row items-center justify-center mt-4'
                    variant='contained'
                    style={{
                        borderRadius: 5, width: '100%', display: 'flex',
                        backgroundColor: '#4011FA', height: '50px', fontWeight: '500', fontSize: 15, fontFamily: 'inter',
                        gap: 8
                    }}
                    onClick={handleCreateNewProject}>
                    <img src='/assets/addIcon.png' alt='addIcon' style={{ height: '16px', width: '16px' }} />
                    <p style={{ textTransform: 'none', fontWeight: '500', fontSize: 15, fontFamily: 'inter' }}>
                        New Project
                    </p>
                </Button>
                <div className='mt-4'>
                    <Button
                        sx={{ textTransform: 'none' }}
                        style={{
                            fontWeight: '500',
                            fontSize: 12, fontFamily: 'inter', backgroundColor: pathName === dashboardPath ? "#ffffff70" : ""
                        }}>
                        <Link href={dashboardPath} sx={{ textDecoration: 'none' }}
                            style={{
                                color: pathName === dashboardPath ? '#ffffff' : '#ffffff60', fontWeight: '500',
                                fontSize: 12, fontFamily: 'inter'
                            }}
                            className='w-full'>
                            My Projects
                        </Link>
                    </Button>

                    {/* user projects */}
                    <GetProjects />
                </div>

                <div className='flex flex-col items-start w-full items-center'>
                    <div className='flex flex-col gap-3 items-start w-11/12'>
                        {/* <button onClick={handleSettingClick} sx={{ textTransform: 'none' }}
                            style={{
                                fontWeight: '500', fontSize: 12, fontFamily: 'inter',
                                color: openSetting ? '#2548FD' : '#ffffff60', backgroundColor: openSetting ? '' : ''
                            }}>
                            Settings
                        </button> */}

                        <div className='mt-'>
                            {
                                links1.map((link) => {
                                    return (
                                        <div key={link.id} className='mt-4'>
                                            <Link className='text-white' sx={{ textDecoration: 'none' }}
                                                key={link.name}
                                                href={link.href}
                                                style={{
                                                    fontWeight: '500', fontSize: 12, fontFamily: 'inter',
                                                    color: pathName === link.href ? '#ffffff' : '#ffffff60', backgroundColor: pathName === link.href ? '#ffffff60' : '',
                                                    padding: pathName === link.href ? 4 : "", borderRadius: 2
                                                }}> {/* 2548FD40 */}
                                                {link.name}
                                            </Link>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>

                <div className='w-full' style={{ paddingLeft: 5, position: 'absolute', bottom: 0 }}>
                    <div className='flex mt-4'>
                        <button sx={{ textTransform: 'none' }}
                            onClick={handleOpenRefer}
                            style={{ fontWeight: '500', fontSize: 13, fontFamily: 'inter', color: 'white' }}>
                            Refer
                        </button>
                    </div>
                    <div className='flex mt-3'>
                        <button sx={{ textTransform: 'none' }}
                            onClick={handleOpenSupport}
                            style={{ fontWeight: '500', fontSize: 13, fontFamily: 'inter', color: 'white' }}>
                            Support
                        </button>
                    </div>
                    <div className='flex mt-3'>
                        <button sx={{ textTransform: 'none' }}
                            onClick={() => setOpenFeedback(true)}
                            style={{ fontWeight: '500', fontSize: 13, fontFamily: 'inter', color: 'white' }}>
                            Feedback
                        </button>
                    </div>
                    <div className='flex flex-row mt-3 gap-3 items-center w-2/12'>
                        <button onClick={handleOpenProfile} className='flex flex-row mt-3 gap-3 items-center w-10/12 justify-between'>
                            <div className='flex flex-row gap-2 items-center'>
                                {showProfileImg ?
                                    <img
                                        className=''
                                        src={getProfileData.profile_image} alt='Profile'
                                        style={{ height: '33px', width: '33px', resize: 'cover', objectFit: 'cover', borderRadius: '50%' }} /> :
                                    <div className='flex items-center justify-center'
                                        style={{
                                            height: '33px', width: '33px', borderRadius: "50%",
                                            backgroundColor: "#4011FA", color: "white", fontWeight: "500", fontSize: 14
                                        }}>
                                        {separateLetters}
                                    </div>
                                    // <img
                                    //     className=''
                                    //     src='/assets/profile1.jpeg' alt='Profile'
                                    //     style={{ height: '33px', width: '33px', resize: 'cover', objectFit: 'cover', borderRadius: '50%' }} />
                                }
                                <div className=' text-start text-white'
                                    style={{ fontWeight: '500', fontSize: 12, fontFamily: 'inter' }}>
                                    {
                                        showProfileName ?
                                            <div style={{ fontWeight: '500', fontSize: 12, fontFamily: 'inter' }}>
                                                {getProfileData.name}
                                            </div> :
                                            <div style={{ fontWeight: '500', fontSize: 12, fontFamily: 'inter' }}>
                                                {formattedEmail}
                                            </div>
                                    }
                                </div>
                            </div>
                            <div className='flex items-center justify-center ' style={{ backgroundColor: '#4011FA', height: "23px", width: "23px", borderRadius: "50%" }}>
                                <img src='/assets/nextIcon.png' alt='nextarrow' style={{ height: '10', width: '13px' }} />
                            </div>
                        </button>
                    </div>
                    <div className='mt-4'>
                        <button onClick={handleLogout} style={{ color: '#FF4242' }}>
                            Logout
                        </button>
                    </div>
                </div>



                {/* modals code starts here */}
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
                                        value={userName}
                                        onChange={(e) => setUserName(e.target.value)}
                                        className="mt-8 w-full"
                                        style={{
                                            outline: 'none', border: 'none', backgroundColor: '#00000000', height: '40px',
                                            fontWeight: '400', fontSize: 13, resize: 'none', fontFamily: 'inter',
                                            borderBottom: '1px solid #ffffff'
                                        }}
                                        placeholder="Enter Name" />
                                    <div className='w-full flex justify-center mt-14'>
                                        {
                                            updateLoader ?
                                                <CircularProgress className='mt-4' size={30} /> :
                                                <Button onClick={handleSaveChanges} sx={{ textTransform: 'none' }}
                                                    className='mt-4 px-4 py-3' style={{ backgroundColor: '#2548FD', fontWeight: '400', fontFamily: 'inter', color: '#ffffff' }}>
                                                    Save Changes
                                                </Button>
                                        }
                                    </div>
                                </div>
                            </Box>
                        </Modal>
                    </div>
                    <div>
                        <Modal
                            open={openFeedback}
                            onClose={() => setOpenFeedback(false)}
                        >
                            <Box sx={addTeamStyle}>
                                <div className='text-white w-full'>
                                    <div className='flex flex-row justify-end w-full'>
                                        <button onClick={() => setOpenFeedback(false)}>
                                            <img src='/assets/cross2.png' alt='cross' style={{ height: '10px', width: '10px', resize: 'cover' }} />
                                        </button>
                                    </div>
                                    <div style={{ fontWeight: '500', fontFamily: "inter", fontSize: 24 }}>
                                        Feedback Form
                                    </div>
                                    <div style={{ fontWeight: '400', fontFamily: "inter", fontSize: 12, color: "#ffffff60" }}>
                                        Lorem ipsum dolor sit amet consectetur. Et interdum duis lectus quis ipsum scelerisque inte
                                    </div>
                                    <input
                                        style={{ width: "100%", marginTop: 10, backgroundColor: "#ffffff00", borderBottom: "1px solid grey", padding: 4, outline: "none" }}
                                        placeholder='App Version Number (shown on TestFlight)'
                                    />
                                    <input
                                        style={{ width: "100%", marginTop: 35, backgroundColor: "#ffffff00", borderBottom: "1px solid grey", padding: 4, outline: "none" }}
                                        placeholder="What's your name?"
                                    />
                                    <input
                                        style={{ width: "100%", marginTop: 35, backgroundColor: "#ffffff00", borderBottom: "1px solid grey", padding: 4, outline: "none" }}
                                        placeholder="Which type of user were you? *"
                                    />
                                    <input
                                        style={{ width: "100%", marginTop: 35, backgroundColor: "#ffffff00", borderBottom: "1px solid grey", padding: 4, outline: "none" }}
                                        placeholder="What was the bug or issue? *"
                                    />
                                    <input
                                        style={{ width: "100%", marginTop: 35, backgroundColor: "#ffffff00", borderBottom: "1px solid grey", padding: 4, outline: "none" }}
                                        placeholder="In a few words, what is your feedback about?"
                                    />
                                    <input
                                        style={{ width: "100%", marginTop: 35, backgroundColor: "#ffffff00", borderBottom: "1px solid grey", padding: 4, outline: "none" }}
                                        placeholder="Tell us more about your feedback here  (optional)"
                                    />

                                    <div className='flex flex-row gap-2 items-center justify-center' style={{ height: "98px", border: '1px dashed grey', marginTop: 25 }}>
                                        <div style={{ fontWeight: "400", fontFamily: "inter", fontSize: 13, color: "grey" }}>
                                            Drop your files here to
                                        </div>
                                        <button style={{ fontWeight: "400", fontFamily: "inter", fontSize: 13, color: "grey" }}>
                                            <u>
                                                Upload
                                            </u>
                                        </button>
                                    </div>

                                    <textarea
                                        rows={4}
                                        style={{
                                            width: '100%', borderBottom: "1px solid grey", resize: 'none', backgroundColor: "#ffffff00",
                                            fontWeight: "400", fontSize: 13, fontFamily: "inter", marginTop: 20, outline: "none"
                                        }}
                                        placeholder="What's your complain"
                                    />

                                    <Button sx={{
                                        textTransform: "none", backgroundColor: "#2548FD",
                                        fontWeight: "400", fontFamily: "inter",
                                        fontSize: 12, color: "white", marginTop: 2
                                    }}>
                                        Submit
                                    </Button>

                                    <div className='flex flex-row' style={{ fontWeight: "400", fontFamily: "inter", fontSize: 12, marginTop: 17 }}>
                                        <div>
                                            Need one on one help?
                                        </div>
                                        <button style={{ marginLeft: '3px', color: "#2548FD" }}>
                                            Get dev support
                                        </button>
                                    </div>

                                </div>
                            </Box>
                        </Modal>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Chatsidenav