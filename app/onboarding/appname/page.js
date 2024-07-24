'use client'
import { Button, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Snackbar from '@mui/material/Snackbar';
import { Alert } from '@mui/material';
import Slide from '@mui/material/Slide';
import React from 'react'
import axios from "axios";
import Apis from "@/public/Apis/Apis";

const Page = () => {
    const router = useRouter('');
    const [appName, setAppName] = useState('');
    const [showError, setShowError] = useState(false);
    const [loader, setloader] = useState(false);
    const [appIdea, setAppIdea] = useState('');
    const [audienceName, setAudienceName] = useState("");

    const handleClose = () => {
        setShowError(false);
    }

    useEffect(() => {
        const D = localStorage.getItem('createProject');
        const localStorageData = JSON.parse(D);
        console.log('Data from local storage is', localStorageData);
    }, []);

    useEffect(() => {
        const D = localStorage.getItem('createProject');
        const localStorageData = JSON.parse(D);
        setAppIdea(localStorageData.appidea);
        setAudienceName(localStorageData.audeincename);
    }, []);

    const CreateProject1 = {
        appidea: appIdea,
        audeincename: audienceName,
        appName: appName
    }

    const handleContinueClick = async () => {
        if (appName.length !== 0) {
            // try {
            //     setloader(true);
            //     const D = localStorage.getItem('createProject');
            //     const localStorageData = JSON.parse(D);
            //     const appIdea = localStorageData.appidea;
            //     const audienceName = localStorageData.audeincename;
            //     const LSD = localStorage.getItem('User');
            //     const localStorageData2 = JSON.parse(LSD);
            //     console.log('Data2 from localstorage is :', localStorageData2);
            //     const AuthToken = localStorageData2.data.token;
            //     const data = {
            //         appIdea: appIdea,
            //         targettedAudience: audienceName,
            //         projectName: appName
            //     }
            //     console.log('Data is', data);
            //     const response = await axios.post(Apis.CreateProject, {
            //         appIdea: appIdea,
            //         targettedAudience: audienceName,
            //         projectName: appName
            //     }, {
            //         headers: {
            //             'Content-Type': 'application/json',
            //             'Authorization': 'Bearer ' + AuthToken
            //         }
            //     });

            //     if (response.status === 200) {
            //         const Result = response.data;
            //         localStorage.setItem('NewProject', JSON.stringify(Result));
            //         console.log('Response of API is:', Result);
            //         router.push('/chat');
            //         // router.push('/onboarding/founders');
            //     } else {
            //         console.log('Response is not ok', response);
            //     }
            // } catch (error) {
            //     console.log('Error occurred:', error);
            // } finally {
            //     setloader(false);
            // }

            localStorage.setItem('createProject', JSON.stringify(CreateProject1));
            router.push('/onboarding/founders');
        } else {
            setShowError(true);
        }
    }

    const handleBackClick = () => {
        router.push('/onboarding/audience')
    }

    // useEffect(() => {
    //     console.log('App name is :', appName);
    // }, [appName])
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
                                    What is your app name
                                </p>
                                <div className="flex justify-center">
                                    <textarea
                                        rows={4}
                                        value={appName}
                                        onChange={(e) => setAppName(e.target.value)}
                                        className="mt-4 w-11/12"
                                        style={{
                                            outline: 'none', border: 'none', backgroundColor: '#00000000',
                                            fontWeight: '400', fontSize: 13, resize: 'none', fontFamily: 'inter'
                                        }}
                                        placeholder="Type here" />
                                </div>
                                <div className="flex flex-col gap-y-24">
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
                                        {appName ? <Button
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
                                        </div> */}
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
                            Add your app name.
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
