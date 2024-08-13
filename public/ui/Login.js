'use client'
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const Login = () => {

    const Router = useRouter();
    const [localData, setLocalData] = useState(null);
    const handleLogin = () => {
        Router.push('/auth/signin')
    }

    useEffect(() => {
        const localdata = localStorage.getItem('User');
        if(localdata){
            const Data = JSON.parse(localdata)
            // console.log("Local data is", Data.data);
            setLocalData(Data.data)
        }
    }, [])

    return (
        <div>
            {
                localData ?
                    "" :
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
            }
        </div>
    )
}

export default Login
