/* ==========================================================================
   JAVASCRIPT PRINCIPAL - BEE HOTEL SMART SYSTEM PRESENTATION
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. INICIALIZACIÓN DEL MAPA DE BIODIVERSIDAD (LEAFLET.JS)
    initBiodiversityMap();

    // 2. DETECTOR DE DESPLAZAMIENTO (SCROLL) PARA ANIMACIONES
    initScrollReveal();

    // 3. MENÚ MÓVIL Y NAVEGACIÓN ADHESIVA
    initNavigation();

    // 4. INTERACTIVIDAD EN LA TABLA DE DATOS
    initDataTableInteractive();

    // 5. INTERACTIVIDAD DE ABEJAS VOLADORAS Y PARTÍCULAS
    initInteractiveBees();
});

/* --------------------------------------------------------------------------
   1. MAPA DE BIODIVERSIDAD DE TULUÁ
   -------------------------------------------------------------------------- */
function initBiodiversityMap() {
    const mapElement = document.getElementById('biodiversityMap');
    if (!mapElement) return;

    // Coordenadas de los 5 puntos de monitoreo y biodiversidad en Tuluá
    const points = [
        {
            name: "Estación Bee Hotel Smart System",
            lat: 4.0847,
            lng: -76.1954,
            type: "Estación de Monitoreo Smart",
            level: "Favorable (Variable según hora)",
            color: "blue",
            observation: "Punto principal de recopilación de variables climáticas del proyecto escolar.",
            recommendation: "Monitorear constantemente la relación entre humedad y visitas de polinizadores."
        },
        {
            name: "Jardín Botánico Juan María Céspedes",
            lat: 4.0298,
            lng: -76.2023,
            type: "Reserva Natural y Bosque Seco",
            level: "Alta Biodiversidad (Excelente)",
            color: "green",
            observation: "Hogar de abundantes nidos silvestres de abejas meliponas (Angelitas) y flora nativa del Valle.",
            recommendation: "Preservar el dosel forestal y fomentar visitas pedagógicas de conservación."
        },
        {
            name: "Parque Metropolitano Sarmiento Lora",
            lat: 4.0792,
            lng: -76.1895,
            type: "Parque Urbano Arbolado",
            level: "Alta Biodiversidad",
            color: "green",
            observation: "Pulmón verde urbano con árboles maduros y amplios jardines de flores silvestres.",
            recommendation: "Evitar el uso de pesticidas en el mantenimiento del césped y plantas ornamentales."
        },
        {
            name: "Parque Boyacá (Centro Urbano)",
            lat: 4.0844,
            lng: -76.1995,
            type: "Plaza Pública",
            level: "Biodiversidad Media",
            color: "yellow",
            observation: "Presencia de flores en jardineras ornamentales. Tránsito frecuente de abejas en busca de agua.",
            recommendation: "Enriquecer las jardineras con plantas de la familia Asteraceae (margaritas, girasoles)."
        },
        {
            name: "Zona Comercial e Industrial Norte",
            lat: 4.0950,
            lng: -76.2100,
            type: "Zona Industrial",
            level: "Baja Biodiversidad (Crítico)",
            color: "red",
            observation: "Alta pavimentación, pocas áreas verdes y escasos recursos florales para insectos.",
            recommendation: "Implementar techos verdes o muros florales escolares en las cercanías."
        }
    ];

    // Inicializar el mapa de Leaflet centrado en Tuluá
    const map = L.map('biodiversityMap', {
        center: [4.0847, -76.1954],
        zoom: 13,
        zoomControl: true,
        scrollWheelZoom: false // Evita interferir con el scroll de la página
    });

    // Cargar mapa de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Añadir controles de zoom arriba a la derecha para un aspecto más limpio
    map.zoomControl.setPosition('topright');

    // Renderizar marcadores interactivos personalizados
    points.forEach(point => {
        // Crear un divIcon de Leaflet para control total sobre los estilos CSS
        const customIcon = L.divIcon({
            className: 'custom-map-marker',
            html: `<div class="marker-circle marker-${point.color}"><div class="marker-inner"></div></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });

        // Contenido del Popup con estilos premium ecológicos
        const popupContent = `
            <div class="popup-container">
                <div class="popup-header">
                    <i class="ph-bold ph-sketch-logo"></i>
                    <h4>${point.name}</h4>
                </div>
                <div class="popup-body">
                    <p><strong>Tipo:</strong> ${point.type}</p>
                    <p><strong>Biodiversidad:</strong> ${point.level}</p>
                    <p><strong>Observación:</strong> ${point.observation}</p>
                    <p style="border-top:1px solid rgba(255,255,255,0.08); padding-top:6px; margin-top:6px; font-style: italic;">
                        <strong>Sugerencia STEM:</strong> ${point.recommendation}
                    </p>
                </div>
            </div>
        `;

        // Crear marcador y asociar popup
        L.marker([point.lat, point.lng], { icon: customIcon })
            .addTo(map)
            .bindPopup(popupContent);
    });

    // Actualizar indicador lateral
    const totalZonesEl = document.getElementById('totalMapZones');
    if (totalZonesEl) {
        totalZonesEl.textContent = points.length.toString();
    }
}

/* --------------------------------------------------------------------------
   2. ANIMACIÓN DE APARICIÓN AL DESPLAZARSE (SCROLL REVEAL)
   -------------------------------------------------------------------------- */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    // Deja de observar una vez animado
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null, // viewport
            threshold: 0.15, // 15% del elemento visible
            rootMargin: "0px 0px -50px 0px"
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback en caso de navegadores antiguos
        revealElements.forEach(el => el.classList.add('active'));
    }
}

/* --------------------------------------------------------------------------
   3. MENÚ DE NAVEGACIÓN Y MENÚ ADHESIVO
   -------------------------------------------------------------------------- */
function initNavigation() {
    const header = document.querySelector('.main-header');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Transición del header al hacer scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Resaltar enlace de navegación activo según sección en pantalla
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150; // offset por cabecera fija
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        // Mapear IDs de secciones secundarias a los IDs de los enlaces del menú principal
        const sectionMap = {
            'portada': 'portada',
            'que-es': 'que-es',
            'importancia': 'que-es',
            'trazabilidad': 'que-es',
            'mejoras': 'funcionamiento',
            'funcionamiento': 'funcionamiento',
            'componentes': 'funcionamiento',
            'datos': 'datos',
            'analisis': 'datos',
            'alertas': 'datos',
            'mapa': 'datos',
            'enfoque-stem': 'que-es',
            'aprendizajes': 'que-es',
            'resultados': 'que-es',
            'galeria': 'galeria',
            'compromiso': 'compromiso'
        };

        const targetActiveId = sectionMap[currentSectionId] || currentSectionId;

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${targetActiveId}`) {
                link.classList.add('active');
            }
        });
    });

    // Toggle menú móvil
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('open');
            // Cambiar icono de menú a cerrar si está abierto
            const icon = navToggle.querySelector('i');
            if (navMenu.classList.contains('open')) {
                icon.className = 'ph-bold ph-x';
            } else {
                icon.className = 'ph-bold ph-list';
            }
        });

        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navMenu.classList.remove('open');
                const icon = navToggle.querySelector('i');
                if (icon) icon.className = 'ph-bold ph-list';
            }
        });
    }

    // Cerrar menú móvil al hacer clic en un enlace (o en el botón de compromiso)
    const allHeaderLinks = document.querySelectorAll('.nav-link, .cta-header');
    allHeaderLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu) navMenu.classList.remove('open');
            if (navToggle) {
                const icon = navToggle.querySelector('i');
                if (icon) icon.className = 'ph-bold ph-list';
            }
        });
    });
}

