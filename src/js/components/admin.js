import {read} from '../modules/local-storage.js';

class AdminComponent extends HTMLElement {
    constructor(){
        super();
    }
    connectedCallback(){
        this.render();
    }
    coursesquantity(){
        let courses=read('courses');
        return courses.length;
    }
    teachersquantity(){
        let teachers=read('teachers');
        return teachers.length;
    }
    render(){
    this.innerHTML=/*html*/`
        <h2>Panel de Administrador</h2>
        <p>Bienvenido al panel de administración.</p>
        <section class="admin-panel">
        <div class="admin-actions"></div>
            <button id="manage-teachers">Gestionar Profesores</button>
            <button id="manage-courses">gestionar cursos</button>
            <button id="add-admin">Agregar un nuevo administrador</button>
        </div>
        <div class="admin-data">
            <h3>Datos Actuales</h3>
            <p><strong>Número de Profesores:</strong> ${this.teachersquantity()}</p>
            <p><strong>Número de Cursos:</strong> ${this.coursesquantity()}</p>
        </div>
        </section>
    `;
    this.addEventListeners();
    }
    openCreateModal() { 
        const admins = read('admins');
        const modal = document.createElement('div');
        modal.style.cssText = `
            position:fixed; top:0; left:0; width:100%; height:100%;
            background:rgba(0,0,0,0.5); display:flex; align-items:center;
            justify-content:center; z-index:1000;
        `;
        modal.innerHTML = /*html*/`
            <form id="create-admin-form" style="
                background:#fff; padding:20px; border-radius:8px;
                width:90%; max-width:400px; box-shadow:0 4px 12px rgba(0,0,0,0.2);
            ">
                <h3>Crear nuevo administrador</h3>
                <label>Nombre</label>
                <input type="text" name="name" required>
                <label>Email</label>
                <input type="text" name="email" required>
                <label>Telefono</label>
                <input type="text" name="phone" required>
                <label>Contraseña</label>
                <input type="text" name="password" required>
                <label>Role</label>
                <input type="text" name="role" required>
                <div style="margin-top:15px; display:flex; gap:10px; justify-content:flex-end;">
                    <button type="button" class="cancel">Cancelar</button>
                    <button type="submit">Crear</button>
                </div>
            </form>
        `;
        document.body.appendChild(modal);
        const form = modal.querySelector('#create-teacher-form');
        const cancel = modal.querySelector('.cancel');
        const closeModal = () => {
            if (document.body.contains(modal)) {
                document.body.removeChild(modal);
            }
        };
        cancel.addEventListener('click', closeModal);
        form.addEventListener('submit', e => {
            e.preventDefault();
            const createform = new FormData(form);
            const newAdmin = {
                name: createform.get('name'),
                email: createform.get('email'),
                code: createform.get('code'),
                status: createform.get('status'),
                img: createform.get('img'),
                subject: createform.get('area')
            };
    
            admins.push(newAdmin);
            write('teachers', admins);
            closeModal();
            this.render();  
        });
        modal.addEventListener('click', e => {
            if (e.target === modal) closeModal();
        });
    }
    addEventListeners(){
        const manageTeachersBtn=this.querySelector('#manage-teachers');
        const manageCoursesBtn=this.querySelector('#manage-courses');
        const addAdminBtn=this.querySelector('#add-admin');
        manageTeachersBtn.addEventListener('click',()=>{
            window.location.href='profesores.html';
        });
        manageCoursesBtn.addEventListener('click',()=>{
            window.location.href='cursos.html';
        });
        addAdminBtn.addEventListener('click',()=>{
            this.openCreateModal();;
        });
    }
}

customElements.define('admin-app',AdminComponent);



