import {read,write} from '../modules/local-storage.js';

class teachersComponent extends HTMLElement {
    constructor(){
        super();
    }
    connectedCallback(){
        this.render();
    }
    render(){
        let teachers=read('teachers');
        let teacherCard = '';
        for(let i=0;i<teachers.length;i++){
            teacherCard+=/*html*/`
            <div class="teacher-card">
                <p><strong>Nombre:</strong> ${teachers[i].name}</p>
                <p><strong>Email:</strong> ${teachers[i].email}</p>
                <p><strong>Asignatura:</strong> ${teachers[i].subject}</p>
                <img src="${teachers[i].img}" alt="Foto de ${teachers[i].name}" width="100">
                <p><strong>Estatus:</strong> ${teachers[i].status}</p>
                <p><strong>Asignatura:</strong> ${teachers[i].area}</p>
                <button class="edit-teacher" data-index="${i}">Editar</button>
                <button class="delete-teacher" data-index="${i}">Eliminar</button>
            </div>
            `;
        }
        this.innerHTML = teacherCard;
        this.addEventListeners();
    }
    openCreateModal() {
        const teachers = read('teachers');
        const modal = document.createElement('div');
        modal.style.cssText = `
            position:fixed; top:0; left:0; width:100%; height:100%;
            background:rgba(0,0,0,0.5); display:flex; align-items:center;
            justify-content:center; z-index:1000;
        `;
        modal.innerHTML = /*html*/`
            <form id="create-teacher-form" style="
                background:#fff; padding:20px; border-radius:8px;
                width:90%; max-width:400px; box-shadow:0 4px 12px rgba(0,0,0,0.2);
            ">
                <h3>Crear Nuevo Profesor</h3>
                <label>Nombre</label>
                <input type="text" name="name" required>
                <label>Email</label>
                <input type="text" name="email" required>
                <label>Código</label>
                <input type="text" name="code" required>
                <label>Estatus</label>
                <input type="text" name="status" required>
                <label>Área (Asignatura)</label>
                <input type="text" name="area" required>
                <label>Imagen (URL)</label>
                <input type="text" name="img" required>
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
            const creareform = new FormData(form);
            const newTeacher = {
                name: creareform.get('name'),
                email: creareform.get('email'),
                code: creareform.get('code'),
                status: creareform.get('status'),
                img: creareform.get('img'),
                subject: creareform.get('area')
            };
    
            teachers.push(newTeacher);
            write('teachers', teachers);
            closeModal();
            this.render();  
        });
        modal.addEventListener('click', e => {
            if (e.target === modal) closeModal();
        });
    }
    addEventListeners(){
        const deleteButtons=this.querySelectorAll('.delete-teacher');
        const editButtons=this.querySelectorAll('.edit-teacher');
        deleteButtons.forEach(button=>{
            button.addEventListener('click',(e)=>{
                const index=e.target.getAttribute('data-index');
                let teachers=read('teachers');
                teachers.splice(index,1);
                write('teachers',teachers);
                this.render();
            });
        });

        editButtons.forEach(button=>{
            button.addEventListener('click',(e)=>{
                const index=e.target.getAttribute('data-index');
                let teachermodify=read('teachers');
                const modal=document.createElement('div');
                modal.style.cssText=`
                position:fixed; top:0; left:0; width:100%; height:100%;
                background:rgba(0,0,0,0.5); display:flex; align-items:center;
                justify-content:center; z-index:1000;
                `;
                modal.innerHTML=/*html*/`
                <form id="modify-teacher-form">
                <label for="name">Nombre</label>
                <input type="text" id="name" name="name" value="${teachermodify[index].name}"required>
                <label for="email">Email</label>
                <input type="text" id="email" name="email" value="${teachermodify[index].email}" required>
                <label for="code">Codigo</label>
                <input type="text" id="code" name="code" value="${teachermodify[index].code}" required>
                <label for="status">Estatus</label>
                <input type="text" id="status" name="status" value="${teachermodify[index].status}" required>
                <label for="area">Area</label>
                <input type="text" id="area" name="area" value="${teachermodify[index].area}" required>
                <label for="img">Imagen</label>
                <input type="text" id="img" name="img" value="${teachermodify[index].img}" required>
                <button type="submit">Guardar</button>
                <button class="cancel">Cancelar</button>
                </form>`;
                document.body.appendChild(modal);
                const formmodify=modal.querySelector('#modify-teacher-form');
                const cancel=modal.querySelector('.cancel'); 
                cancel.addEventListener('click', () => {
                    document.body.removeChild(modal);
                });
                formmodify.addEventListener('submit', ev => {
                    ev.preventDefault();
                    const formData = new FormData(formmodify);
        
                    teachermodify[index] = {
                        name   : formData.get('name'),
                        email  : formData.get('email'),
                        code   : formData.get('code'),
                        status : formData.get('status'),
                        img    : formData.get('img'),
                        subject: formData.get('area')         
                    };
        
                    write('teachers', teachermodify);
                    document.body.removeChild(modal);
                    this.render(); 
                });
            });
        });
        const createBtn = this.closest('.dashboard')?.querySelector('.tCreate');
        if (createBtn) {
            createBtn.addEventListener('click', () => {
                this.openCreateModal();
            });
        }
    }
}

customElements.define('teachers-app',teachersComponent);