/* --------------------------------------------------------------------------
   4. INTERACTIVIDAD EN LA TABLA DE DATOS MUESTRA
   -------------------------------------------------------------------------- */
function initDataTableInteractive() {
    const rangeFilter = document.getElementById('dataRangeFilter');
    const tableBody = document.getElementById('dataTableBody');
    if (!rangeFilter || !tableBody) return;

    // Datos simulados para interactividad
    const dataSets = {
        dia: [
            { hora: "08:00 AM", temp: "22.5 °C", hum: "78%", pres: "1012 hPa", alert: "favorable", desc: "Abejas activas recolectando polen.", statusText: "Favorable" },
            { hora: "12:00 PM", temp: "28.3 °C", hum: "52%", pres: "1010 hPa", alert: "favorable", desc: "Gran actividad en las cañas de bambú.", statusText: "Favorable" },
            { hora: "03:00 PM", temp: "31.5 °C", hum: "43%", pres: "1009 hPa", alert: "moderado", desc: "Temperatura elevada, abejas buscan sombra.", statusText: "Moderado" },
            { hora: "07:00 PM", temp: "24.1 °C", hum: "68%", pres: "1011 hPa", alert: "favorable", desc: "Retorno al nido, actividad baja por luz.", statusText: "Favorable" }
        ],
        calor: [
            { hora: "11:00 AM", temp: "32.0 °C", hum: "40%", pres: "1009 hPa", alert: "moderado", desc: "Calor ascendente, abejas ralentizan vuelo.", statusText: "Moderado" },
            { hora: "01:00 PM", temp: "34.5 °C", hum: "35%", pres: "1008 hPa", alert: "desfavorable", desc: "Alerta de estrés térmico activo. Poca actividad.", statusText: "Desfavorable" },
            { hora: "02:00 PM", temp: "35.2 °C", hum: "32%", pres: "1007 hPa", alert: "desfavorable", desc: "Monitoreo crítico por alta temperatura.", statusText: "Desfavorable" },
            { hora: "04:00 PM", temp: "32.8 °C", hum: "38%", pres: "1009 hPa", alert: "moderado", desc: "Comienza a descender el calor extremo.", statusText: "Moderado" }
        ],
        lluvia: [
            { hora: "09:00 AM", temp: "19.2 °C", hum: "92%", pres: "1014 hPa", alert: "moderado", desc: "Llovizna leve, refugio lleno de polinizadores.", statusText: "Moderado" },
            { hora: "11:00 AM", temp: "17.5 °C", hum: "98%", pres: "1015 hPa", alert: "desfavorable", desc: "Lluvia intensa. Actividad de vuelo nula.", statusText: "Desfavorable" },
            { hora: "02:00 PM", temp: "20.1 °C", hum: "88%", pres: "1013 hPa", alert: "moderado", desc: "Cese de lluvia, algunas abejas salen a explorar.", statusText: "Moderado" },
            { hora: "05:00 PM", temp: "21.0 °C", hum: "82%", pres: "1012 hPa", alert: "favorable", desc: "Clima fresco estable, baja actividad nocturna.", statusText: "Favorable" }
        ]
    };

    // Función para renderizar filas
    function renderTableRows(filterKey) {
        const rows = dataSets[filterKey] || dataSets['dia'];
        tableBody.innerHTML = ''; // Limpiar filas

        rows.forEach(item => {
            const tr = document.createElement('tr');
            
            // Determinar color de alerta para el badge
            let badgeClass = 'data-badge-var';
            if (item.alert === 'favorable') badgeClass += ' temp'; // verde/favorable
            if (item.alert === 'moderado') badgeClass += ' pres'; // amarillo
            if (item.alert === 'desfavorable') badgeClass += ' temp'; // rojo (se usará color custom)

            // Asignar colores de texto específicos para los estados
            let alertColor = 'var(--color-green-neon)';
            if (item.alert === 'moderado') alertColor = 'var(--color-honey)';
            if (item.alert === 'desfavorable') alertColor = 'var(--color-red-alert)';

            tr.innerHTML = `
                <td style="font-weight:600; color:#ffffff;">${item.hora}</td>
                <td><span class="data-badge-var temp">${item.temp}</span></td>
                <td><span class="data-badge-var hum">${item.hum}</span></td>
                <td><span class="data-badge-var pres">${item.pres}</span></td>
                <td style="color:${alertColor}; font-weight:700;"><i class="ph-bold ph-circle" style="font-size:0.75rem; margin-right:6px;"></i>${item.statusText}</td>
                <td style="font-size:0.9rem;">${item.desc}</td>
            `;
            tableBody.appendChild(tr);
        });
    }

    // Escuchar el cambio en el select de filtro
    rangeFilter.addEventListener('change', (e) => {
        renderTableRows(e.target.value);
    });

    // Renderizado inicial por defecto
    renderTableRows('dia');
}

