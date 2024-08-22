'use client'
import { Box, Button, Modal, Alert, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Snackbar from '@mui/material/Snackbar';
import Slide from '@mui/material/Slide';
import TextField from '@mui/material/TextField';
import axios from "axios";
import Apis from "@/public/Apis/Apis";

const Page = () => {
    const router = useRouter('');
    const [showError, setShowError] = useState(false);
    const [addFounder, setAddFounder] = useState(false);
    const [founders, setFounders] = useState([]);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [AddFounderError, setAddFounderError] = useState(false);
    const [appIdea, setAppIdea] = useState('');
    const [audienceName, setAudienceName] = useState("");
    const [appName, setAppName] = useState("");
    const [loader, setLoader] = useState(false);

    //getting create project data
    useEffect(() => {
        const D = localStorage.getItem('createProject');
        const localStorageData = JSON.parse(D);
        setAppIdea(localStorageData.appidea);
        setAudienceName(localStorageData.audeincename);
        setAppName(localStorageData.appName);
    }, []);

    const CreateProject1 = {
        appidea: appIdea,
        audienceName: audienceName,
        appName: appName,
        founders: [founders]
    }

    const handleClose = () => {
        setShowError(false);
    }

    const handleContinueClick = async () => {
        const data = localStorage.getItem('User');
        if (data) {
            const ParsedLocalData = JSON.parse(data);
            const AuthToken = ParsedLocalData.data.token;

            try {
                setLoader(true);
                const response2 = await axios.post(Apis.CreateProject, {
                    appIdea: appIdea,
                    targettedAudience: audienceName,
                    projectName: appName
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + AuthToken
                    }
                });
                if (response2.status === 200) {
                    const Result = response2.data;
                    // localStorage.setItem('NewProject', JSON.stringify(Result));
                    console.log('Response of API is:', Result);
                    router.push('/chat');
                    // router.push('/onboarding/founders');
                } else {
                    console.log('Response is not ok', response2);
                }
            } catch (error) {
                console.error("Error occured in api is:", error);
            } finally {
                setLoader(false);
            }
        } else {
            localStorage.setItem("createProject", JSON.stringify(CreateProject1))
            router.push('/onboarding/savework');
        }
    }

    const handleBackClick = () => {
        router.push('/onboarding/appname')
    }

    //Modal to add founder
    const handleAddFounder = () => {
        setAddFounder(true);
    }

    const onClose = () => {
        setAddFounder(false);
    }

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        // height: 400,
        bgcolor: 'background.paper',
        // border: '2px solid #000',
        boxShadow: 24,
        p: 2,
        borderRadius: 2,
        backgroundColor: '#0F0C2D',
        color: '#ffffff'
    };

    const handleSubmit = (e) => {
        if (name && email && role) {
            e.preventDefault();
            const newFounder = {
                id: founders.length + 1,
                name,
                email,
                role
            };
            setFounders([...founders, newFounder]);
            setAddFounder(false);
            setName('');
            setEmail('');
            setRole('');
        } else {
            setAddFounderError(true);
        }
    };

    const handleDelfounder = (itemId) => {
        setFounders(founders.filter(founders => founders.id !== itemId))
    }

    useEffect(() => {
        const localstorage = localStorage.getItem('createProject');
        if (localstorage) {
            const LD = JSON.parse(localstorage);
            console.log('Local data is', LD);
        }
    }, [])

    return (
        <div className="flex justify-center" style={{ color: 'white' }}>
            <div className="w-11/12">
                <div className="flex justify-between mt-16">
                    <img src="/assets/Vector1.png" alt="vector1" style={{ height: '23px', width: '20px', resize: 'cover' }} />
                    <img src="/assets/Vector2.png" alt="vector2" style={{ height: '23px', width: '20px', resize: 'cover' }} />
                </div>

                <div className="flex flex-row">
                    <div className="w-1/12 mt-24">
                        <img src="/assets/vector5.png" alt="vector5" style={{ height: '330px' }} />
                    </div>
                    <div className="w-11/12 flex flex-row">
                        {/* Code for onboarding */}
                        <div className="flex items-center w-6/12">
                            <div className="w-8/12"
                                style={{ padding: 22, backgroundColor: '#0F0C2D' }}>
                                <p className="font-semibold" style={{ color: '#2548FD', fontSize: 10, fontFamily: 'inter' }}>
                                    ONBOARDING
                                </p>
                                <div className="mt-4 flex flex-row justify-between">
                                    <p style={{ fontSize: 24, fontWeight: '600', fontFamily: 'inter' }}>
                                        Who are the founders involved?
                                    </p>
                                    <button onClick={handleAddFounder}>
                                        <div className="flex justify-center items-center" style={{ height: '40px', width: '40px', backgroundColor: '#4011FA', borderRadius: '50%' }}>
                                            <img src="/assets/addIcon.png" alt="Add" style={{ height: 'auto', width: '100%', maxWidth: '12px' }} />
                                        </div>
                                    </button>
                                </div>
                                {
                                    founders ?
                                        <div className="mt-4" style={{ height: '30vh', overflow: 'auto', paddingBottom: 10, scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                                            {
                                                founders.map((item) => (
                                                    <div key={item.id} className="flex justify-center mt-4">
                                                        <div className="w-full px-4 py-6" style={{ border: '2px solid #ffffff35' }}>
                                                            <div className="flex flex-row justify-between">
                                                                <div className="flex flex-row gap-2 items-center">
                                                                    <p
                                                                        style={{
                                                                            fontWeight: '600', fontFamily: 'inter',
                                                                            fontSize: '15px'
                                                                        }}>
                                                                        {item.name} ,
                                                                    </p>
                                                                    <p style={{
                                                                        fontWeight: '400', fontFamily: 'inter',
                                                                        fontSize: '13px', color: '#ffffff60'
                                                                    }}>
                                                                        {item.role}
                                                                    </p>
                                                                </div>
                                                                <button onClick={() => handleDelfounder(item.id)}>
                                                                    <img src="/assets/deleteIcon.png" alt="delbtn" style={{ height: 'auto', width: '100%', maxWidth: '15px', resize: 'cover' }} />
                                                                </button>
                                                            </div>
                                                            <p style={{
                                                                fontWeight: '400', fontFamily: 'inter',
                                                                fontSize: '13px', color: '#ffffff60'
                                                            }}>
                                                                {item.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div> :
                                        <div className="mt-6" style={{ fontSize: 24, fontWeight: '600', color: '#ffffff' }}>
                                            No Founders
                                        </div>
                                }
                                <div className="mt-8 flex flex-row gap-8">
                                    <Button
                                        onClick={handleBackClick}
                                        className="p-3 py-4"
                                        style={{
                                            height: '40px', color: 'white', fontWeight: 'medium', fontSize: 15,
                                            backgroundColor: '', fontFamily: 'inter'
                                        }}>
                                        Back
                                    </Button>
                                    {founders ? <Button
                                        // variant="disabled"
                                        onClick={handleContinueClick}
                                        className="p-3 py-4"
                                        style={{
                                            height: '40px', color: 'white', fontWeight: 'medium', fontSize: 15,
                                            backgroundColor: '#4011FA', fontFamily: 'inter'
                                        }}>
                                        Continue
                                    </Button> :
                                        <Button variant="disabled"
                                            onClick={handleContinueClick}
                                            className="p-3 py-4"
                                            style={{
                                                height: '40px', color: 'white', fontWeight: 'medium', fontSize: 15,
                                                backgroundColor: '#4011FA50', fontFamily: 'inter'
                                            }}>
                                            {
                                                loader ?
                                                    <CircularProgress size={30} /> : "Continue"
                                            }
                                        </Button>
                                    }
                                </div>
                            </div>
                        </div>
                        {/* Code for logo3 */}
                        <div className="lg:flex hidden flex justify-end w-6/12" style={{}}>
                            <img src="/assets/logo3.png" alt="globe" style={{ height: '648px', width: '648px', objectFit: 'cover' }} />
                        </div>
                    </div>
                </div>

                {/*<div className="flex flex-row ms-6 gap-6 mt-12" style={{ position: 'absolute' }}>
                    <button>
                        <img src="/assets/facebook.png" alt="facebook" style={{ height: 'auto', width: '100%', maxWidth: '20px' }} />
                    </button>
                    <button>
                        <img src="/assets/instagram.png" alt="insta" style={{ height: 'auto', width: '100%', maxWidth: '20px' }} />
                    </button>
                    <button>
                        <img src="/assets/linkedin.png" alt="linkdin" style={{ height: 'auto', width: '100%', maxWidth: '20px' }} />
                    </button>
                                    </div>*/}
                <div className="flex justify-between mt-16">
                    <img src="/assets/Vector3.png" alt="vector3" style={{ height: '23px', width: '20px', resize: 'cover' }} />
                    <img src="/assets/Vector4.png" alt="vector4" style={{ height: '23px', width: '20px', resize: 'cover' }} />
                </div>
                <br />

                {/* Error */}
                <div>
                    <Snackbar
                        open={showError}
                        autoHideDuration={3000}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right'
                        }}
                        TransitionComponent={Slide}
                        TransitionProps={{
                            direction: 'left'
                        }}
                    >
                        <Alert
                            onClose={handleClose} severity="error"
                            sx={{ width: '30vw', fontWeight: '700', fontFamily: 'inter', fontSize: '22' }}>
                            Add app Founders.
                        </Alert>
                    </Snackbar>
                </div>

                {/* Modal to add founders */}

                <Modal
                    open={addFounder}
                    onClose={onClose}
                >
                    <Box sx={style}>
                        <div className="w-full">
                            <div className='w-full flex flex-row justify-end pe-2'>
                                <button onClick={onClose}>
                                    <img src='/assets/cross2.png' alt='cross' style={{ height: '10px', width: '10px', resize: 'cover' }} />
                                </button>
                            </div>
                            <div style={{ fontSize: 24, fontWeight: '500', fontFamily: 'inter' }}>
                                New Founder
                            </div>
                            <div className="w-10/12 mt-6" style={{
                                fontSize: 12, fontWeight: '400', fontFamily: 'inter', color: '#ffffff60'
                            }}>

                                {
                                    founders.length === 0 ?
                                        <div className="w-10/12 mt-6" style={{
                                            fontSize: 12, fontWeight: '400', fontFamily: 'inter', color: '#ffffff60'
                                        }}>
                                            It starts with you. Fill your personal information as a Founder
                                        </div> :
                                        <div className="w-10/12 mt-6" style={{
                                            fontSize: 12, fontWeight: '400', fontFamily: 'inter', color: '#ffffff60'
                                        }}>
                                            Add additional founders to your project
                                        </div>
                                }

                            </div>
                            <div className="mt-6">
                                <TextField id="standard-basic" label="Full Name" variant="standard"
                                    placeholder="Enter Full Name"
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                        setAddFounderError(false);
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
                                        // marginTop: 0
                                    }}
                                />
                                <TextField id="standard-basic" label="Role" variant="standard"
                                    placeholder="Enter Founder Role"
                                    value={role}
                                    onChange={(e) => {
                                        setRole(e.target.value);
                                        setAddFounderError(false);
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
                                <TextField id="standard-basic" label="Email" variant="standard"
                                    placeholder="Enter Email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setAddFounderError(false);
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
                            </div>
                            {
                                AddFounderError &&
                                <div className="text-xs mt-4" style={{ color: 'red' }}>
                                    Enter all Credientials
                                </div>
                            }
                            <div>
                                <Button onClick={handleSubmit}
                                    style={{ color: '#ffffff', fontWeight: '500', fontSize: 15, backgroundColor: '#4011FA', marginTop: 50 }}>
                                    Save Founder
                                </Button>
                            </div>
                        </div>
                    </Box>
                </Modal>

                {/*<div>
            <img src="/assets/logo2.png" style={{ height: 'auto', width: '100%', maxWidth: '440px', resize: ' cover' }} />
  </div>*/}
            </div>
        </div>
    )
}

export default Page
