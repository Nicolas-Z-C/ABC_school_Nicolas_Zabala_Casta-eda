import { read } from '../modules/local-storage.js';

let allCourses = [];
let filteredCourses = [];

// Toggle menú móvil
window.toggleMenu = function () {
    const menu = document.querySelector('.landing-navbar-menu');
    menu?.classList.toggle('active');
};

// Cargar cursos
function loadAllCourses() {
    allCourses = read('courses') || [];
    filteredCourses = [...allCourses];
    loadTeachersFilter();
    displayCourses(filteredCourses);
    updateCoursesCount(filteredCourses.length);
}

// Filtro de profesores
function loadTeachersFilter() {
    const teacherFilter = document.getElementById('teacher-filter');
    if (!teacherFilter) return;
    const unique = [...new Set(allCourses.map(c => c.teacher).filter(Boolean))];
    teacherFilter.innerHTML = '<option value="">Todos los Profesores</option>';
    unique.forEach(t => {
        const opt = document.createElement('option');
        opt.value = t;
        opt.textContent = t;
        teacherFilter.appendChild(opt);
    });
}

// Mostrar cursos
function displayCourses(courses) {
    const container = document.getElementById('all-courses');
    const noResults = document.getElementById('no-results');
    if (!container) return;

    if (courses.length === 0) {
        container.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }
    noResults.style.display = 'none';

    container.innerHTML = courses.map(course => {
        const modCount = Array.isArray(course.modules) ? course.modules.length : 0;
        const lesCount = Array.isArray(course.modules)
            ? course.modules.reduce((t, m) => t + (Array.isArray(m.Lecciones) ? m.Lecciones.length : 0), 0)
            : 0;

        return `
            <div class="course-card">
                <div class="course-code">${course.code || ''}</div>
                <h3 class="course-title">${course.name || ''}</h3>
                <p class="course-description">${course.description || ''}</p>
                <div class="course-teacher"><span>${course.teacher || ''}</span></div>
                <div class="course-modules">
                    <div class="course-modules-title">Contenido:</div>
                    <div class="course-modules-count">
                        ${modCount} módulo${modCount !== 1 ? 's' : ''} • ${lesCount} lección${lesCount !== 1 ? 'es' : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Contador
function updateCoursesCount(count) {
    const el = document.getElementById('courses-count-text');
    if (el) el.textContent = `${count} curso${count !== 1 ? 's' : ''}`;
}

// Búsqueda
function handleSearch(term) {
    term = term.toLowerCase().trim();
    filteredCourses = allCourses.filter(c =>
        c.name?.toLowerCase().includes(term) ||
        c.code?.toLowerCase().includes(term) ||
        c.teacher?.toLowerCase().includes(term) ||
        c.description?.toLowerCase().includes(term)
    );
    applyFilters();
}

// Filtro profesor
function handleTeacherFilter(teacher) {
    filteredCourses = teacher ? allCourses.filter(c => c.teacher === teacher) : [...allCourses];
    applySearch();
}

// Aplicar filtros
function applyFilters() {
    const teacher = document.getElementById('teacher-filter')?.value || '';
    let result = teacher ? allCourses.filter(c => c.teacher === teacher) : [...allCourses];
    const term = document.getElementById('search-input')?.value.toLowerCase().trim() || '';
    if (term) {
        result = result.filter(c =>
            c.name?.toLowerCase().includes(term) ||
            c.code?.toLowerCase().includes(term) ||
            c.teacher?.toLowerCase().includes(term) ||
            c.description?.toLowerCase().includes(term)
        );
    }
    displayCourses(result);
    updateCoursesCount(result.length);
}

// Eventos
document.addEventListener('DOMContentLoaded', () => {
    loadAllCourses();

    const search = document.getElementById('search-input');
    const filter = document.getElementById('teacher-filter');

    search?.addEventListener('input', e => handleSearch(e.target.value));
    filter?.addEventListener('change', e => handleTeacherFilter(e.target.value));
});

// Efecto navbar
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.landing-navbar');
    nav.style.boxShadow = window.scrollY > 50
        ? '0 6px 25px rgba(44, 95, 124, 0.3)'
        : '0 4px 20px rgba(44, 95, 124, 0.2)';
});