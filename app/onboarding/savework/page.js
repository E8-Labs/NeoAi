'use client'
import { Button, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Snackbar from '@mui/material/Snackbar';
import { Alert } from '@mui/material';
import Slide from '@mui/material/Slide';
import React from 'react'
import Apis from "@/public/Apis/Apis";
import axios from "axios";

const Page = () => {
    const router = useRouter('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showError, setShowError] = useState(false);
    const [loader, setLoader] = useState(false);
    const [appIdea, setAppIdea] = useState('');
    const [audienceName, setAudienceName] = useState("");
    const [appName, setAppName] = useState("");
    const [founders, setFounders] = useState(null);

    const handleClose = () => {
        setShowError(false);
    }

    useEffect(() => {
        const D = localStorage.getItem('createProject');
        const localData = JSON.parse(D);
        console.log("Data from local including array is", localData);
        setAppIdea(localData.appidea);
        setAudienceName(localData.audienceName);
        setAppName(localData.appName);
        setFounders(localData.founders);
    }, []);

    const handleContinueClick = async () => {
        if (email.length !== 0) {
            try {
                setLoader(true);
                const ApiPath = Apis.Login;
                const response = await fetch(ApiPath, {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });
                console.log("response for checking status", response);
                if (response.ok) {
                    const ApiResponse = await response.json();
                    console.log('Response of api is :', ApiResponse);
                    localStorage.setItem('User', JSON.stringify(ApiResponse));
                    if (ApiResponse.status === true) {

                        const data = {
                            appIdea: appIdea,
                            targettedAudience: audienceName,
                            projectName: appName
                        }
                        const AuthToken = ApiResponse.data.token;

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
                            localStorage.setItem('NewProject', JSON.stringify(Result));
                            console.log('Response of API is:', Result);
                            router.push('/chat');
                            // router.push('/onboarding/founders');
                        } else {
                            console.log('Response is not ok', response2);
                        }
                        // if (ApiResponse.message === "User registered") {
                        //     router.push('/chat');
                        //     localStorage.setItem('User', JSON.stringify(ApiResponse));
                        // } else {
                        //     console.log('User not registered');
                        // }
                    } else {
                        console.log('Error in response', response);
                    }
                } else if(!response.ok){
                    console.log("Response of login api is not ok :", response);
                }
            } catch (error) {
                console.error('Error occured is :', error);
            } finally {
                setLoader(false)
            }
        } else {
            setShowError(true);
        }
    }

    const handleBackClick = () => {
        router.push('/onboarding/founders')
    }

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
                                <p className="mt-4" style={{ fontSize: 24, fontWeight: '600', fontFamily: 'inter' }}>
                                    Save your work
                                </p>
                                <div className="flex flex-col justify-center">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="mt-8 w-11/12"
                                        style={{
                                            outline: 'none', border: 'none', backgroundColor: '#00000000',
                                            fontWeight: '400', fontSize: 13, resize: 'none', fontFamily: 'inter'
                                        }}
                                        placeholder="Email Address" />
                                    <div style={{ height: '1px', backgroundColor: '#ffffff', marginTop: 15 }} />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mt-12 w-11/12"
                                    style={{
                                        outline: 'none', border: 'none', backgroundColor: '#00000000',
                                        fontWeight: '400', fontSize: 13, resize: 'none', fontFamily: 'inter'
                                    }}
                                    placeholder="Password" />
                                <div className="flex flex-col gap-y-20">
                                    <div style={{ height: '1px', backgroundColor: '#ffffff', marginTop: 15 }} />
                                    <div className="mt-6 flex flex-row gap-8">
                                        <Button
                                            onClick={handleBackClick}
                                            className="p-3 py-4"
                                            style={{
                                                height: '40px', color: 'white', fontWeight: 'medium', fontSize: 15,
                                                backgroundColor: '', fontFamily: 'inter'
                                            }}>
                                            Back
                                        </Button>
                                        {email && password ? <Button
                                            onClick={handleContinueClick}
                                            className="p-3 py-4"
                                            style={{
                                                height: '40px', color: 'white', fontWeight: 'medium', fontSize: 15,
                                                backgroundColor: '#4011FA', fontFamily: 'inter'
                                            }}>
                                            {
                                                loader ?
                                                    <CircularProgress size={30} /> : "Continue"
                                            }
                                        </Button> :
                                            <Button variant="disabled"
                                                onClick={handleContinueClick}
                                                className="p-3 py-4"
                                                style={{
                                                    height: '40px', color: 'white', fontWeight: 'medium', fontSize: 15,
                                                    backgroundColor: '#4011FA50', fontFamily: 'inter'
                                                }}>
                                                Continue
                                            </Button>
                                        }
                                    </div>
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
                            Enter all Credientials.
                        </Alert>
                    </Snackbar>
                </div>

                {/*<div>
            <img src="/assets/logo2.png" style={{ height: 'auto', width: '100%', maxWidth: '440px', resize: ' cover' }} />
  </div>*/}
            </div>
        </div>
    )
}

export default Page
