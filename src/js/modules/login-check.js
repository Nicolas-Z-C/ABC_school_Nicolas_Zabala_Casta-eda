
const session=sessionStorage.getItem('login');

if(!session || session !== 'true'){
    window.location.href='login.html';
}