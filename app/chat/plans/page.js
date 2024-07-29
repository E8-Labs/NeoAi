'use client'
import Notifications from '@/public/assets/notifications/Notifications';
import ChoosePlan from '@/public/ui/ChoosePlan'
import { Box, Drawer, Slide, Snackbar } from '@mui/material';
import React, { useState } from 'react'

const Page = () => {

  const [openSideNav, setOpenSideNav] = useState(false);
  const openSideBar = () => {
    setOpenSideNav(true);
  }

  const closeSideNav = () => {
    setOpenSideNav(false);
  }

  return (
    <div style={{ backgroundColor: "#050221", color: "white" }}>
      <div className='px-4 mt-6 flex flex-row justify-between'>
        <div>
          Subscribe Plans
        </div>
        <button onClick={openSideBar}>
          <img src='/assets/notification.png' alt='notify' style={{ height: "18px", width: "20px", resize: 'cover', objectFit: 'contain' }} />
        </button>
      </div>
      <ChoosePlan />

      {/* code for natification */}

      {/* <Snackbar
        className='w-3/12' style={{ backgroundColor: "green", padding: 0, margin: 0 }}
        open={openSideNav}
        // autoHideDuration={3000}
        onClose={() => setOpenSideNav(false)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        TransitionComponent={Slide}
        TransitionProps={{
          direction: 'left'
        }}>
        <Box sx={{ height: "full", backgroundColor: "red" }}>
          <div>
            Notifications
          </div>
        </Box>
      </Snackbar> */}

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