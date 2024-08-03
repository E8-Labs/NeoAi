'use client'
import { Button, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Snackbar from '@mui/material/Snackbar';
import { Alert } from '@mui/material';
import Slide from '@mui/material/Slide';
import React from 'react'
import Apis from "@/public/Apis/Apis";

const Page = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showError, setShowError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loginLoader, setLoginLoader] = useState(false);
    const [inviteId, setInviteId] = useState('');
    const [height, setHeight] = useState('100vh');

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const inviteIdFromUrl = urlParams.get('inviteId');
        if (inviteIdFromUrl) {
            setInviteId(inviteIdFromUrl);
        }
    }, []);

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    useEffect(() => {
        const updateHeight = () => {
            if (window.innerWidth < 768) {
                setHeight('auto');
            } else {
                setHeight('100vh');
            }
        };

        window.addEventListener('resize', updateHeight);
        updateHeight(); // Initial check

        return () => window.removeEventListener('resize', updateHeight);
    }, []);

    const backgroundImage = {
        backgroundImage: 'url("../background.png")',
        backgroundSize: "cover",
        backgroundPosition: 'center',
        width: '100%',
        height: height,
        minHeight: '50vh',
    }

    const handleClose = () => {
        setShowError(false);
    }

    const data = {
        email: email,
        password: password,
    }

    if (inviteId) {
        data.inviteId = inviteId
    }

    console.log("Data sending in  login api is:", data);

    const handleContinueClick = async () => {
        if (email.length !== 0) {
            try {
                setLoginLoader(true);
                const ApiPath = Apis.Login;
                const response = await fetch(ApiPath, {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                if (response.ok) {
                    const ApiResponse = await response.json();
                    console.log('Response of api is :', ApiResponse);
                    if (ApiResponse.status === true) {
                        if (ApiResponse.message === "User logged in") {
                            router.push('/onboarding');
                            localStorage.setItem('User', JSON.stringify(ApiResponse));
                        } else if (ApiResponse.message === "User registered") {
                            // console.log('User not registered');
                            setShowError(true);
                        }
                    }
                } else if (!response.ok) {
                    console.log('Error in signing in is :', response)
                }
            } catch (error) {
                console.error('Error occured is :', error);
            } finally {
                setLoginLoader(false);
            }
        } else {
            // setShowError(true);
        }
    }

    const handleSignin = () => {
        router.push('/auth/signin')
    }

    return (
        <div className="flex justify-center text-white" style={backgroundImage}>
            <div className="w-11/12" style={{ height: "100%", overflowY: "hidden" }}>
                <div className="flex justify-between  lg:mt-16 mt-8">
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
                                    SIGNING UP AS A TEAM MEMBER
                                </p>
                                <p className="mt-4" style={{ fontSize: 24, fontWeight: '600', fontFamily: 'inter' }}>
                                    Sign Up
                                </p>

                                <div className="flex flex-row w-8/12 mt-4 items-center justify-between">
                                    <img src="/assets/applogo.png" alt="applogo"
                                        style={{ height: '28px', width: '28px', resize: 'cover', objectFit: 'cover', borderRadius: 3 }} />
                                    <div style={{ fontSize: 13, fontWeight: '400', fontFamily: 'inter', color: '#ffffff70' }}>
                                        Assigned Project
                                    </div>
                                    <div style={{ fontSize: 13, fontWeight: '400', fontFamily: 'inter', color: '#ffffff' }}>
                                        Wilo App
                                    </div>
                                </div>

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
                                <div className="w-full mt-12 flex flex-row items-center justify-center">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-11/12"
                                        style={{
                                            outline: 'none', border: 'none', backgroundColor: '#00000000',
                                            fontWeight: '400', fontSize: 13, resize: 'none', fontFamily: 'inter'
                                        }}
                                        placeholder="Password" />
                                    <button onClick={handleTogglePassword}>
                                        {showPassword ?
                                            <img src="/assets/showPass.png" alt="showpassword" style={{ height: '17px', width: '17px', resize: 'cover', objectFit: 'cover' }} />
                                            :
                                            <img src="/assets/hidePass.png" alt="showpassword" style={{ height: '20px', width: '20px', resize: 'cover', objectFit: 'cover' }} />
                                        }
                                    </button>
                                </div>
                                <div className="flex flex-col gap-y-20">
                                    <div style={{ height: '1px', backgroundColor: '#ffffff', marginTop: 15 }} />
                                    {
                                        loginLoader ?
                                            <div className="mt-6 ms-6">
                                                <CircularProgress size={30} />
                                            </div> :
                                            <div className="mt-6 flex flex-row gap-8">
                                                {email && password ? <Button
                                                    onClick={handleContinueClick}
                                                    className="p-3 py-6"
                                                    style={{
                                                        height: '40px', color: 'white', fontWeight: 'medium', fontSize: 15,
                                                        backgroundColor: '#4011FA', fontFamily: 'inter'
                                                    }}>
                                                    Create account
                                                </Button> :
                                                    <Button variant="disabled"
                                                        onClick={handleContinueClick}
                                                        className="p-3 py-6"
                                                        style={{
                                                            height: '40px', color: 'white', fontWeight: 'medium', fontSize: 15,
                                                            backgroundColor: '#4011FA50', fontFamily: 'inter'
                                                        }}>
                                                        Create account
                                                    </Button>
                                                }
                                            </div>
                                    }
                                </div>

                                <div className="flex flex-row items-center mt-4">
                                    <div>
                                        Have an account
                                    </div>
                                    <Button onClick={handleSignin} style={{ textTransform: 'none', color: 'white' }}>
                                        <u>
                                            Sign in
                                        </u>
                                    </Button>
                                </div>
                            </div>
                        </div>
                        {/* Code for logo3 */}
                        <div className="lg:flex hidden flex justify-end w-6/12" style={{}}>
                            <img src="/assets/logo3.png" alt="globe" style={{ height: '648px', width: '648px', objectFit: 'cover' }} />
                        </div>
                    </div>
                </div>

                <div className="flex justify-between lg:mt-16 mt-8">
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
                            User registered!! Try again now.
                        </Alert>
                    </Snackbar>

                </div>
            </div>
        </div>
    )
}

export default Page