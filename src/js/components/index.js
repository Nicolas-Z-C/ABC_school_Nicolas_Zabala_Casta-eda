import { read } from './modules/local-storage.js';

// Toggle menu móvil
window.toggleMenu = function() {
    const menu = document.querySelector('.landing-navbar-menu');
    menu.classList.toggle('active');
};

// Cargar cursos destacados (primeros 5)
function loadFeaturedCourses() {
    const courses = read('courses') || [];
    const featuredCourses = courses.slice(0, 5);
    const container = document.getElementById('featured-courses');
    
    if (featuredCourses.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <p style="font-size: 1.2rem; color: #5a7d92;">
                    No hay cursos disponibles en este momento.
                </p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = featuredCourses.map(course => {
        const moduleCount = Array.isArray(course.modules) ? course.modules.length : 0;
        const lessonCount = Array.isArray(course.modules) 
            ? course.modules.reduce((total, mod) => 
                total + (Array.isArray(mod.Lecciones) ? mod.Lecciones.length : 0), 0)
            : 0;
        
        return `
            <div class="course-card">
                <div class="course-icon"></div>
                <div class="course-code">${course.code}</div>
                <h3 class="course-title">${course.name}</h3>
                <p class="course-description">${course.description}</p>
                <div class="course-teacher">
                    <span>${course.teacher}</span>
                </div>
                <div class="course-modules">
                    <div class="course-modules-title">Contenido del curso:</div>
                    <div class="course-modules-count">
                        ${moduleCount} módulos • ${lessonCount} lecciones
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Animar números de estadísticas
function animateNumber(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Cargar estadísticas
function loadStats() {
    const courses = read('courses') || [];
    const teachers = read('teachers') || [];
    
    const courseCount = courses.length;
    const teacherCount = teachers.length;
    const studentCount = Math.floor(Math.random() * 1000) + 500; // Simulado
    
    // Animar números cuando sean visibles
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumber(document.getElementById('course-count'), courseCount);
                animateNumber(document.getElementById('teacher-count'), teacherCount);
                animateNumber(document.getElementById('student-count'), studentCount);
                observer.disconnect();
            }
        });
    });
    
    observer.observe(document.querySelector('.stats-section'));
}

// Scroll suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Efecto de scroll en navbar
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.landing-navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 6px 25px rgba(44, 95, 124, 0.3)';
    } else {
        navbar.style.boxShadow = '0 4px 20px rgba(44, 95, 124, 0.2)';
    }
});

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    loadFeaturedCourses();
    loadStats();
});