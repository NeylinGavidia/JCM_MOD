'use strict';

/*configuraciones iniciales*/

const APP = {
    usuario: 'directora',
    clave: 'demo2026',
    nombre: 'Directora',
    cargo: 'Dirección General',
    institucion: 'I.E. "José Carlos Mariátegui" - Conchán',
    claveDatos: 'jcm_demo_datos',
    versionDatos: 2,
    claveSesion: 'jcm_demo_sesion'
};

const MENU = [
    { id: 'principal', href: 'principal.html', icono: 'dashboard', texto: 'Panel Principal y Aforos' },
    { id: 'matricula', href: 'matricula.html', icono: 'how_to_reg', texto: 'Matrícula y Estudiantes' },
    { id: 'apoderados', href: 'apoderados.html', icono: 'supervisor_account', texto: 'Registro de Apoderados' },
    { id: 'tramites', href: 'tramites.html', icono: 'description', texto: 'Mesa de Partes y Trámites' },
    { id: 'reportes', href: 'reportes.html', icono: 'analytics', texto: 'Reportes y Estadísticas' }
];

const PROXIMAMENTE = {
    matricula: { titulo: 'Matrícula y Estudiantes', texto: 'Aquí se registrará la matrícula: validación de DNI, vacante en la sección y apoderado.' },
    apoderados: { titulo: 'Registro de Apoderados', texto: 'Aquí se registrarán los apoderados y se vincularán a sus estudiantes.' },
    tramites: { titulo: 'Mesa de Partes y Trámites', texto: 'Aquí se verá la bandeja de expedientes: recepción, derivación y atención. Por ahora puedes recepcionar un documento desde el panel principal.' },
    reportes: { titulo: 'Reportes y Estadísticas', texto: 'Aquí se generará el padrón de matrícula y los reportes de aforo.' }
};

/* Datos de ejemplo: se guardan en localStorage de este navegador */
function datosIniciales() {
    return {
        version: APP.versionDatos,
        aforo: [
            { seccion: '1° A', capacidad: 30, matriculados: 28 },
            { seccion: '2° A', capacidad: 30, matriculados: 30 },
            { seccion: '2° B', capacidad: 30, matriculados: 24 },
            { seccion: '3° A', capacidad: 30, matriculados: 19 },
            { seccion: '4° A', capacidad: 30, matriculados: 27 },
            { seccion: '5° A', capacidad: 30, matriculados: 15 }
        ],
        apoderados: 142,
        tramites: [
            { codigo: 'EXP-2026-0003', remitente: 'Rosa Díaz Quispe', dni: '41256873', tipo: 'Solicitud', asunto: 'Traslado de matrícula', folios: 3, fecha: '2026-10-30T09:40:00', estado: 'Pendiente' },
            { codigo: 'EXP-2026-0002', remitente: 'Luis Chávez Torres', dni: '27894561', tipo: 'Constancia', asunto: 'Constancia de estudios', folios: 1, fecha: '2026-10-29T11:15:00', estado: 'En revisión' },
            { codigo: 'EXP-2026-0001', remitente: 'María Huamán Rojas', dni: '45123987', tipo: 'Certificado', asunto: 'Certificado de nacimiento', folios: 2, fecha: '2026-10-28T08:05:00', estado: 'Atendido' }
        ]
    };
}

