import {read,write} from '../modules/local-storage.js';

class Courses extends HTMLElement {
    constructor(){
        super();
    }
    connectedCallback(){
        this.render();
    }
    render(){
        let courses=read('courses');
        let modulesHTML = '';
        if (Array.isArray(c.modules) && c.modules.length > 0) {
            c.modules.forEach(mod => {
                let lessonsHTML = '';
                if (Array.isArray(mod.Lecciones) && mod.Lecciones.length > 0) {
                    mod.Lecciones.forEach(les => {
                        let resourcesHTML = '';
                        if (Array.isArray(les.resources) && les.resources.length > 0) {
                            les.resources.forEach(res => {
                                resourcesHTML += `<li><a href="${res.urlResource}" target="_blank">${res.title}</a></li>`;
                            });
                        }
                        lessonsHTML += `
                            <div style="margin:8px 0 12px 20px; border-left:2px solid #ddd; padding-left:10px;">
                                <strong>${les.name}</strong> (Intensidad: ${les.intensity})<br>
                                <small>${les.content}</small>
                                ${resourcesHTML ? `<ul style="margin:5px 0; padding-left:20px;">${resourcesHTML}</ul>` : ''}
                            </div>`;
                    });
                }
                modulesHTML += `
                    <div style="margin-bottom:15px; padding:10px; background:#f9f9f9; border-radius:6px;">
                        <p><strong>Módulo:</strong> ${mod.name} (${mod.code})</p>
                        <p><em>${mod.description}</em></p>
                        ${lessonsHTML || '<p><em>Sin lecciones</em></p>'}
                    </div>`;
            });
        } else {
            modulesHTML = '<p><em>Sin módulos</em></p>';
        }
        let courseCard='';
        for(let i=0;i<courses.length;i++){
            courseCard+=/*html*/`
            <div class="course-card">
                <p><strong>Nombre del Curso:</strong> ${courses[i].name}</p>
                <p><strong>Código del Curso:</strong> ${courses[i].code}</p>
                <p><strong>Descripción:</strong> ${courses[i].description}</p>
                <p><strong>Profesor:</strong> ${courses[i].teacher}</p>
                <p><strong>Modulos:</strong> ${courses[i].modules} </p>
                <button class="edit-course" data-index="${i}">Editar</button>
                <button class="delete-course" data-index="${i}">Eliminar</button>
            </div>
            `;
        }
        this.innerHTML = courseCard;
        this.addEventListeners();
    }
    openCreateModal() {
    const courses = read('courses');
    const modal = document.createElement('div');
    modal.style.cssText = `
        position:fixed; top:0; left:0; width:100%; height:100%;
        background:rgba(0,0,0,0.5); display:flex; align-items:center;
        justify-content:center; z-index:1000;
    `;
    modal.innerHTML = /*html*/`
        <form id="create-course-form" style="
            background:#fff; padding:20px; border-radius:8px;
            width:90%; max-width:500px; box-shadow:0 4px 12px rgba(0,0,0,0.2);
            max-height:90vh; overflow-y:auto;
        ">
            <h3>Crear Nuevo Curso</h3>
            <label>Nombre</label>
            <input type="text" name="name" required>
            <label>Código</label>
            <input type="text" name="code" required>
            <label>Descripción</label>
            <input type="text" name="description" required>
            <label>Profesor</label>
            <input type="text" name="teacher" required>
            <div id="modules-container">
                <h4 style="margin:15px 0 8px;">Módulos</h4>
                <div class="module-entry">
                    <label>Código Módulo</label>
                    <input type="text" name="moduleCode" required>
                    <label>Nombre Módulo</label>
                    <input type="text" name="moduleName" required>
                    <label>Descripción Módulo</label>
                    <input type="text" name="moduleDescription" required>
                    <div class="lessons-container">
                        <h5 style="margin:10px 0 5px;">Lecciones</h5>
                        <div class="lesson-entry">
                            <label>Nombre Lección</label>
                            <input type="text" name="lessonName" required>
                            <label>Intensidad</label>
                            <input type="text" name="lessonIntensity" required>
                            <label>Contenido</label>
                            <textarea name="lessonContent" rows="2" required></textarea>
                            <div class="resources-container">
                                <h6 style="margin:8px 0 4px;">Recursos</h6>
                                <div class="resource-entry">
                                    <input type="text" name="resourceTitle" placeholder="Título" required>
                                    <input type="url" name="resourceUrl" placeholder="URL" required>
                                    <button type="button" class="remove-resource">X</button>
                                </div>
                                <button type="button" class="add-resource">+ Recurso</button>
                            </div>
                        </div>
                        <button type="button" class="add-lesson">+ Lección</button>
                    </div>
                    <button type="button" class="remove-module">Eliminar Módulo</button>
                </div>
                <button type="button" id="add-module">+ Agregar Módulo</button>
            </div>
            <div style="margin-top:15px; display:flex; gap:10px; justify-content:flex-end;">
                <button type="button" class="cancel">Cancelar</button>
                <button type="submit">Crear</button>
            </div>
        </form>
    `;

    document.body.appendChild(modal);
    const form = modal.querySelector('#create-course-form');
    const cancel = modal.querySelector('.cancel');
    const modulesContainer = modal.querySelector('#modules-container');
    const closeModal = () => {
        if (document.body.contains(modal)) {
            document.body.removeChild(modal);
        }
    };
    cancel.addEventListener('click', closeModal);
    const addModule = () => {
        const moduleEntry = document.createElement('div');
        moduleEntry.className = 'module-entry';
        moduleEntry.innerHTML = modal.querySelector('.module-entry').innerHTML;
        modulesContainer.insertBefore(moduleEntry, modal.querySelector('#add-module'));
        attachModuleHandlers(moduleEntry);
    };
    const attachModuleHandlers = (moduleEl) => {
        moduleEl.querySelector('.add-lesson')?.addEventListener('click', () => {
            const lessonEntry = document.createElement('div');
            lessonEntry.className = 'lesson-entry';
            lessonEntry.innerHTML = moduleEl.querySelector('.lesson-entry').innerHTML;
            moduleEl.querySelector('.lessons-container').insertBefore(lessonEntry, moduleEl.querySelector('.add-lesson'));
            attachLessonHandlers(lessonEntry);
        });
        moduleEl.querySelector('.add-resource')?.addEventListener('click', () => {
            const resEntry = document.createElement('div');
            resEntry.className = 'resource-entry';
            resEntry.innerHTML = `
                <input type="text" name="resourceTitle" placeholder="Título" required>
                <input type="url" name="resourceUrl" placeholder="URL" required>
                <button type="button" class="remove-resource">X</button>
            `;
            const container = moduleEl.querySelector('.resources-container');
            container.insertBefore(resEntry, moduleEl.querySelector('.add-resource'));
            resEntry.querySelector('.remove-resource').addEventListener('click', () => {
                resEntry.remove();
            });
        });

        moduleEl.querySelector('.remove-module')?.addEventListener('click', () => {
            moduleEl.remove();
        });

        moduleEl.querySelectorAll('.remove-resource').forEach(btn => {
            btn.addEventListener('click', () => btn.parentElement.remove());
        });
    };

    const attachLessonHandlers = (lessonEl) => {
        lessonEl.querySelectorAll('.remove-resource').forEach(btn => {
            btn.addEventListener('click', () => btn.parentElement.remove());
        });
    };

    attachModuleHandlers(modal.querySelector('.module-entry'));
    modal.querySelector('#add-module').addEventListener('click', addModule);

    form.addEventListener('submit', e => {
        e.preventDefault();

        const formData = new FormData(form);
        const entries = Object.fromEntries(formData.entries());

        const modules = [];
        const moduleEntries = modal.querySelectorAll('.module-entry');
        moduleEntries.forEach(mod => {
            const modCode = mod.querySelector('[name="moduleCode"]').value.trim();
            const modName = mod.querySelector('[name="moduleName"]').value.trim();
            const modDesc = mod.querySelector('[name="moduleDescription"]').value.trim();

            const lessons = [];
            mod.querySelectorAll('.lesson-entry').forEach(les => {
                const resources = [];
                les.querySelectorAll('.resource-entry').forEach(res => {
                    const title = res.querySelector('[name="resourceTitle"]').value.trim();
                    const url = res.querySelector('[name="resourceUrl"]').value.trim();
                    if (title && url) resources.push({ title, urlResource: url });
                });

                const name = les.querySelector('[name="lessonName"]').value.trim();
                const intensity = les.querySelector('[name="lessonIntensity"]').value.trim();
                const content = les.querySelector('[name="lessonContent"]').value.trim();

                if (name && intensity && content) {
                    lessons.push({ name, intensity, content, resources });
                }
            });

            if (modCode && modName && modDesc && lessons.length > 0) {
                modules.push({ code: modCode, name: modName, description: modDesc, Lecciones: lessons });
            }
        });

        const newCourse = {
            name: entries.name,
            code: entries.code,
            description: entries.description,
            teacher: entries.teacher,
            modules
        };

        courses.push(newCourse);
        write('courses', courses);
        closeModal();
        this.render();
    });

    modal.addEventListener('click', e => {
        if (e.target === modal) closeModal();
    });
}
    addEventListeners(){
        const edit = this.querySelectorAll('.edit-course');
        const deleteB = this.querySelectorAll('.delete-course');

        deleteB.forEach(button=>{
            button.addEventListener('click', (e)=>{
                const index = e.target.getAttribute('data-index');
                let courses=read('courses');
                courses.splice(index,1);
                write('courses', courses);
                this.render();
            });
        });
        edit.forEach(button=>{
            button.addEventListener('click',(e)=>{
                const index=e.target.getAttribute('data-index');
                let coursemodify=read('courses');
                const modal=document.createElement('div');
                modal.style.cssText=`
                position:fixed; top:0; left:0; width:100%; height:100%;
                background:rgba(0,0,0,0.5); display:flex; align-items:center;
                justify-content:center; z-index:1000;
                `;
                modal.innerHTML=/*html*/`
                <form id="modify-course-form">
                <label for="name">Nombre</label>
                <input type="text" id="name" name="name" value="${coursemodify[index].name}"required>
                <label for="code">Codigo</label>
                <input type="text" id="code" name="code" value="${coursemodify[index].code}" required>
                <label for="description">Descripcion</label>
                <input type="text" id="description" name="description" value="${coursemodify[index].description}" required>
                <label for="teacher">Profesor</label>
                <input type="text" id="teacher" name="teacher" value="${coursemodify[index].teacher}" required>
                <label for="modules">Modulos</label>
                <input type="text" id="modules" name="modules" value="${coursemodify[index].modules}" required>
                <button type="submit">Guardar</button>
                <button class="cancel">Cancelar</button>
                </form>`;
                document.body.appendChild(modal);
                const formmodify=modal.querySelector('#modify-course-form');
                const cancel=modal.querySelector('.cancel'); 
                cancel.addEventListener('click', () => {
                    document.body.removeChild(modal);
                });
                formmodify.addEventListener('submit', ev => {
                    ev.preventDefault();
                    const formData = new FormData(formmodify);
        
                    coursemodify[index] = {
                        name   : formData.get('name'),
                        description  : formData.get('description'),
                        code   : formData.get('code'),
                        teacher : formData.get('teacher'),
                        modules    : formData.get('modules'),
                        subject: formData.get('area')         
                    };
                    write('courses', coursemodify);
                    document.body.removeChild(modal);
                    this.render(); 
                });
            });
        });
        const createBtn = this.closest('.dashboard')?.querySelector('.cCreate');
        if (createBtn) {
            createBtn.addEventListener('click', () => {
                this.openCreateModal();
            });
        }
    }
}

customElements.define('app-courses',Courses);
