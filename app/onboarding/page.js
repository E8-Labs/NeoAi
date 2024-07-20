'use client'
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Snackbar from '@mui/material/Snackbar';
import { Alert } from '@mui/material';
import Slide from '@mui/material/Slide';
import React from 'react'

const Page = () => {

    const router = useRouter('');
    const [appIdea, setAppIdea] = useState('');
    const [showError, setShowError] = useState(false);

    const handleClose = () => {
        setShowError(false);
    }

    const handleContinueClick = () => {
        if (appIdea.length !== 0) {
            localStorage.setItem('createProject', JSON.stringify(appIdea));
            router.push('/onboarding/audience');
        } else {
            setShowError(true);
        }
    }

    useEffect(() => {
        console.log('App idea of user is :', appIdea);
    }, [appIdea]);

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
                    <div className="w-full flex flex-row">
                        {/* Code for onboarding */}
                        <div className="flex items-center w-6/12">
                            <div className="w-8/12"
                                style={{ padding: 22, backgroundColor: '#0F0C2D' }}>
                                <p className="font-semibold" style={{ color: '#2548FD', fontSize: 10, fontFamily: 'inter' }}>
                                    ONBOARDING
                                </p>
                                <p className="mt-4" style={{ fontSize: 24, fontWeight: '600', fontFamily: 'inter' }}>
                                    What’s your app idea about
                                </p>
                                <div className="flex justify-center">
                                    <textarea
                                        rows={4}
                                        value={appIdea}
                                        onChange={(e) => setAppIdea(e.target.value)}
                                        className="mt-4 w-11/12"
                                        style={{
                                            outline: 'none', border: 'none', backgroundColor: '#00000000',
                                            fontWeight: '400', fontSize: 13, resize: 'none', fontFamily: 'inter'
                                        }}
                                        placeholder="Type here" />
                                </div>
                                <div style={{ height: '1px', backgroundColor: '#ffffff', marginTop: 15 }} />
                                <p className="mt-4" style={{ fontWeight: '400', fontSize: 11, fontFamily: 'inter' }}>
                                    By submitting, I consent to Hebbia is communications and
                                    acknowledge my data will be handled per their Privacy Policy.*
                                </p>
                                {appIdea ?
                                    <Button
                                        onClick={handleContinueClick}
                                        className="p-3 py-4"
                                        style={{
                                            height: '40px', color: 'white', fontWeight: 'medium', fontSize: 15,
                                            backgroundColor: '#4011FA', fontFamily: 'inter', marginTop: 20
                                        }}>
                                        Continue
                                    </Button> :
                                    <Button variant="disabled"
                                        onClick={handleContinueClick}
                                        className="p-3 py-4"
                                        style={{
                                            height: '40px', color: 'white', fontWeight: 'medium', fontSize: 15,
                                            backgroundColor: '#4011FA50', fontFamily: 'inter', marginTop: 20
                                        }}>
                                        Continue
                                    </Button>
                                }
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
                            Add your app idea.
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
