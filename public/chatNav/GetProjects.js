import React, { useEffect, useState } from 'react'
import Apis from '../Apis/Apis';
import axios from 'axios';
import { Box, CircularProgress, Link } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { color } from 'framer-motion';

const GetProjects = () => {

    const [myProjects, setMyProjects] = useState([]);
    const [focusedLink, setFocusedLink] = useState(null);
    const [noProject, setNoProject] = useState(false);
    const [loader, setLoader] = useState(false);
    const [storedId, setStoredId] = useState(null);
    const [isHovered, setIsHovered] = useState(null);

    const getProjects = async () => {
        try {
            setLoader(true);
            const recentProjectStatus = localStorage.getItem("recenProjectStatus");
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
                console.log('Response of api on navbar screen is is', response.data.data);
                setMyProjects(response.data.data)


                if (response.data.data.length === 0) {
                    setNoProject(true)
                }
                if (response.data.data === null) {
                    setNoProject(true)
                }

                if (response.data.data) {
                    console.log("Recent project created", response.data.data[0]);
                    if (recentProjectStatus) {
                        const pStatus = JSON.parse(recentProjectStatus);
                        const recentProject = response.data.data[0];
                        localStorage.setItem('projectDetails', JSON.stringify(recentProject));
                        router.push(`/chat/${recentProject.chat.id}`);
                    }
                }

            } else if (!response.status === 200) {
                console.log('Response is not ok due to:', response);
            }
        } catch (error) {
            console.log('error occured is', error);
        } finally {
            setLoader(false);
            localStorage.removeItem("recenProjectStatus");
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

    const router = useRouter();
    const handleLinkClick = (item) => {
        // const event = new CustomEvent("selectedProject", { detail: item });
        // window.dispatchEvent(event);
        console.log('ITem data sending is', item);
        localStorage.setItem('projectDetails', JSON.stringify(item));
        router.push(`/chat/${item.chat.id}`);
    };

    useEffect(() => {

        const Data = localStorage.getItem('projectDetails');
        if (Data) {
            const LocalData = JSON.parse(Data);
            const StoredId = LocalData.id;
            setStoredId(StoredId)
            console.log("Data of project", LocalData.id);
        }
        // else {
        //     const LocalData = localStorage.getItem('NewProject');
        //     if (LocalData) {
        //         const Data = JSON.parse(LocalData);
        //         console.log("Data of local", Data.data.id);
        //         setStoredId(Data.data.id)
        //     }
        // }

    }, [handleLinkClick])

    return (
        <div>
            <div className='text-white' style={{ maxHeight: '40vh', overflow: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {
                    loader ?
                        <div className='ms-6'>
                            <CircularProgress size={20} />
                        </div> :
                        <div>
                            {myProjects ?
                                <div>
                                    {
                                        myProjects.map((item) => (
                                            <div key={item.id} className='w-full flex flex-row items-center'
                                                style={{
                                                    backgroundColor: item.id === isHovered
                                                        ? '#ffffff20'
                                                        : item.id === storedId
                                                            ? '#ffffff20'
                                                            : "transparent",
                                                    height: item.id === isHovered ?
                                                        30 : item.id === storedId ? 30 : "",
                                                    borderRadius: 3,
                                                    marginTop: 7,
                                                    paddingInlineStart: 10,
                                                }}
                                                onMouseEnter={() => setIsHovered(item.id)}
                                                onMouseLeave={() => setIsHovered(null)}>
                                                <Link
                                                    sx={{
                                                        textDecoration: 'none',
                                                        fontWeight: item.id === isHovered ? "500" : item.id === storedId ? '500' : "400",
                                                        fontSize: item.id === isHovered ? 16 : item.id === storedId ? 16 : 13,
                                                        fontFamily: "inter"
                                                    }}
                                                    className='w-full items-start p-2'
                                                    href={`/chat/${item.chat.id}`}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleLinkClick(item);
                                                    }}
                                                    onMouseEnter={() => setIsHovered(item.id)}
                                                    onMouseLeave={() => setIsHovered(null)}
                                                >
                                                    <Box
                                                        sx={{ textDecoration: 'none' }}
                                                        className='w-full items-start'
                                                        style={{
                                                            color: "white"
                                                        }}
                                                    >
                                                        {item.projectName ? item.projectName : "App Name"}
                                                    </Box>
                                                </Link>
                                            </div>
                                        ))
                                    }
                                </div> :
                                <div>
                                    No Projects
                                </div>}
                        </div>
                }
                {
                    noProject &&
                    <div className='mt-4' style={{ fontWeight: "500", fontSize: 12, fontFamily: "inter" }}>
                        No Project
                    </div>
                }
            </div>
        </div >
    )
}

export default GetProjects