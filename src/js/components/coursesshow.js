import { read } from './modules/local-storage.js';

let allCourses = [];
let filteredCourses = [];

// Toggle menu móvil
window.toggleMenu = function() {
    const menu = document.querySelector('.landing-navbar-menu');
    menu.classList.toggle('active');
};

// Cargar todos los cursos
function loadAllCourses() {
    allCourses = read('courses') || [];
    filteredCourses = [...allCourses];
    
    // Cargar filtro de profesores
    loadTeachersFilter();
    
    // Mostrar cursos
    displayCourses(filteredCourses);
    
    // Actualizar contador
    updateCoursesCount(filteredCourses.length);
}

// Cargar opciones de filtro de profesores
function loadTeachersFilter() {
    const teachers = read('teachers') || [];
    const teacherFilter = document.getElementById('teacher-filter');
    
    // Obtener profesores únicos de los cursos
    const uniqueTeachers = [...new Set(allCourses.map(c => c.teacher))];
    
    uniqueTeachers.forEach(teacher => {
        const option = document.createElement('option');
        option.value = teacher;
        option.textContent = teacher;
        teacherFilter.appendChild(option);
    });
}

// Mostrar cursos
function displayCourses(courses) {
    const container = document.getElementById('all-courses');
    const noResults = document.getElementById('no-results');
    
    if (courses.length === 0) {
        container.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }
    
    noResults.style.display = 'none';
    
    container.innerHTML = courses.map(course => {
        const moduleCount = Array.isArray(course.modules) ? course.modules.length : 0;
        const lessonCount = Array.isArray(course.modules) 
            ? course.modules.reduce((total, mod) => 
                total + (Array.isArray(mod.Lecciones) ? mod.Lecciones.length : 0), 0)
            : 0;
        
        // Generar HTML de módulos
        let modulesHTML = '';
        if (Array.isArray(course.modules) && course.modules.length > 0) {
            modulesHTML = course.modules.map(mod => {
                let lessonsHTML = '';
                if (Array.isArray(mod.Lecciones) && mod.Lecciones.length > 0) {
                    lessonsHTML = `
                        <div class="lessons-list">
                            ${mod.Lecciones.map(lesson => `
                                <div class="lesson-item">
                                    <strong>${lesson.name}</strong> - ${lesson.intensity}
                                </div>
                            `).join('')}
                        </div>
                    `;
                }
                
                return `
                    <div class="module-item">
                        <div class="module-name">Módulo: ${mod.name} (${mod.code})</div>
                        <div class="module-description">${mod.description}</div>
                        ${lessonsHTML}
                    </div>
                `;
            }).join('');
        } else {
            modulesHTML = '<div class="no-modules">Sin módulos disponibles</div>';
        }
        
        return `
            <div class="full-course-card">
                <div class="course-header">
                    <div class="course-icon"></div>
                    <div class="course-header-info">
                        <div class="course-code">${course.code}</div>
                        <h3 class="course-title">${course.name}</h3>
                        <div class="course-teacher">
                            <span>${course.teacher}</span>
                        </div>
                    </div>
                </div>
                
                <p class="course-description">${course.description}</p>
                
                <div class="course-modules-section">
                    <div class="modules-title">
                        Contenido del curso (${moduleCount} módulos • ${lessonCount} lecciones)
                    </div>
                    ${modulesHTML}
                </div>
            </div>
        `;
    }).join('');
}

// Actualizar contador de cursos
function updateCoursesCount(count) {
    const countText = document.getElementById('courses-count-text');
    countText.textContent = count === 1 
        ? '1 curso disponible' 
        : `${count} cursos disponibles`;
}

// Búsqueda
function handleSearch(searchTerm) {
    const term = searchTerm.toLowerCase().trim();
    
    filteredCourses = allCourses.filter(course => {
        const matchesSearch = 
            course.name.toLowerCase().includes(term) ||
            course.code.toLowerCase().includes(term) ||
            course.teacher.toLowerCase().includes(term) ||
            course.description.toLowerCase().includes(term);
        
        return matchesSearch;
    });
    
    applyFilters();
}

// Filtro por profesor
function handleTeacherFilter(teacher) {
    if (teacher === '') {
        filteredCourses = [...allCourses];
    } else {
        filteredCourses = allCourses.filter(course => course.teacher === teacher);
    }
    
    applySearch();
}

// Aplicar búsqueda sobre cursos filtrados
function applySearch() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase().trim();
    
    if (searchTerm === '') {
        displayCourses(filteredCourses);
        updateCoursesCount(filteredCourses.length);
        return;
    }
    
    const searchedCourses = filteredCourses.filter(course => {
        return course.name.toLowerCase().includes(searchTerm) ||
               course.code.toLowerCase().includes(searchTerm) ||
               course.teacher.toLowerCase().includes(searchTerm) ||
               course.description.toLowerCase().includes(searchTerm);
    });
    
    displayCourses(searchedCourses);
    updateCoursesCount(searchedCourses.length);
}

// Aplicar filtros sobre cursos buscados
function applyFilters() {
    const teacherFilter = document.getElementById('teacher-filter').value;
    
    let result = [...filteredCourses];
    
    if (teacherFilter !== '') {
        result = result.filter(course => course.teacher === teacherFilter);
    }
    
    displayCourses(result);
    updateCoursesCount(result.length);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadAllCourses();
    
    // Búsqueda
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', (e) => {
        handleSearch(e.target.value);
    });
    
    // Filtro de profesor
    const teacherFilter = document.getElementById('teacher-filter');
    teacherFilter.addEventListener('change', (e) => {
        handleTeacherFilter(e.target.value);
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