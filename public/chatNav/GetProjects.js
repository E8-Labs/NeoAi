import React, { useEffect, useState } from 'react'
import Apis from '../Apis/Apis';
import axios from 'axios';
import { Box, CircularProgress, Link } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';

const GetProjects = () => {

    const [myProjects, setMyProjects] = useState([]);
    const [focusedLink, setFocusedLink] = useState(null);
    const [noProject, setNoProject] = useState(false);
    const [loader, setLoader] = useState(false);
    const [storedId, setStoredId] = useState(null);

    const getProjects = async () => {
        try {
            setLoader(true);
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
            } else if (!response.status === 200) {
                console.log('Response is not ok due to:', response);
            }
        } catch (error) {
            console.log('error occured is', error);
        } finally {
            setLoader(false)
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
        } else {
            const LocalData = localStorage.getItem('NewProject');
            if (LocalData) {
                const Data = JSON.parse(LocalData);
                console.log("Data of local", Data.data.id);
                setStoredId(Data.data.id)
            }
        }

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
                                                style={{ backgroundColor: item.id === storedId ? '#ffffff20' : "transparent", borderRadius: 3, marginTop: 7, paddingInlineStart: 10 }}>
                                                <Link
                                                    sx={{ textDecoration: 'none', fontWeight: "400", fontSize: 13, fontFamily: "inter" }}
                                                    className='w-full items-start p-2'
                                                    href={`/chat/${item.chat.id}`}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleLinkClick(item);
                                                    }}
                                                >
                                                    <Box
                                                        sx={{ textDecoration: 'none' }}
                                                        className='w-full text-white items-start'
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
        </div>
    )
}

export default GetProjects