"use client"
import { Box, Button, CircularProgress, Link, Modal } from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import ImagePicker from '@/public/ui/ImagePicker';
import Apis from '../Apis/Apis';
import GetProjects from './GetProjects';

const Chatsidenav = () => {
    const Router = useRouter();

    const [myProjectsLoader, setMyprojectsLoader] = useState(false);
    const [myProjects, setMyProjects] = useState([]);
    const [openTeam, setOpenTeam] = useState(false);
    const [openPlan, setOpenPlan] = useState(false);
    const [openProjects, setOpenProjects] = useState(true);
    const [openSetting, setOpenSetting] = useState(false);
    const [openSupport, setOpenSupport] = useState(false);
    const [openRef, setOpenRefer] = useState(false);
    const [openProfile, setOpenProfile] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [SelectedLogo, setSelectedLogo] = useState(null);
    const [openAddTeam, setOpenAddTeam] = useState(false);
    const [loadTeamLoader, setLoadTeamLoader] = useState(false);
    const [open, setOpen] = useState(false);
    const links1 = [
        {
            name: 'Settings',
            href: '/chat/settings'
        }
    ]
    //code for image picker1
    const handleFileSelect = (file) => {




        // Handle the selected file here (e.g., upload to server, display preview, etc.)
        console.log('Selected file:', file);
        setSelectedImage(file.previewURL);
    };

    const handleInputFileChange = () => {
        fileInputRef.current.click();
    };

    const handleCloseEditProject = () => {
        setOpen(false);
        setOpenRefer(false);
        setOpenAddTeam(false);
        setOpenSupport(false);
        setOpenProfile(false);
    };

    const handleSettingClick = () => {
        setOpenSetting(true);
        setOpenPlan(false);
        setOpenProjects(false);
        setOpenTeam(false);
    }

    const handleOpenEditproject = () => setOpen(true);
    const handleOpenShareproject = () => setOpenShareApp(true);
    const handleOpenRefer = () => setOpenRefer(true);
    const handleOpenSupport = () => setOpenSupport(true);
    const handleOpenProfile = () => setOpenProfile(true);
    const handleOpenAddTeam = () => setOpenAddTeam(true);
    const handleCloseShareProject = () => setOpenShareApp(false);

    const handleTeamClick2 = () => {
        Router.push()
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

    const handlePlanClick = () => {
        setOpenPlan(true);
        setOpenProjects(false);
        setOpenTeam(false);
        setOpenSetting(false);
    }

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

    //code for calling get projects api



    return (
        <div className='w-full flex flex-flex-col justify-center' style={{ backgroundColor: 'black', height: '100%' }}>
            <div className='w-9/12'>
                <div className='flex justify-center mt-6 w-full'>
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
                        // setUserChat([]);
                        // setActiveChat(null);
                        Router.push("/onboarding")
                    }}>
                    <img src='/assets/addIcon.png' alt='addIcon' style={{ height: '16px', width: '16px' }} />
                    <p style={{ textTransform: 'none', fontWeight: '500', fontSize: 15, fontFamily: 'inter' }}>
                        New Project
                    </p>
                </Button>
                <div>
                    <Button
                        sx={{ textTransform: 'none' }}
                        style={{
                            color: openProjects ? '#ffffff' : '#ffffff60', fontWeight: '500',
                            fontSize: 12, fontFamily: 'inter', backgroundColor: openProjects ? '#ffffff60' : ''
                        }}>
                        My Projects
                    </Button>
                    <GetProjects />
                </div>

                <div className='flex flex-col items-start w-full items-center p-1'>
                    <div className='flex flex-col gap-3 items-start w-11/12 p-1'>
                        {/* <button onClick={handleSettingClick} sx={{ textTransform: 'none' }}
                            style={{
                                fontWeight: '500', fontSize: 12, fontFamily: 'inter',
                                color: openSetting ? '#2548FD' : '#ffffff60', backgroundColor: openSetting ? '' : ''
                            }}>
                            Settings
                        </button> */}

                        <div>
                            {
                                links1.map((link, index) => {
                                    <div>
                                        <Link className='text-white'
                                            key={link.name}
                                            href={link.href}>
                                            {link.name}
                                        </Link>
                                    </div>
                                })
                            }
                        </div>

                        <button onClick={handleTeamClick2} sx={{ textTransform: 'none' }}
                            style={{ fontWeight: '500', fontSize: 12, fontFamily: 'inter', color: openTeam ? '#2548FD' : '#ffffff60', backgroundColor: openTeam ? '' : '' }}> {/* 2548FD40 */}
                            My Team
                        </button>
                        <button onClick={handlePlanClick} sx={{ textTransform: 'none', padding: 0, margin: 0 }}
                            style={{
                                fontWeight: '500', fontSize: 12, textAlign: 'start', fontFamily: 'inter', color: openPlan ? '#2548FD' : '#ffffff60',
                                backgroundColor: openPlan ? '' : ''
                            }}>
                            Plans
                        </button>
                    </div>
                </div>

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
                            <div className='w-8/12 text-start text-white' style={{ fontWeight: '500', fontSize: 12, fontFamily: 'inter' }}>
                                hamza@gmail.com
                            </div>
                            <div className='w-1/12' style={{}}>
                                <img src='/assets/nextIcon.png' alt='nextarrow' style={{ height: '10', width: '13px' }} />
                            </div>
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
                                        <Button onClick={handleCloseEditProject} sx={{ textTransform: 'none' }}
                                            className='mt-4 px-4 py-3' style={{ backgroundColor: '#2548FD', fontWeight: '400', fontFamily: 'inter', color: '#ffffff' }}>
                                            Save Changes
                                        </Button>
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