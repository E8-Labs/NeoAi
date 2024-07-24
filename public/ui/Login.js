'use client'
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import React from 'react';

const Login = () => {

    const Router = useRouter();

    const handleLogin = () => {
        Router.push('/auth/signin')
    }

    return (
        <div className="flex flex-row gap-2 items-center text-white">
            Already have an account ?
            <Button sx={{
                textTransform: 'none',
                fontSize: 14,
                fontWeight: "500",
                fontFamily: 'inter',
                width: "auto",
                backgroundColor: '#4011FA50'
            }} onClick={handleLogin}>
                Login
            </Button>
        </div>
    )
}

export default Login
