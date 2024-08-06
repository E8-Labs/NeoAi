import React, { useEffect, useState } from 'react'
import Apis from '../Apis/Apis';
import axios from 'axios';
import { Box, Link } from '@mui/material';
import { usePathname } from 'next/navigation';

const GetProjects = () => {

    const [myProjects, setMyProjects] = useState([]);
    const [focusedLink, setFocusedLink] = useState(null);
    const [noProject, setNoProject] = useState(false);

    const getProjects = async () => {
        try {
            // setMyProjectsLoader(true)
            // const ApiPath = "http://localhost:8005/api/chat/get_projects";
            const P2 = Apis.GetProjects
            const LSD = localStorage.getItem('User');
            const localStorageData = JSON.parse(LSD);
            console.log('Data from localstorage fopr get project is :', localStorageData);
            const AuthToken = localStorageData.data.token;
            console.log('Auth token is', AuthToken);
            const response = await axios.get(P2, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + AuthToken
                }
            });
            console.log("auht working")
            if (response) {
                console.log('Response on navbar is', response);
            }
            if (response.status === 200) {
                console.log('Response of api on navbar screen is is', response.data);
                setMyProjects(response.data.data)
                if (response.data.data.length === 0) {
                    setNoProject(true)
                }
                if (response.data.data === null) {
                    setNoProject(true)
                }
            } else if (!response.status === 200) {
                console.log('Response is not ok due to:', response);
            }
        } catch (error) {
            console.log('error occured is', error);
        } finally {
            // setMyProjectsLoader(false)
        }
    };

    useEffect(() => {
        getProjects();
    }, []);

    useEffect(() => {
        const handleApiSuccess = (event) => {
            console.log("event call working");
            getProjects();
        };

        document.addEventListener('apiSuccess', handleApiSuccess);

        // Cleanup listener on component unmount
        return () => {
            document.removeEventListener('apiSuccess', handleApiSuccess);
        };
    }, []);

    const handleLinkClick = (item) => {
        console.log('ITem data sending is', item);
        localStorage.setItem('projectDetails', JSON.stringify(item));
    };

    const handleFocusClick = (id) => {
        setFocusedLink(id);
    }

    const handleBlurClick = () => {
        setFocusedLink(null);
    }

    return (
        <div>
            <div className='text-white' style={{ maxHeight: '40vh', overflow: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {myProjects ?
                    <div>
                        {
                            myProjects.map((item) => (
                                <div key={item.id} className='w-full flex flex-row items-center mt-6'
                                    style={{ backgroundColor: '#ffffff20', borderRadius: 3 }}>
                                    <Link sx={{ textDecoration: 'none' }}
                                        className='w-9/12 text-white items-start p-3'
                                        href={`/chat/${item.chat.id}`}>
                                        {/* <button className='w-full text-start text-white'> */}
                                        <Box
                                            sx={{ textDecoration: 'none' }}
                                            className='w-full text-white items-start'
                                            onClick={() => handleLinkClick(item)}
                                        >
                                            {item.projectName ? item.projectName : "App Name"}
                                        </Box>
                                        {/* </button> */}
                                    </Link>
                                    <div className='w-3/12 p-3 flex justify-end'>
                                        <button>
                                            <img src='/assets/edit.png' alt='edit' style={{ height: '28px', width: '28px', resize: 'cover', objectFit: 'cover' }} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        }
                    </div> :
                    <div>
                        No Projects
                    </div>}
                {
                    noProject &&
                    <div className='mt-4' style={{ fontWeight: "500", fontSize: 12, fontFamily: "inter" }}>
                        No Project
                    </div>
                }
            </div>
        </div>
    )
}

export default GetProjects