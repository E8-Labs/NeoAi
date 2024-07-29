'use client'
import React, { useState } from 'react';


const Notifications = ({ closeNav }) => {

    const [allNot, setAllNot] = useState(true);
    const [unreadNot, setUnreadNot] = useState(false);

    const handleAllNotclick = () => {
        setUnreadNot(false);
        setAllNot(true);
    }

    const handleUnReadNot = () => {
        setAllNot(false);
        setUnreadNot(true);
    }

    return (
        <div>
            <div className='flex flex-row justify-between items-center'>
                <div style={{ fontWeight: "500", fontFamily: "inter", fontSize: 20 }}>
                    Notifications
                </div>
                <button onClick={() => closeNav()}>
                    <img src='/assets/cross2.png' alt='cross' style={{ height: "16px", width: "16px", resize: "cover", objectFit: "cover" }} />
                </button>
            </div>
            <div className='flex flex-row w-full gap-6 mt-6'>
                <button className='flex flex-row justify-between' onClick={handleAllNotclick} style={{ borderBottom: allNot ? "4px solid white" : "", width: "75px" }}>
                    <p>
                        All
                    </p>
                    <div style={{ height: "22px", width: "22px", borderRadius: 3, backgroundColor: "#4011FA" }}>
                        12
                    </div>
                </button>
                <button className='flex flex-row justify-between' onClick={handleUnReadNot} style={{ borderBottom: unreadNot ? "4px solid white" : "", width: "99px" }}>
                    <p>
                        Unread
                    </p>
                    <div style={{ height: "22px", width: "22px", borderRadius: 3, backgroundColor: "#4011FA" }}>
                        12
                    </div>
                </button>
            </div>

            {
                allNot &&
                <div>
                    <div
                        className='mt-6'
                        style={{ fontWeight: "500", fontSize: 15, fontFamily: "inter" }}>
                        Notification message
                    </div>
                    <div
                        className='mt-4'
                        style={{ fontWeight: "400", fontSize: 12, fontFamily: "inter", color: 'grey' }}>
                        3days ago
                    </div>
                    <button
                        className='mt-4'
                        style={{
                            backgroundColor: "#4011FA", padding: 8, fontSize: 13,
                            fontWeight: "500", fontSize: 13, fontFamily: 'inter', borderRadius: 6
                        }}>
                        Action
                    </button>
                    <div
                        className='mt-6'
                        style={{ fontWeight: "500", fontSize: 15, fontFamily: "inter" }}>
                        2nd notification message
                    </div>
                    <div
                        className='mt-4'
                        style={{ fontWeight: "400", fontSize: 12, fontFamily: "inter", color: 'grey' }}>
                        3days ago
                    </div>
                    <div
                        className='mt-6'
                        style={{ fontWeight: "500", fontSize: 15, fontFamily: "inter" }}>
                        3rd notification message
                    </div>
                    <div
                        className='mt-4'
                        style={{ fontWeight: "400", fontSize: 12, fontFamily: "inter", color: 'grey' }}>
                        3days ago
                    </div>
                </div>
            }

        </div>
    )
}

export default Notifications