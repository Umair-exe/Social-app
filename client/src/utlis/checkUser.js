export const checkUser = () => {
    return localStorage.getItem('access_token') ? true : false;
}