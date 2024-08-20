'use client'
import Apis from '@/public/Apis/Apis';
import axios from 'axios';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';


const Notifications = ({ closeNav }) => {

    const [allNot, setAllNot] = useState(true);
    const [unreadNot, setUnreadNot] = useState(false);
    const [getNotificationData, setGetNotificationData] = useState([]);
    const [projectJoinedNotification, setJoinedProjectNotification] = useState(false);

    const getNotifications = async () => {
        try {
            const LocalData = localStorage.getItem('User');
            const D = JSON.parse(LocalData);
            const AuthToken = D.data.token;
            const ApiPath = Apis.GetNotification;
            const response = await axios.get(ApiPath, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + AuthToken
                }
            });
            if (response.data) {
                console.log("Getnotification api response is", response.data);
                setGetNotificationData(response.data.data);
            } else {
                console.error("Error in getnotification response");
            }
        } catch (error) {
            console.error("Error occured in getnotification api", error);
        }
    }

    useEffect(() => {
        getNotifications()
    }, [])

    const handleAllNotclick = () => {
        setUnreadNot(false);
        setAllNot(true);
    }

    const handleUnReadNot = () => {
        setAllNot(false);
        setUnreadNot(true);
    }

    const timestamps = [getNotificationData.createdAt];

    function timeAgo(seconds) {
        const intervals = [
            { label: 'year', seconds: 31536000 },
            { label: 'month', seconds: 2592000 },
            { label: 'week', seconds: 604800 },
            { label: 'day', seconds: 86400 },
            { label: 'hour', seconds: 3600 },
            { label: 'minute', seconds: 60 },
            { label: 'second', seconds: 1 }
        ];

        for (let i = 0; i < intervals.length; i++) {
            const interval = intervals[i];
            const count = Math.floor(seconds / interval.seconds);
            if (count > 0) {
                return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
            }
        }

        return 'just now';
    }

    function formatTimestamps(timestamps) {
        const now = new Date();

        return timestamps.map(timestamp => {
            const createdDate = new Date(timestamp);
            const timeDifference = Math.floor((now - createdDate) / 1000);
            return timeAgo(timeDifference);
        });
    }

    const formattedTimes = formatTimestamps(timestamps);
    console.log("Time when notification created", formattedTimes);


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
                    {/* <div style={{ height: "22px", width: "22px", borderRadius: 3, backgroundColor: "#4011FA" }}>
                        12
                    </div> */}
                </button>
                <button className='flex flex-row justify-between' onClick={handleUnReadNot} style={{ borderBottom: unreadNot ? "4px solid white" : "", width: "99px" }}>
                    <p>
                        Unread
                    </p>
                    {/* <div style={{ height: "22px", width: "22px", borderRadius: 3, backgroundColor: "#4011FA" }}>
                        12
                    </div> */}
                </button>
            </div>

            {
                allNot &&
                <div>
                    {/* <div
                        className='mt-6'
                        style={{ fontWeight: "500", fontSize: 15, fontFamily: "inter" }}>
                        Notification message
                    </div> */}
                    {/* <div
                        className='mt-4'
                        style={{ fontWeight: "400", fontSize: 12, fontFamily: "inter", color: 'grey' }}>
                        3days ago
                    </div> */}
                    {/* <button
                        className='mt-4'
                        style={{
                            backgroundColor: "#4011FA", padding: 8, fontSize: 13,
                            fontWeight: "500", fontSize: 13, fontFamily: 'inter', borderRadius: 6
                        }}>
                        Action
                    </button> */}
                    {
                        getNotificationData.map((item) => (
                            <div key={item.id} className='flex flex-row gap-2 items-center mt-6'>
                                <div>
                                    {
                                        item.from.profile_image ?
                                            <Image source={item.from.profile_image}  height={30} width={30} layout='responsive' style={{ borderRadius: "50%" }} /> :
                                            <div  style={{ borderRadius: "50%" ,backgroundColor: 'red' }} > </div>
                                    }
                                </div>
                                <div
                                    style={{ fontWeight: "500", fontSize: 15, fontFamily: "inter" }}>
                                    {item.notificationType === "ProjectJoined" &&
                                        <div>
                                            {item.from.name ?
                                                <div style={{ fontWeight: "400", fontSize: 13, fontFamily: "inter" }}>
                                                    {item.from.name}
                                                </div> :
                                                <div style={{ fontWeight: "400", fontSize: 13, fontFamily: "inter" }}>
                                                    {item.from.email}
                                                </div>
                                            }
                                        </div>
                                    }
                                </div>
                                <div
                                    style={{ fontWeight: "400", fontSize: 12, fontFamily: "inter", color: 'grey' }}>
                                    joined
                                </div>
                                <div style={{ fontWeight: "400", fontSize: 12, fontFamily: "inter", color: 'grey' }}>
                                    {item.project.projectName}
                                </div>
                            </div>
                        ))
                    }


                </div>
            }

            {
                unreadNot &&
                <div className='text-white mt-4'>
                    No Notification
                </div>
            }

        </div>
    )
}

export default Notifications