import {read,write} from '../modules/local-storage.js';

let admin=[{
    email:"admin@test",
    password:"test"
}]
write('admins',admin);
class Login extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback(){
        this.render();
    }
    render() {
        this.innerHTML = /*html*/`
        <h2>Login Administrador</h2>
        <form id="login-form">
            <label for="email">Email:</label>
            <input type="text" id="email" name="email" required>
            <label for="password">Contraseña:</label>
            <input type="password" id="password" name="password" required>
            <button type="submit">Login</button>
        </form>
        `;
        this.addEventListeners();
    }
    addEventListeners() {
        const form=this.querySelector('#login-form');
        form.addEventListener('submit',(e)=>{
            e.preventDefault();
            const email=form.email.value;
            const password=form.password.value;
            const users=read('admins');
            const userFound=users.find(user=>user.email===email && user.password===password);
            if(userFound){
                sessionStorage.setItem('login','true');
                write('currentUser',userFound);
                window.location.href='admin.html';
            }else{
                alert('Credenciales incorrectas');
            }
        });
    }
}

customElements.define('login-app', Login);