// src/js/modules/init-data.js
import { write } from '../modules/local-storage.js';

// ------------------------------------------------------------------
// 1. Administrador de prueba
// ------------------------------------------------------------------
const adminTest = {
    name: "admintest",
    email: "admintest@abcschool.com",
    phone: "+57 300 123 4567",
    password: "admintest123",
    role: "Administrador Principal"
};

// ------------------------------------------------------------------
// 2. 5 Profesores
// ------------------------------------------------------------------
const teachers = [
    {
        name: "María González",
        email: "maria.gonzalez@abcschool.com",
        code: "PROF001",
        status: "Activo",
        img: "https://randomuser.me/api/portraits/women/44.jpg",
        subject: "Matemáticas"
    },
    {
        name: "Carlos Ramírez",
        email: "carlos.ramirez@abcschool.com",
        code: "PROF002",
        status: "Activo",
        img: "https://randomuser.me/api/portraits/men/32.jpg",
        subject: "Programación"
    },
    {
        name: "Ana López",
        email: "ana.lopez@abcschool.com",
        code: "PROF003",
        status: "Activo",
        img: "https://randomuser.me/api/portraits/women/68.jpg",
        subject: "Historia"
    },
    {
        name: "Luis Herrera",
        email: "luis.herrera@abcschool.com",
        code: "PROF004",
        status: "Inactivo",
        img: "https://randomuser.me/api/portraits/men/45.jpg",
        subject: "Ciencias Naturales"
    },
    {
        name: "Sofía Pérez",
        email: "sofia.perez@abcschool.com",
        code: "PROF005",
        status: "Activo",
        img: "https://randomuser.me/api/portraits/women/22.jpg",
        subject: "Inglés"
    }
];

// ------------------------------------------------------------------
// 3. 5 Cursos (con módulos, lecciones y recursos)
// ------------------------------------------------------------------
const courses = [
    {
        name: "Álgebra Lineal",
        code: "MAT101",
        description: "Curso introductorio de álgebra lineal con aplicaciones prácticas.",
        teacher: "María González",
        modules: [
            {
                code: "MOD001",
                name: "Vectores y Matrices",
                description: "Fundamentos de vectores y operaciones matriciales.",
                Lecciones: [
                    {
                        name: "Introducción a Vectores",
                        intensity: "Básica",
                        content: "Conceptos básicos y operaciones con vectores.",
                        resources: [
                            { title: "Guía PDF", urlResource: "https://example.com/vector-guide.pdf" },
                            { title: "Video explicativo", urlResource: "https://youtube.com/watch?v=abc123" }
                        ]
                    }
                ]
            }
        ]
    },
    {
        name: "Programación en JavaScript",
        code: "PROG201",
        description: "Domina JavaScript desde cero hasta proyectos reales.",
        teacher: "Carlos Ramírez",
        modules: [
            {
                code: "MOD002",
                name: "Fundamentos de JS",
                description: "Variables, funciones, objetos y control de flujo.",
                Lecciones: [
                    {
                        name: "Variables y Tipos",
                        intensity: "Básica",
                        content: "Declaración y tipos de datos en JavaScript.",
                        resources: []
                    },
                    {
                        name: "Funciones y Scope",
                        intensity: "Media",
                        content: "Funciones, arrow functions y ámbito.",
                        resources: [
                            { title: "MDN Functions", urlResource: "https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Functions" }
                        ]
                    }
                ]
            }
        ]
    },
    {
        name: "Historia Universal",
        code: "HIST101",
        description: "Recorrido cronológico por los eventos más importantes de la humanidad.",
        teacher: "Ana López",
        modules: [
            {
                code: "MOD003",
                name: "Edad Antigua",
                description: "Civilizaciones mesopotámicas, egipcias y griegas.",
                Lecciones: [
                    {
                        name: "Mesopotamia",
                        intensity: "Media",
                        content: "Sumerios, acadios y babilonios.",
                        resources: []
                    }
                ]
            }
        ]
    },
    {
        name: "Biología Celular",
        code: "BIO301",
        description: "Estudio detallado de la célula y sus procesos.",
        teacher: "Luis Herrera",
        modules: [
            {
                code: "MOD004",
                name: "Estructura Celular",
                description: "Organelos y membranas.",
                Lecciones: [
                    {
                        name: "Núcleo y ADN",
                        intensity: "Avanzada",
                        content: "Replicación y transcripción.",
                        resources: []
                    }
                ]
            }
        ]
    },
    {
        name: "Inglés Avanzado",
        code: "ENG401",
        description: "Perfecciona tu inglés con conversación y gramática avanzada.",
        teacher: "Sofía Pérez",
        modules: [
            {
                code: "MOD005",
                name: "Conversational English",
                description: "Práctica oral y fluidez.",
                Lecciones: [
                    {
                        name: "Debate y Argumentación",
                        intensity: "Alta",
                        content: "Técnicas para debates en inglés.",
                        resources: [
                            { title: "BBC Learning English", urlResource: "https://www.bbc.co.uk/learningenglish" }
                        ]
                    }
                ]
            }
        ]
    }
];

// ------------------------------------------------------------------
// 4. Guardar en localStorage (solo si no existen)
// ------------------------------------------------------------------
function init() {
    const existingAdmins = localStorage.getItem('admins');
    const existingTeachers = localStorage.getItem('teachers');
    const existingCourses = localStorage.getItem('courses');

    if (!existingAdmins) {
        write('admins', [adminTest]);
        console.log('Admin creado:', adminTest.email);
    }

    if (!existingTeachers) {
        write('teachers', teachers);
        console.log('5 profesores creados.');
    }

    if (!existingCourses) {
        write('courses', courses);
        console.log('5 cursos creados.');
    }

    if (existingAdmins && existingTeachers && existingCourses) {
        console.log('Datos ya inicializados. No se sobrescribió nada.');
    }
}

// Ejecutar
init();

console.log('%cDatos de prueba inicializados correctamente.', 'color: #6bc4a6; font-weight: bold;');