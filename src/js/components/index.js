import { read } from '../modules/local-storage.js';

// Toggle menú móvil
window.toggleMenu = function () {
    const menu = document.querySelector('.landing-navbar-menu');
    menu?.classList.toggle('active');
};

// Cargar cursos destacados (primeros 5)
function loadFeaturedCourses() {
    const courses = read('courses') || [];
    const container = document.getElementById('featured-courses');
    if (!container) return;

    if (courses.length === 0) {
        container.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:#5a7d92;">No hay cursos disponibles.</p>`;
        return;
    }

    container.innerHTML = courses.slice(0, 5).map(course => {
        const modCount = Array.isArray(course.modules) ? course.modules.length : 0;
        const lesCount = Array.isArray(course.modules)
            ? course.modules.reduce((t, m) => t + (Array.isArray(m.Lecciones) ? m.Lecciones.length : 0), 0)
            : 0;

        return `
            <div class="course-card">
                <div class="course-icon"></div>
                <div class="course-code">${course.code || ''}</div>
                <h3 class="course-title">${course.name || ''}</h3>
                <p class="course-description">${course.description || ''}</p>
                <div class="course-teacher"><span>${course.teacher || ''}</span></div>
                <div class="course-modules">
                    <div class="course-modules-title">Contenido del curso:</div>
                    <div class="course-modules-count">
                        ${modCount} módulo${modCount !== 1 ? 's' : ''} • ${lesCount} lección${lesCount !== 1 ? 'es' : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Estadísticas
function loadStats() {
    const courses = read('courses') || [];
    const teachers = read('teachers') || [];
    const courseEl = document.getElementById('course-count');
    const teacherEl = document.getElementById('teacher-count');
    const studentEl = document.getElementById('student-count');

    if (courseEl) courseEl.textContent = courses.length;
    if (teacherEl) teacherEl.textContent = teachers.length;
    if (studentEl) studentEl.textContent = '1250';
}

// Scroll suave y efecto navbar
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        document.querySelector(a.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' });
    });
});
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.landing-navbar');
    nav.style.boxShadow = window.scrollY > 50
        ? '0 6px 25px rgba(44, 95, 124, 0.3)'
        : '0 4px 20px rgba(44, 95, 124, 0.2)';
});

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    loadFeaturedCourses();
    loadStats();
});