function esc(texto) {
    return String(texto).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function guardarDatos(datos) {
    try {
        localStorage.setItem(APP.claveDatos, JSON.stringify(datos));
        return true;
    } catch (e) {
        mostrarToast('No se pudo guardar en este navegador. Revisa que no esté en modo privado.', 'error');
        return false;
    }
}

function leerDatos() {
    try {
        const crudo = localStorage.getItem(APP.claveDatos);
        if (crudo) {
            const datos = JSON.parse(crudo);
            if (datos.version === APP.versionDatos) return datos;
        }
    } catch (e) { /* si falla, se vuelve a crear */ }
    const datos = datosIniciales();
    guardarDatos(datos);
    return datos;
}

function sesionActiva() {
    try { return sessionStorage.getItem(APP.claveSesion) === '1'; } catch (e) { return false; }
}

function mostrarToast(mensaje, tipo) {
    let caja = document.querySelector('.toasts');
    if (!caja) {
        caja = document.createElement('div');
        caja.className = 'toasts';
        caja.setAttribute('role', 'status');
        caja.setAttribute('aria-live', 'polite');
        document.body.appendChild(caja);
    }
    const iconos = { ok: 'check_circle', warn: 'warning', error: 'error' };
    const t = document.createElement('div');
    t.className = 'toast ' + (tipo === 'warn' || tipo === 'error' ? tipo : '');
    t.innerHTML = '<span class="material-symbols-outlined">' + (iconos[tipo] || iconos.ok) + '</span><span>' + esc(mensaje) + '</span>';
    caja.appendChild(t);
    setTimeout(() => t.remove(), tipo === 'ok' ? 4000 : 6000);
}

function confirmar({ titulo, mensaje, textoOk = 'Aceptar', peligro = false }) {
    return new Promise(resolve => {
        const dlg = document.createElement('dialog');
        dlg.className = 'modal';
        dlg.innerHTML = '<h3>' + esc(titulo) + '</h3><p>' + esc(mensaje) + '</p>' +
            '<div class="modal-acciones"><button class="btn btn-sec" data-r="0">Cancelar</button>' +
            '<button class="btn ' + (peligro ? 'btn-error' : 'btn-pri') + '" data-r="1">' + esc(textoOk) + '</button></div>';
        document.body.appendChild(dlg);
        dlg.addEventListener('click', e => {
            const b = e.target.closest('[data-r]');
            if (b) dlg.close(b.dataset.r);
        });
        dlg.addEventListener('close', () => { const ok = dlg.returnValue === '1'; dlg.remove(); resolve(ok); });
        dlg.showModal();
    });
}

async function cerrarSesion() {
    const ok = await confirmar({
        titulo: '¿Cerrar la sesión?',
        mensaje: 'Saldrás del sistema. Tus datos de demostración seguirán guardados en este navegador.',
        textoOk: 'Cerrar sesión',
        peligro: true
    });
    if (!ok) return;
    try { sessionStorage.removeItem(APP.claveSesion); } catch (e) { /* nada */ }
    location.href = 'index.html';
}

function montarEstructura(pagina) {
    if (document.querySelector('.topbar')) return; // evita montar el menú dos veces
    const encabezado = document.createElement('header');
    encabezado.className = 'topbar';
    encabezado.innerHTML =
        '<div class="topbar-izq">' +
        '<button class="icon-btn menu-toggle" type="button" aria-label="Abrir o cerrar el menú"><span class="material-symbols-outlined">menu</span></button>' +
        '<div class="logo"><span class="material-symbols-outlined">school</span></div>' +
        '<div><h1>' + esc(APP.institucion) + '<span class="insignia">Demo</span></h1><small>Módulo de ' + esc(APP.cargo) + ' • Gestión 2026</small></div>' +
        '</div>' +
        '<div class="topbar-der">' +
        '<div class="sesion"><i></i>Sesión segura</div>' +
        '<div class="usuario"><b>' + esc(APP.nombre) + '</b><span>' + esc(APP.cargo) + '</span></div>' +
        '<button class="icon-btn" id="btn-salir" type="button" title="Cerrar sesión" aria-label="Cerrar sesión"><span class="material-symbols-outlined">lock</span></button>' +
        '</div>';

    const lateral = document.createElement('aside');
    lateral.className = 'sidebar';
    lateral.id = 'menu-lateral';
    lateral.innerHTML =
        '<div><div class="sidebar-titulo">Navegación institucional</div><nav aria-label="Menú principal">' +
        MENU.map(m => '<a href="' + m.href + '"' + (m.id === pagina ? ' aria-current="page"' : '') + '>' +
            '<span class="material-symbols-outlined">' + m.icono + '</span>' + esc(m.texto) + '</a>').join('') +
        '</nav></div>' +
        '<div class="anio"><div><span>Año académico</span><b>2026 - Ordinario</b></div><span class="material-symbols-outlined">calendar_today</span></div>';

    document.body.prepend(lateral);
    document.body.prepend(encabezado);

    encabezado.querySelector('#btn-salir').addEventListener('click', cerrarSesion);
    encabezado.querySelector('.menu-toggle').addEventListener('click', () => lateral.classList.toggle('abierto'));
    lateral.addEventListener('click', e => { if (e.target.closest('a')) lateral.classList.remove('abierto'); });

    const contenido = document.getElementById('contenido');
    if (contenido) {
        const aviso = document.createElement('div');
        aviso.className = 'aviso-demo';
        aviso.setAttribute('role', 'note');
        aviso.innerHTML = '<span class="material-symbols-outlined">info</span><span><b>Prototipo de demostración.</b> Los datos se guardan solo en este navegador y no se envían a ningún servidor.</span>';
        contenido.prepend(aviso);

        if (PROXIMAMENTE[pagina] && contenido.hasAttribute('data-proximamente')) {
            const p = PROXIMAMENTE[pagina];
            contenido.insertAdjacentHTML('beforeend',
                '<div class="cabecera-pagina"><h2>' + esc(p.titulo) + '</h2></div>' +
                '<div class="tarjeta en-construccion"><span class="material-symbols-outlined">construction</span>' +
                '<h3>Este módulo se agregará en el siguiente paso</h3><p>' + esc(p.texto) + '</p>' +
                '<a class="btn btn-pri" href="principal.html">Volver al panel</a></div>');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const pagina = document.body.dataset.page;
    if (!pagina || pagina === 'login') return;
    if (!sesionActiva()) { location.replace('index.html'); return; }
    montarEstructura(pagina);
});