/* --------------------------------------------------------------------------
   5. INTERACTIVIDAD DE ABEJAS VOLADORAS (POLEN & GIROS)
   -------------------------------------------------------------------------- */
function initInteractiveBees() {
    const bees = document.querySelectorAll('.floating-bee-ambient');
    if (!bees.length) return;

    bees.forEach(bee => {
        // Escuchar clics para soltar partículas de polen y hacer pirueta (giro)
        bee.addEventListener('click', (e) => {
            createPollenExplosion(e.clientX, e.clientY);
            
            const emoji = bee.querySelector('.bee-emoji');
            if (emoji && !emoji.classList.contains('spinning')) {
                emoji.classList.add('spinning');
                setTimeout(() => {
                    emoji.classList.remove('spinning');
                }, 600);
            }
        });
    });
}

function createPollenExplosion(x, y) {
    const particleCount = 12;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'pollen-particle';
        document.body.appendChild(particle);
        
        // Posición inicial del clic
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        
        // Parámetros aleatorios de dispersión
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 90 + 30; // Velocidad de explosión
        const size = Math.random() * 7 + 4; // Tamaño aleatorio 4px - 11px
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity + 50; // Gravedad: cae hacia abajo
        
        // Animación moderna usando la API web de animaciones
        particle.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
        ], {
            duration: 800 + Math.random() * 400,
            easing: 'cubic-bezier(0.1, 0.8, 0.3, 1)',
            fill: 'forwards'
        });
        
        // Eliminar del DOM al finalizar
        setTimeout(() => {
            particle.remove();
        }, 1200);
    }
}
