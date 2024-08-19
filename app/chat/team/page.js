'use client'
import { Box, Button, CircularProgress, Drawer, FormControl, Grid, InputLabel, Menu, MenuItem, Modal, Select, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Apis from '@/public/Apis/Apis';
import axios from 'axios';
import Notifications from '@/public/assets/notifications/Notifications';

const Page = () => {

    const [teamProfiles, setTeamProfiles] = useState([]);
    const [teamLoader, setLoadTeamLoader] = useState(false);
    const [showAcceptBtn, setShowAcceptBtn] = useState(false);
    const [openAddTeam, setOpenAddTeam] = useState(false);
    const [addTeamLoader, setAddTeamLoader] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [openSideNav, setOpenSideNav] = useState(false);
    const [acceptLoader, setAcceptLoader] = useState(false);
    const [declineLoader, setDeclineLoader] = useState(false);
    const [assignProject, setAssignProject] = useState("");
    const [getProject, setGetProject] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState("");
    const [showFromUserData, setShowFromUserData] = useState(false);

    const [loggedInUser, setLoggedInUser] = useState(null)
    const handleOpenAddTeam = () => setOpenAddTeam(true);

    useEffect(() => {
        getProjectsList()
    }, [])

    const handleCloseModal = () => {
        setOpenAddTeam(false);
    }

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

    //add team member
    const handleAddTeam = async (e) => {
        if (name && email && role) {

            //api call for adding team member

            try {
                setAddTeamLoader(true)
                const AddMember = {
                    toUserEmail: email,
                    name: name,
                    role: role,
                    projectId: selectedProjectId
                }

                console.log("add member is:", AddMember);
                // return
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
                if (response.status === 200) {
                    const newMember = response.data.data;

                    // Update the teamProfiles state with the new member
                    setTeamProfiles((prevProfiles) => [...prevProfiles, newMember])
                    setOpenAddTeam
                    setName('');
                    setEmail('');
                    setRole('');
                }

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

    const getTeam = async () => {
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
    }

    useEffect(() => {
        getTeam();
    }, []);

    //opening side drawer of notifications
    const openSideBar = () => {
        setOpenSideNav(true);
    }

    const closeSideNav = () => {
        setOpenSideNav(false);
    }

    useEffect(() => {
        const LSD = localStorage.getItem('User');
        const localStorageData = JSON.parse(LSD);
        const toUserEmail1 = localStorageData.data.user.email;
        setLoggedInUser(localStorageData.data.user)
        console.log('Email for test is', toUserEmail1);
    }, []);


    const handleAcceptRequest = async (inviteid) => {
        setAcceptLoader(true);
        console.log('invite id is', inviteid);

        try {
            const inviteStatus = "accepted" //rejected
            const LSD = localStorage.getItem('User');
            const localStorageData = JSON.parse(LSD);
            // console.log('Data2 from localstorage for add team is :', localStorageData);
            const AuthToken = localStorageData.data.token;
            const ApiPath = Apis.AcceptInvitation;
            const InviteResponse = {
                inviteId: inviteid,
                status: inviteStatus
            }
            const response = await axios.post(ApiPath, InviteResponse, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + AuthToken
                }
            });

            if (response) {
                console.log('Response of accept invite is', response);
            }
            if (response.status === 200) {
                window.location.reload();
                console.log('Invite accepted');
            } else {
                console.log('Couldnot accept invite');
            }
        } catch (error) {
            console.error('Error occured in accept invite api is', error);
        } finally {
            // console.log('Done');
            setAcceptLoader(false);
        }

    }

    const handleDeclineRequest = async (inviteid) => {
        setDeclineLoader(true);
        console.log('invite id is', inviteid);

        try {
            const inviteStatus = "rejected" //rejected
            const LSD = localStorage.getItem('User');
            const localStorageData = JSON.parse(LSD);
            // console.log('Data2 from localstorage for add team is :', localStorageData);
            const AuthToken = localStorageData.data.token;
            const ApiPath = Apis.AcceptInvitation;
            const InviteResponse = {
                inviteId: inviteid,
                status: inviteStatus
            }
            const response = await axios.post(ApiPath, InviteResponse, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + AuthToken
                }
            });

            if (response) {
                console.log('Response of accept invite is', response);
            }
            if (response.status === 200) {
                window.location.reload();
                console.log('Invite declined');
            } else {
                console.log('Couldnot accept invite');
            }
        } catch (error) {
            console.error('Error occured in accept invite api is', error);
        } finally {
            // console.log('Done');
            setDeclineLoader(false);
        }

    }

    const handleChange = (event) => {
        setAssignProject(event.target.value);
    };

    const getProjectsList = async () => {
        try {
            const ApiPath = Apis.GetProjects;
            const LocalData = localStorage.getItem('User');
            const D = JSON.parse(LocalData);
            const AuthToken = D.data.token;
            console.log('Auth token for getprojects', AuthToken);
            const response = await axios.get(ApiPath, {
                headers: {
                    'Authorization': 'Bearer ' + AuthToken,
                    'Content-Type': 'application/json'
                }
            });
            if (response.status === 200) {
                console.log('Response of getprojects', response.data);
                setGetProject(response.data.data)
            }
        } catch (error) {
            console.error("Error occured in get projects lis", error);
        }
    }

    const handleSelectProject = (id) => {
        console.log("ProjectId selectd is", id);
        setSelectedProjectId(id);
    }

    useEffect(() => {
        console.log("selectd ProjectId is", selectedProjectId);
    }, [selectedProjectId])


    return (
        <div className='w-full flex flex-col items-center' style={{ height: '100vh', backgroundColor: "#050221" }}>

            <div className='px-4 mt-6 flex w-full text-white flex-row justify-between'>
                <div>
                    My Team
                </div>
                <button onClick={openSideBar}>
                    <img src='/assets/notification.png' alt='notify' style={{ height: "18px", width: "20px", resize: 'cover', objectFit: 'contain' }} />
                </button>
            </div>

            {
                teamLoader ?
                    <CircularProgress size={30} /> :
                    <div className='w-11/12 mt-8 flex gap-6'>
                        {
                            teamProfiles ?
                                <Grid container spacing={2}
                                    style={{
                                        maxHeight: '85vh', display: 'flex', alignItems: 'flex-start', overflow: "auto",
                                        scrollbarWidth: 'none', msOverflowStyle: 'none',
                                    }}>
                                    {teamProfiles.map((item) => (
                                        <Grid key={item.id} item xs={12} sm={6} md={4} lg={4} xl={3} style={{ height: 'fit-content' }}>
                                            <div className='w-full gap-8 p-4 flex flex-row'
                                                style={{ backgroundColor: '#ffffff20', borderRadius: 2, height: 'fit-content', width: '100%', maxWidth: '335px' }}>
                                                <div>
                                                    <img src='/assets/profile1.png' alt='TM_Profile' style={{ height: '50px', width: '50px', objectFit: 'cover' }} />
                                                </div>
                                                <div>
                                                    <div>
                                                        {
                                                            item.fromUser.email != loggedInUser.email ?
                                                                <div style={{ fontSize: 15, fontWeight: '500', fontFamily: 'inter', color: '#ffffff' }}>
                                                                    {item.fromUser.email}
                                                                </div> :
                                                                <div style={{ fontSize: 15, fontWeight: '500', fontFamily: 'inter', color: '#ffffff' }}>
                                                                    {item.name}
                                                                </div>
                                                        }
                                                    </div>
                                                    <div style={{ fontSize: 12, fontWeight: '500', fontFamily: 'inter', color: '#ffffff60' }}>
                                                        {item.role}
                                                    </div>
                                                    <div className='flex flex-row'>
                                                        <div style={{ fontSize: 12, fontWeight: '500', fontFamily: 'inter', color: '#ffffff60' }}>
                                                            Email:
                                                        </div>
                                                        <div>
                                                            {
                                                                item.fromUser.email != loggedInUser.email ?
                                                                    <div style={{
                                                                        fontSize: 12, fontWeight: '500', fontFamily: 'inter',
                                                                        color: '#ffffff', marginLeft: 3
                                                                    }}>
                                                                        {item.fromUser.email}
                                                                    </div> :
                                                                    <div
                                                                        style={{
                                                                            fontSize: 12, fontWeight: '500', fontFamily: 'inter',
                                                                            color: '#ffffff', marginLeft: 3
                                                                        }}>
                                                                        {item.toUserEmail === null ?
                                                                            <div>
                                                                                {item.toUser.email}
                                                                            </div> :
                                                                            <div>
                                                                                {item.toUserEmail}
                                                                            </div>
                                                                        }
                                                                    </div>
                                                            }
                                                        </div>
                                                        {/* <div style={{ fontSize: 12, fontWeight: '500', fontFamily: 'inter', color: '#ffffff', marginLeft: 3 }}>
                                                            {
                                                                item.toUser === null ?
                                                                    <div>
                                                                        {
                                                                            item.toUserEmail === null ?
                                                                                <div>
                                                                                </div> :
                                                                                <div>
                                                                                    <div>
                                                                                        {
                                                                                            showFromUserData ?
                                                                                                <div
                                                                                                    style={{
                                                                                                        fontSize: 12, fontWeight: '500', fontFamily: 'inter',
                                                                                                        color: '#ffffff', marginLeft: 3
                                                                                                    }}>
                                                                                                    {item.fromUser.email}
                                                                                                </div> :
                                                                                                
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                        }
                                                                    </div> :
                                                                    <div
                                                                        style={{
                                                                            fontSize: 12, fontWeight: '500', fontFamily: 'inter',
                                                                            color: '#ffffff', marginLeft: 3
                                                                        }}>
                                                                        {item.toUser.email}
                                                                    </div>
                                                            }
                                                        </div> */}
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
                                                            {item.status === 'rejected' ?
                                                                <div className='flex items-center justify-center mt-3'
                                                                    style={{
                                                                        height: '35px', width: '96px', borderRadius: 1,
                                                                        backgroundColor: '#FFB54707', color: '#FFB547', fontWeight: '500', fontFamily: 'inter', fontSize: 12
                                                                    }}>
                                                                    Rejected
                                                                </div> :
                                                                <div>
                                                                    {
                                                                        item.fromUser.email != loggedInUser.email ?
                                                                            <div className='flex flex-row justify-between w-full gap-2'>
                                                                                <Button className='flex items-center justify-center mt-3'
                                                                                    onClick={() => handleAcceptRequest(item.id)}
                                                                                    style={{
                                                                                        height: '35px', width: '96px', borderRadius: 5,
                                                                                        backgroundColor: '#00EE7C07', color: '#00EE7C', fontWeight: '500', fontFamily: 'inter', fontSize: 12
                                                                                    }}>
                                                                                    {
                                                                                        acceptLoader ?
                                                                                            <CircularProgress size={20} />
                                                                                            : "Accept"
                                                                                    }
                                                                                </Button>
                                                                                <Button className='flex items-center justify-center mt-3'
                                                                                    onClick={() => handleDeclineRequest(item.id)}
                                                                                    style={{
                                                                                        height: '35px', width: '96px', borderRadius: 1,
                                                                                        backgroundColor: '#D4474050', color: '#D44740', fontWeight: '500', fontFamily: 'inter', fontSize: 12
                                                                                    }}>
                                                                                    {
                                                                                        declineLoader ?
                                                                                            <CircularProgress size={20} /> :
                                                                                            "Decline"
                                                                                    }
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
                                                                                )
                                                                                }
                                                                            </div>
                                                                    }
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
            }


            {/* Code for adding team member */}

            <div>
                <Modal
                    open={openAddTeam}
                    onClose={handleCloseModal}
                >
                    <Box sx={addTeamStyle}>
                        <div>
                            <div className='w-full flex flex-row justify-end'>
                                <button onClick={handleCloseModal}>
                                    <img src='/assets/cross2.png' alt='cross' style={{ height: '10px', width: '10px', resize: 'cover' }} />
                                </button>
                            </div>
                            <div style={{ fontWeight: '500', fontSize: 24, fontFamily: 'inter', color: '#ffffff' }}>
                                Invite Member
                            </div>
                            <TextField id="standard-basic" label="Name" variant="standard"
                                placeholder="Enter Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                sx={{
                                    width: '100%',
                                    '& .MuiInputBase-root': {
                                        color: 'white',
                                        fontWeight: '400',
                                        fontSize: 13,
                                        fontFamily: 'inter'
                                    },
                                    '& .MuiInput-underline:before': {
                                        borderBottomColor: '#ffffff60',
                                    },
                                    '& .MuiInput-underline:hover:before': {
                                        borderBottomColor: '#ffffff',
                                    },
                                    '& .MuiInput-underline:after': {
                                        borderBottomColor: '#ffffff',
                                    },
                                    '& .MuiFormLabel-root': {
                                        color: '#ffffff60',
                                    },
                                    '& .MuiFormLabel-root.Mui-focused': {
                                        color: '#ffffff',
                                    },
                                    marginTop: 2
                                }}
                            />
                            <TextField id="standard-basic" label="Role" variant="standard"
                                placeholder="Role"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                sx={{
                                    width: '100%',
                                    '& .MuiInputBase-root': {
                                        color: 'white',
                                        fontWeight: '400',
                                        fontSize: 13,
                                        fontFamily: 'inter'
                                    },
                                    '& .MuiInput-underline:before': {
                                        borderBottomColor: '#ffffff60',
                                    },
                                    '& .MuiInput-underline:hover:before': {
                                        borderBottomColor: '#ffffff',
                                    },
                                    '& .MuiInput-underline:after': {
                                        borderBottomColor: '#ffffff',
                                    },
                                    '& .MuiFormLabel-root': {
                                        color: '#ffffff60',
                                    },
                                    '& .MuiFormLabel-root.Mui-focused': {
                                        color: '#ffffff',
                                    },
                                    marginTop: 2
                                }}
                            />
                            <TextField id="standard-basic" label="Email" variant="standard"
                                placeholder="Enter Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                sx={{
                                    width: '100%',
                                    '& .MuiInputBase-root': {
                                        color: 'white',
                                        fontWeight: '400',
                                        fontSize: 13,
                                        fontFamily: 'inter'
                                    },
                                    '& .MuiInput-underline:before': {
                                        borderBottomColor: '#ffffff60',
                                    },
                                    '& .MuiInput-underline:hover:before': {
                                        borderBottomColor: '#ffffff',
                                    },
                                    '& .MuiInput-underline:after': {
                                        borderBottomColor: '#ffffff',
                                    },
                                    '& .MuiFormLabel-root': {
                                        color: '#ffffff60',
                                    },
                                    '& .MuiFormLabel-root.Mui-focused': {
                                        color: '#ffffff',
                                    },
                                    marginTop: 2
                                }}
                            />
                            {/* <TextField id="standard-basic" label="Assign Project" variant="standard"
                                placeholder="Assign Project"
                                aria-controls={open ? 'basic-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                onFocus={handleClick}
                                sx={{
                                    width: '100%',
                                    '& .MuiInputBase-root': {
                                        color: 'white',
                                        fontWeight: '400',
                                        fontSize: 13,
                                        fontFamily: 'inter'
                                    },
                                    '& .MuiInput-underline:before': {
                                        borderBottomColor: '#ffffff60',
                                    },
                                    '& .MuiInput-underline:hover:before': {
                                        borderBottomColor: '#ffffff',
                                    },
                                    '& .MuiInput-underline:after': {
                                        borderBottomColor: '#ffffff',
                                    },
                                    '& .MuiFormLabel-root': {
                                        color: '#ffffff60',
                                    },
                                    '& .MuiFormLabel-root.Mui-focused': {
                                        color: '#ffffff',
                                    },
                                    marginTop: 2
                                }}
                            /> */}

                            <div className='mt-4'>
                                <FormControl
                                    fullWidth
                                    variant="standard"
                                    sx={{
                                        width: '100%',
                                        '& .MuiInputBase-root': {
                                            color: 'white',
                                            fontWeight: '400',
                                            fontSize: 13,
                                            fontFamily: 'Inter',
                                        },
                                        '& .MuiInput-underline:before': {
                                            borderBottomColor: '#ffffff60', // Default state color
                                        },
                                        '& .MuiInput-underline:hover:before': {
                                            borderBottomColor: '#ffffff', // Hover state color
                                        },
                                        '& .MuiInput-underline:after': {
                                            borderBottomColor: '#ffffff', // Focused state color
                                        },
                                        '& .MuiFormLabel-root': {
                                            color: '#ffffff60', // Default label color
                                        },
                                        '& .MuiFormLabel-root.Mui-focused': {
                                            color: '#ffffff', // Focused label color
                                        },
                                        marginTop: 2,
                                    }}
                                >
                                    <InputLabel id="demo-simple-select-label">Assign Project</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={assignProject}
                                        label="Assign Project"
                                        onChange={handleChange}
                                    >
                                        {getProject.map((project) => (
                                            <MenuItem key={project.id} value={project.id}>
                                                <button onClick={() => handleSelectProject(project.chat.projectId)}>
                                                    {project.projectName ? project.projectName : "App Name"}
                                                </button>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>



                            <Button onClick={handleAddTeam} sx={{ textTransform: 'none', marginTop: 4 }}
                                style={{ backgroundColor: '#2548FD', fontWeight: '400', fontFamily: 'inter', color: '#ffffff' }}>
                                {
                                    addTeamLoader ?
                                        <CircularProgress size={30} /> :
                                        "Submit"
                                }
                            </Button>

                        </div>
                    </Box>
                </Modal>

            </div>



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
    )
}

export default Page