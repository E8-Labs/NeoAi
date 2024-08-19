'use client'
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Snackbar from '@mui/material/Snackbar';
import { Alert } from '@mui/material';
import Slide from '@mui/material/Slide';
import React from 'react'
import AnimatedForm from "@/public/assets/animation/animation";

const Page = () => {

    const router = useRouter('');

    const [appIdea, setAppIdea] = useState('');
    const [showError, setShowError] = useState(false);

    const handleClose = () => {
        setShowError(false);
    }

    useEffect(() => {
        const Data = localStorage.getItem('AppScreen');
        if (Data) {
            const LocalData = localStorage.getItem('User');
            const UserData = JSON.parse(LocalData)
            if (UserData) {
                router.push('/chat')
            }
        } else {
            // const LD = JSON.parse(Data)
            // console.log('Data present', LD);
        }
    }, []);

    return (
        <div className="flex justify-center" style={{ color: 'white', height: "94vh", overflow: "hidden" }}>
            <div className="w-11/12">
                <div className="flex justify-between mt-8">
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
                            <div className="w-9/12"
                                style={{ padding: 22, backgroundColor: '#0F0C2D' }}>
                                <AnimatedForm />
                            </div>
                        </div>
                        {/* Code for logo3 */}
                        <div className="lg:flex hidden flex justify-end w-6/12" style={{}}>
                            <img src="/assets/logo3.png" alt="globe" style={{ objectFit: 'cover', resize: "cover" }} />
                        </div>
                    </div>
                </div>
                <div className="flex justify-between">
                    {/* <div>hi</div> */}
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

            </div>
        </div>
    )
}

export default Page
