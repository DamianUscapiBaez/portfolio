// === Obtención de elementos del DOM ===
const DOM = {
    menuToggle: document.getElementById('menu-toggle'),
    mobileMenu: document.getElementById('mobile-menu'),
    closeMenu: document.getElementById('close-menu'),
    darkModeToggle: document.getElementById('dark-mode-toggle'),
    modeIcon: document.getElementById('mode-icon'),
    body: document.getElementById('body'),
    menuLinks: document.querySelectorAll("nav a, #mobile-menu a"),
    sections: document.querySelectorAll('section'),
    tabs: document.querySelectorAll('.tab-btn'),
    contents: document.querySelectorAll('.tab-content'),
    slides: document.querySelectorAll('.carousel-item'),
    nextBtn: document.getElementById('next'),
    prevBtn: document.getElementById('prev'),
    preloader: document.getElementById('preloader'),
    content: document.getElementById('content'),
    servicesContainer: document.getElementById('servicesall')
};

// === Estado global ===
const state = {
    currentSlide: 0,
    scrollTimeout: null
};

// === Funciones de tema ===
const Theme = {
    apply: () => {
        const savedTheme = localStorage.getItem('theme') || 'dark-mode';
        DOM.body.classList.remove('light-mode', 'dark-mode');
        DOM.body.classList.add(savedTheme);
        DOM.modeIcon.classList.replace(savedTheme === 'dark-mode' ? 'fa-sun' : 'fa-moon', savedTheme === 'dark-mode' ? 'fa-moon' : 'fa-sun');

        // Aplicar color al menú móvil según el tema
        DOM.mobileMenu.classList.toggle('bg-white', savedTheme === 'light-mode');
    },
    toggle: () => {
        DOM.body.classList.toggle('dark-mode');
        DOM.body.classList.toggle('light-mode');
        const theme = DOM.body.classList.contains('dark-mode') ? 'dark-mode' : 'light-mode';
        localStorage.setItem('theme', theme);
        DOM.modeIcon.classList.toggle('fa-sun');
        DOM.modeIcon.classList.toggle('fa-moon');

        // Cambiar color del menú móvil cuando se cambia el tema
        DOM.mobileMenu.classList.toggle('bg-white', theme === 'light-mode');
    }
};
// === Funciones de menú ===
const Menu = {
    toggle: () => DOM.mobileMenu.classList.toggle('hidden'),
    close: () => DOM.mobileMenu.classList.add('hidden')
};

// === Desplazamiento suave y resaltado de enlaces activos ===
const Scroll = {
    handleScroll: () => {
        clearTimeout(state.scrollTimeout);
        state.scrollTimeout = setTimeout(Scroll.onScroll, 100);
    },
    onScroll: () => {
        const scrollPosition = window.scrollY + 80; // Ajusta el offset según el header
        let currentSection = null;

        // Encuentra la sección actual basada en la posición del scroll
        DOM.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                currentSection = section.id;
            }
        });

        // Aplica la clase "active" al enlace correspondiente
        DOM.menuLinks.forEach(link => {
            const linkHref = link.getAttribute('href').substring(1);
            link.classList.toggle('active', linkHref === currentSection);
        });
    },
    smoothScroll: (event) => {
        event.preventDefault();
        const targetId = event.currentTarget.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

            // Actualiza la clase "active" inmediatamente al hacer clic
            DOM.menuLinks.forEach(link => {
                const linkHref = link.getAttribute('href').substring(1);
                link.classList.toggle('active', linkHref === targetId);
            });

            // Cierra el menú móvil si está visible
            if (window.innerWidth < 768) {  // Detecta si es pantalla móvil
                Menu.close();
            }
        }
    }
};

// === Carga de servicios desde JSON ===
const Services = {
    load: async () => {
        try {
            const response = await fetch('https://damianuscapibaez.github.io/portfolio/assets/file/services.json');
            const servicesData = await response.json();
            servicesData.forEach(service => {
                const serviceCard = document.createElement('div');
                serviceCard.className = 'service-card p-4 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300';
                serviceCard.innerHTML = `
                    <div class="icon mb-4 flex gap-16">
                        <i class="${service.icon} text-2xl text-[#e75a5a]"></i>
                        <h3 class="text-2xl font-bold mb-2">${service.title}</h3>
                    </div>
                    <p class="text-gray-400 mb-4">${service.description}</p>
                    <a href="mailto:damian.ubd@gmail.com" aria-label="Enviar correo a Damian Uscapi Baez" class="text-[#e75a5a] font-semibold hover:underline">Más información →</a>
                `;
                DOM.servicesContainer.appendChild(serviceCard);
            });
        } catch (error) {
            console.error('Error loading services:', error);
        }
    }
};

// === Tabs - Interacción con pestañas ===
const Tabs = {
    init: () => {
        DOM.tabs[0].classList.add('active-tab', 'bg-[#b74b4b]', 'border-transparent');
        DOM.contents[0].classList.remove('hidden');

        DOM.tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                DOM.tabs.forEach(btn => btn.classList.remove('active-tab', 'bg-[#b74b4b]', 'border-transparent'));
                DOM.contents.forEach(content => content.classList.add('hidden'));
                tab.classList.add('active-tab', 'bg-[#b74b4b]', 'border-transparent');
                document.getElementById(tab.dataset.tab).classList.remove('hidden');
            });
        });
    }
};

// === Carrusel de imágenes ===
const Carousel = {
    showSlide: (index) => {
        DOM.slides.forEach((slide, i) => {
            slide.classList.toggle('hidden', i !== index);
        });
    },
    next: () => {
        state.currentSlide = (state.currentSlide + 1) % DOM.slides.length;
        Carousel.showSlide(state.currentSlide);
    },
    prev: () => {
        state.currentSlide = (state.currentSlide - 1 + DOM.slides.length) % DOM.slides.length;
        Carousel.showSlide(state.currentSlide);
    }
};

// === Preloader ===
const Preloader = {
    hide: () => {
        setTimeout(() => {
            DOM.preloader.style.display = 'none';
            DOM.content.style.display = 'block';
        }, 3000);
    }
};

// === Inicialización ===
const init = () => {
    DOM.darkModeToggle.addEventListener('click', Theme.toggle);
    DOM.menuToggle.addEventListener('click', Menu.toggle);
    DOM.closeMenu.addEventListener('click', Menu.close);
    DOM.nextBtn.addEventListener('click', Carousel.next);
    DOM.prevBtn.addEventListener('click', Carousel.prev);
    window.addEventListener('scroll', Scroll.handleScroll);

    DOM.menuLinks.forEach(link => link.addEventListener('click', Scroll.smoothScroll));

    Theme.apply();
    Services.load();
    Tabs.init();
    Scroll.onScroll();
    Preloader.hide();

    // Seleccionar "Inicio" por defecto
    DOM.menuLinks[0].classList.add('active');
};

window.addEventListener('load', init);
