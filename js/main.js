// === Obtención de elementos del DOM ===
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const languageSelector = document.getElementById('language-selector');
const body = document.body;
const header = document.getElementById('header');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const menuLinks = document.querySelectorAll("nav a, #mobile-menu a");
const sections = document.querySelectorAll('section');

// === Variables de estado ===
let isDarkMode = localStorage.getItem('isDarkMode') === null ? true : localStorage.getItem('isDarkMode') === 'true';
let selectedLanguage = localStorage.getItem('language') || 'en';

// === Funciones de Tema ===
function applyTheme() {
    const themeClasses = isDarkMode ? ['bg-black', 'text-white'] : ['bg-white', 'text-black'];
    const oppositeClasses = isDarkMode ? ['bg-white', 'text-black'] : ['bg-black', 'text-white'];

    [body, header, mobileMenu].forEach(element => {
        element.classList.add(...themeClasses);
        element.classList.remove(...oppositeClasses);
    });
    darkModeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

darkModeToggle.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    localStorage.setItem('isDarkMode', isDarkMode);
    applyTheme();
});

// === Funciones de Menú ===
menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

document.getElementById('close-menu').addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
});

// === Desplazamiento Suave ===
menuLinks.forEach(link => {
    link.addEventListener("click", function (e) {
        e.preventDefault();
        const targetId = this.getAttribute("href").substring(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// === Resaltado de Enlaces Activos ===
function onScroll() {
    const scrollPosition = window.scrollY;
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 80;
        const sectionBottom = sectionTop + section.offsetHeight;
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            const currentId = section.getAttribute('id');
            menuLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`));
        }
    });
}

function setActiveLinkOnLoad() {
    onScroll();
}

// === Animación del Preloader ===
function animatePreloader() {
    const bars = document.querySelectorAll('.bar');

    if (bars.length === 0) {
        document.getElementById('transition-container').style.display = 'none';
        document.getElementById('content').style.display = 'flex';
        return;
    }

    anime({
        targets: bars,
        scaleY: [0, 1],
        easing: 'easeInOutQuad',
        duration: 800,
        delay: anime.stagger(200),
        complete: () => {
            anime({
                targets: bars,
                scaleY: [1, 0],
                easing: 'easeInOutQuad',
                duration: 800,
                delay: anime.stagger(200),
                complete: () => {
                    document.getElementById('transition-container').style.display = 'none';
                    document.getElementById('content').style.display = 'block'; // Mostrar contenido después del preloader
                }
            });
        }
    });
}
// === Cargar Servicios desde JSON ===
function loadDataServices() {
    fetch('https://damianuscapibaez.github.io/portfolio/assets/file/services.json')
        .then(response => response.json())
        .then(servicesData => {
            const servicesContainer = document.getElementById('servicesall');

            servicesData.forEach(service => {
                const serviceCard = document.createElement('div');
                serviceCard.className = 'service-card p-4 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300';

                serviceCard.innerHTML = `
                    <div class="icon mb-4 text-[#e75a5a]">
                        <i class="${service.icon} text-5xl"></i>
                    </div>
                    <h3 class="text-2xl font-bold mb-2">${service.title}</h3>
                    <p class="text-gray-600 mb-4">
                        ${service.description}
                    </p>
                    <a href="mailto:damian.ubd@gmail.com" aria-label="Enviar correo a Damian Uscapi Baez" class="text-[#e75a5a] font-semibold hover:underline">Más información →</a>
                `;

                servicesContainer.appendChild(serviceCard);
            });
        })
        .catch(error => console.error('Error loading services:', error));
}

// === Tabs - Interacción con Pestañas ===
const tabs = document.querySelectorAll('.tab-btn');
const contents = document.querySelectorAll('.tab-content');

// Activar primer tab por defecto
tabs[0].classList.add('active-tab', 'bg-[#b74b4b]', 'border-transparent');
contents[0].classList.remove('hidden');

// Evento para cambiar de pestaña
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(btn => btn.classList.remove('active-tab', 'bg-[#b74b4b]', 'border-transparent'));
        contents.forEach(content => content.classList.add('hidden'));

        tab.classList.add('active-tab', 'bg-[#b74b4b]', 'border-transparent');
        const activeTab = tab.getAttribute('data-tab');
        document.getElementById(activeTab).classList.remove('hidden');
    });
});

// === Carrusel de Imágenes ===
const slides = document.querySelectorAll('.carousel-item');
let currentSlide = 0;

document.getElementById('next').addEventListener('click', () => {
    slides[currentSlide].classList.add('hidden');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.remove('hidden');
});

document.getElementById('prev').addEventListener('click', () => {
    slides[currentSlide].classList.add('hidden');
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    slides[currentSlide].classList.remove('hidden');
});

// === Eventos de Carga y Scroll ===
window.addEventListener('load', () => {
    animatePreloader();
    setActiveLinkOnLoad();
    applyTheme();
    loadDataServices();
});

let scrollTimeout;
window.addEventListener('scroll', () => {
    if (!scrollTimeout) {
        scrollTimeout = setTimeout(() => {
            onScroll();
            scrollTimeout = null;
        }, 100);
    }
});
