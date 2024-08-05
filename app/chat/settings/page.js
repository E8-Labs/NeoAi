'use client'
import Notifications from '@/public/assets/notifications/Notifications';
import { Drawer } from '@mui/material';
import React, { useState } from 'react'

const Page = () => {
    //opening side drawer of notifications
    const [openSideNav, setOpenSideNav] = useState(false);
    const openSideBar = () => {
        setOpenSideNav(true);
    }

    const closeSideNav = () => {
        setOpenSideNav(false);
    }
    return (
        <div style={{ height: '100vh', color: 'white', backgroundColor: "#050221" }}>
            <div className='px-4 mt-6 flex w-full text-white flex-row justify-between'>
                <div>
                    Settings
                </div>
                <button onClick={openSideBar}>
                    <img src='/assets/notification.png' alt='notify' style={{ height: "18px", width: "20px", resize: 'cover', objectFit: 'contain' }} />
                </button>
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