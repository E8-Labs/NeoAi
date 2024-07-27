import React, { useEffect, useState } from 'react'
import Apis from '../Apis/Apis';


const GetProjects = () => {

    const [myProjects, setMyProjects] = useState([]);

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
            if (response) {
                console.log('Response on navbar is', response);
            }
            if (response.status === 200) {
                console.log('Response of api on navbar screen is is', response.data);
                setMyProjects(response.data.data)
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

    return (
        <div>
            <div className='text-white'>gejksdhf00</div>
            <div style={{ maxHeight: '40vh', overflow: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {myProjects ?
                    <div>
                        {
                            myProjects.map((item) => (
                                <div key={item.id} className='w-full flex flex-row items-center mt-6' style={{ backgroundColor: '#ffffff20', borderRadius: 3 }}>
                                    {/* <Link className='w-8/12 items-start p-3' href={`/chat/${item.chat.id}`} passHref> */}
                                    <button className='w-full text-start text-white'>
                                        {item.projectName ? item.projectName : "App Name"}
                                    </button>
                                    {/* </Link> */}
                                    <div className='w-4/12 p-3 flex justify-end'>
                                        <button onClick={handleOpenEditproject}>
                                            <img src='/assets/edit.png' alt='edit' style={{ height: '28px', width: '28px', resize: 'cover', objectFit: 'cover' }} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        }
                    </div> :
                    <div>
                        hello
                    </div>}
            </div>
        </div>
    )
}

export default GetProjects