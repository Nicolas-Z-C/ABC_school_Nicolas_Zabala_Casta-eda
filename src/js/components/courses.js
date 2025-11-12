import { read, write } from '../modules/local-storage.js';

class Courses extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.render();
    }
    render() {
        let courses = read('courses') || [];
        let courseCard = '';
        for (let i = 0; i < courses.length; i++) {
            const c = courses[i];
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
            courseCard += /*html*/`
                <div class="course-card" style="border:1px solid #ccc; padding:15px; margin-bottom:15px; border-radius:8px;">
                    <p><strong>Nombre del Curso:</strong> ${c.name}</p>
                    <p><strong>Código:</strong> ${c.code}</p>
                    <p><strong>Descripción:</strong> ${c.description}</p>
                    <p><strong>Profesor:</strong> ${c.teacher}</p>
                    <div><strong>Módulos:</strong>${modulesHTML}</div>
                    <button class="edit-course" data-index="${i}">Editar</button>
                    <button class="delete-course" data-index="${i}">Eliminar</button>
                </div>
            `;
        }
        this.innerHTML = courseCard;
        this.addEventListeners();
    }
    openCreateModal() {
        const courses = read('courses') || [];
        const teachers = read('teachers') || [];
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
                <select name="teacher" required>
                    <option value="">-- Seleccionar Profesor --</option>
                    ${teachers.map(t => `<option value="${t.name}">${t.name} (${t.code})</option>`).join('')}
                </select>
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
                resEntry.querySelector('.remove-resource').addEventListener('click', () => resEntry.remove());
            });
            moduleEl.querySelector('.remove-module')?.addEventListener('click', () => moduleEl.remove());
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
            const modules = [];
            modal.querySelectorAll('.module-entry').forEach(mod => {
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
                name: form.name.value,
                code: form.code.value,
                description: form.description.value,
                teacher: form.teacher.value,
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
    addEventListeners() {
        const edit = this.querySelectorAll('.edit-course');
        const deleteB = this.querySelectorAll('.delete-course');
        deleteB.forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                let courses = read('courses') || [];
                courses.splice(index, 1);
                write('courses', courses);
                this.render();
            });
        });
        edit.forEach(button => {
            button.addEventListener('click', e => {
                const index = e.target.getAttribute('data-index');
                const coursemodify = read('courses') || [];
                const teachers = read('teachers') || [];
                const course = coursemodify[index];
                const modal = document.createElement('div');
                modal.style.cssText = `
                    position:fixed; top:0; left:0; width:100%; height:100%;
                    background:rgba(0,0,0,0.5); display:flex; align-items:center;
                    justify-content:center; z-index:1000;
                `;
                let modulesHTML = '';
                if (Array.isArray(course.modules) && course.modules.length > 0) {
                    course.modules.forEach(mod => {
                        let lessonsHTML = '';
                        if (Array.isArray(mod.Lecciones) && mod.Lecciones.length > 0) {
                            mod.Lecciones.forEach(les => {
                                let resourcesHTML = '';
                                if (Array.isArray(les.resources) && les.resources.length > 0) {
                                    les.resources.forEach(res => {
                                        resourcesHTML += `
                                            <div class="resource-entry">
                                                <input type="text" name="resourceTitle" value="${res.title}" required>
                                                <input type="url" name="resourceUrl" value="${res.urlResource}" required>
                                                <button type="button" class="remove-resource">X</button>
                                            </div>`;
                                    });
                                } else {
                                    resourcesHTML = `
                                        <div class="resource-entry">
                                            <input type="text" name="resourceTitle" placeholder="Título" required>
                                            <input type="url" name="resourceUrl" placeholder="URL" required>
                                            <button type="button" class="remove-resource">X</button>
                                        </div>`;
                                }
                                lessonsHTML += `
                                    <div class="lesson-entry">
                                        <label>Nombre Lección</label>
                                        <input type="text" name="lessonName" value="${les.name}" required>
                                        <label>Intensidad</label>
                                        <input type="text" name="lessonIntensity" value="${les.intensity}" required>
                                        <label>Contenido</label>
                                        <textarea name="lessonContent" rows="2" required>${les.content}</textarea>
                                        <div class="resources-container">
                                            <h6 style="margin:8px 0 4px;">Recursos</h6>
                                            ${resourcesHTML}
                                            <button type="button" class="add-resource">+ Recurso</button>
                                        </div>
                                    </div>`;
                            });
                        } else {
                            lessonsHTML = `
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
                                </div>`;
                        }
                        modulesHTML += `
                            <div class="module-entry">
                                <label>Código Módulo</label>
                                <input type="text" name="moduleCode" value="${mod.code}" required>
                                <label>Nombre Módulo</label>
                                <input type="text" name="moduleName" value="${mod.name}" required>
                                <label>Descripción Módulo</label>
                                <input type="text" name="moduleDescription" value="${mod.description}" required>
                                <div class="lessons-container">
                                    <h5 style="margin:10px 0 5px;">Lecciones</h5>
                                    ${lessonsHTML}
                                    <button type="button" class="add-lesson">+ Lección</button>
                                </div>
                                <button type="button" class="remove-module">Eliminar Módulo</button>
                            </div>`;
                    });
                } else {
                    modulesHTML = `
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
                        </div>`;
                }
                modal.innerHTML = /*html*/`
                    <form id="modify-course-form" style="
                        background:#fff; padding:20px; border-radius:8px;
                        width:90%; max-width:500px; box-shadow:0 4px 12px rgba(0,0,0,0.2);
                        max-height:90vh; overflow-y:auto;
                    ">
                        <h3>Editar Curso</h3>
                        <label>Nombre</label>
                        <input type="text" name="name" value="${course.name}" required>
                        <label>Código</label>
                        <input type="text" name="code" value="${course.code}" required>
                        <label>Descripción</label>
                        <input type="text" name="description" value="${course.description}" required>
                        <label>Profesor</label>
                        <select name="teacher" required>
                            <option value="">-- Seleccionar Profesor --</option>
                            ${teachers.map(t => `<option value="${t.name}" ${t.name === course.teacher ? 'selected' : ''}>${t.name} (${t.code})</option>`).join('')}
                        </select>
                        <div id="modules-container">
                            <h4 style="margin:15px 0 8px;">Módulos</h4>
                            ${modulesHTML}
                            <button type="button" id="add-module">+ Agregar Módulo</button>
                        </div>
                        <div style="margin-top:15px; display:flex; gap:10px; justify-content:flex-end;">
                            <button type="button" class="cancel">Cancelar</button>
                            <button type="submit">Guardar</button>
                        </div>
                    </form>
                `;
                document.body.appendChild(modal);
                const formmodify = modal.querySelector('#modify-course-form');
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
                        resEntry.querySelector('.remove-resource').addEventListener('click', () => resEntry.remove());
                    });
                    moduleEl.querySelector('.remove-module')?.addEventListener('click', () => moduleEl.remove());
                    moduleEl.querySelectorAll('.remove-resource').forEach(btn => {
                        btn.addEventListener('click', () => btn.parentElement.remove());
                    });
                };
                const attachLessonHandlers = (lessonEl) => {
                    lessonEl.querySelectorAll('.remove-resource').forEach(btn => {
                        btn.addEventListener('click', () => btn.parentElement.remove());
                    });
                };
                modal.querySelectorAll('.module-entry').forEach(attachModuleHandlers);
                modal.querySelector('#add-module').addEventListener('click', addModule);
                formmodify.addEventListener('submit', ev => {
                    ev.preventDefault();
                    const modules = [];
                    modal.querySelectorAll('.module-entry').forEach(mod => {
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
                    coursemodify[index] = {
                        name: formmodify.name.value,
                        code: formmodify.code.value,
                        description: formmodify.description.value,
                        teacher: formmodify.teacher.value,
                        modules
                    };
                    write('courses', coursemodify);
                    closeModal();
                    this.render();
                });
                modal.addEventListener('click', e => {
                    if (e.target === modal) closeModal();
                });
            });
        });
        const createBtn = this.closest('.dashboard')?.querySelector('.cCreate');
        if (createBtn && !createBtn.dataset.listenerAttached) {
            createBtn.addEventListener('click', () => {
                this.openCreateModal();
            });
            createBtn.dataset.listenerAttached = 'true';
        }
    }
}
customElements.define('app-courses', Courses);