const BasePath= 'http://localhost:8005/'//'https://www.blindcircle.com:444/neo/';
// const BasePath='192.168.10.2:8005/';

const Apis = {
    Login: `${BasePath}api/user/login`,
    SendMessage: `${BasePath}api/chat/send_message`,
    CreateProject: `${BasePath}api/chat/create_project`,
    GetProjects: `${BasePath}api/chat/get_projects`,
    GetMessages: `${BasePath}api/chat/get_messages`,
    AddTeamMember: `${BasePath}api/user/invite_user`,
    GetTeamMembers: `${BasePath}api/user/my_team`
}

export default Apis;