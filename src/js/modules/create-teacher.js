import { read, write } from "./local-storage";

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
                        subject: formData.get('area')         // keep the original subject
                    };
        
                    write('teachers', teachermodify);
                    document.body.removeChild(modal);
                    this.render(); 
});