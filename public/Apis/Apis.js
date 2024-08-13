const BasePath = 'https://www.blindcircle.com:444/neo/'//'https://www.blindcircle.com:444/neo/' //;'http://localhost:8005/'
// const BasePath='192.168.10.2:8005/';

const Apis = {
    Login: `${BasePath}api/user/login`,
    SendMessage: `${BasePath}api/chat/send_message`,
    CreateProject: `${BasePath}api/chat/create_project`,
    GetProjects: `${BasePath}api/chat/get_projects`,
    GetMessages: `${BasePath}api/chat/get_messages`,
    AddTeamMember: `${BasePath}api/user/invite_user`,
    GetTeamMembers: `${BasePath}api/user/my_team`,
    AddCard: `${BasePath}api/user/add_card`,
    GetCards: `${BasePath}api/user/list_cards`,
    SubscribePlan: `${BasePath}api/user/subscribe`,
    UpdateProject: `${BasePath}api/chat/update_project`,
    UpdateProfile: `${BasePath}api/user/update_profile`,
    GetProfile: `${BasePath}api/user/get_profile`,
    AcceptInvitation: `${BasePath}api/user/handle_invitation`
}

export default Apis;