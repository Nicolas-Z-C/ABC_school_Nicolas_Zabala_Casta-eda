# ABCschool - Plataforma Educativa

## Descripción

ABCschool es una plataforma web educativa desarrollada con **JavaScript puro** (sin frameworks).  
Permite a los usuarios explorar cursos y a los administradores gestionar profesores y cursos completos (incluyendo módulos, lecciones y recursos).  
Los datos se almacenan en `localStorage` y la autenticación se basa en `sessionStorage`.

---

## Tecnologías utilizadas

- **HTML5** – Estructura de páginas.
- **CSS3** – Estilos con gradientes, sombras, transiciones y diseño responsive.
- **JavaScript (ES6+)** – Lógica, Web Components, módulos ES, eventos.
- **localStorage** – Persistencia de datos (administradores, profesores, cursos).
- **sessionStorage** – Control de sesión.

---

## Estructura del proyecto
.
├── index.html
├── src/
│   ├── css/
│   │   ├── index.css
│   │   ├── coursesshow.css
│   │   ├── navbar.css
│   │   ├── login.css
│   │   ├── admin.css
│   │   ├── teachers.css
│   │   └── courses.css
│   ├── html/
│   │   ├── cursos.html
│   │   └── admin/
│   │       ├── login.html
│   │       ├── admin.html
│   │       ├── profesores.html
│   │       └── managercursos.html
│   └── js/
│       ├── modules/
│       │   ├── local-storage.js
│       │   ├── create-teacher.js
│       │   └── login-check.js
│       └── components/
│           ├── index.js
│           ├── coursesshow.js
│           ├── login.js
│           ├── admin.js
│           ├── teachers.js
│           └── courses.js
text---

## Estructura de datos (localStorage)

- **`admins`**:  
  Array de objetos con campos: `name`, `email`, `phone`, `password`, `role`.

- **`teachers`**:  
  Array de objetos con campos: `name`, `email`, `code`, `status`, `img`, `subject` (o `area`).

- **`courses`**:  
  Array de objetos con estructura anidada:
  - `name`, `code`, `description`, `teacher`
  - `modules` → array de:
    - `code`, `name`, `description`
    - `Lecciones` → array de:
      - `name`, `intensity`, `content`
      - `resources` → array de: `{ title, urlResource }`

---

## Requisitos

- Navegador moderno con soporte para:
  - ES6+ (arrow functions, modules, `class`)
  - Web Components (`customElements`)
  - `localStorage` y `sessionStorage`
- Servidor local recomendado (ej. **Live Server**) para cargar módulos ES.

---

## Instalación y ejecución

1. Clona o descarga el proyecto.
2. Abre `index.html` en el navegador.
3. Para el panel de administración:
   - Accede a `/src/html/admin/login.html`
   - Usa: **email:** `ff` | **password:** `ff`

> No se requieren dependencias ni compilación.

---

## Uso

### Público
- **Inicio** (`index.html`): Cursos destacados, estadísticas animadas.
- **Cursos** (`cursos.html`): Búsqueda por nombre/código/profesor + filtro por docente.

### Administrador
- **Login** → `admin.html`
- **Dashboard**: Acceso rápido a gestión de profesores y cursos.
- **Profesores**: CRUD completo con modales.
- **Cursos**: CRUD anidado (módulos → lecciones → recursos).

> Los cambios persisten en `localStorage`. Borrar el almacenamiento del navegador reinicia los datos.

---

## Scripts principales

| Archivo               | Función |
|-----------------------|--------|
| `index.js`            | Carga cursos destacados y estadísticas |
| `coursesshow.js`      | Búsqueda y filtro de cursos |
| `login.js`            | Autenticación y sesión |
| `admin.js`            | Panel principal del administrador |
| `teachers.js`         | CRUD de profesores |
| `courses.js`          | CRUD completo de cursos |
| `local-storage.js`    | Funciones `read()` / `write()` |
| `create-teacher.js`   | Lógica de creación/edición de profesores |
| `login-check.js`      | Redirección si no hay sesión activa |

---

## Pruebas

No hay suite automatizada.  
Prueba manualmente:
- Crear/editar/eliminar profesores y cursos.
- Verificar persistencia tras recargar.
- Probar búsqueda y filtros en la vista pública.

---

## Contribución

1. Haz fork del repositorio.
2. Crea una rama (`feature/nueva-funcionalidad`).
3. Realiza commits claros.
4. Abre un Pull Request.

---

## Licencia

Uso educativo. Sin licencia formal especificada.