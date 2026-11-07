'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const tbody = document.getElementById('tbody-tramites');
    if (!tbody) return;

    let datos = leerDatos();
    const buscar = document.getElementById('buscar-tramite');
    const filtroTipo = document.getElementById('filtro-tipo');
    const filtroEstado = document.getElementById('filtro-estado');

    function importarBandejaAnterior() {
        try {
            if (localStorage.getItem('jcm_demo_bandeja_migrada') === '1') return;
            const anterior = localStorage.getItem('jcm_demo_bandeja');
            if (anterior) {
                const documentos = JSON.parse(anterior);
                if (!Array.isArray(documentos)) throw new Error('La bandeja anterior tiene un formato no válido.');
                const codigos = new Set(datos.tramites.map((documento) => String(documento.codigo)));
                documentos.forEach((documento) => {
                    if (!documento.codigo || codigos.has(String(documento.codigo))) return;
                    datos.tramites.push({
                        ...documento,
                        fecha: documento.fecha || new Date().toISOString()
                    });
                    codigos.add(String(documento.codigo));
                });
                if (!guardarDatos(datos)) return;
            }
            localStorage.setItem('jcm_demo_bandeja_migrada', '1');
        } catch (error) {
            mostrarToast('No se pudieron integrar los expedientes guardados en la antigua bandeja: ' + error.message, 'error');
        }
    }

    function guardarTramites(tramites) {
        const anteriores = datos.tramites;
        datos.tramites = tramites;
        if (!guardarDatos(datos)) {
            datos.tramites = anteriores;
            return false;
        }
        return true;
    }

    function fechaLegible(fecha) {
        const valor = new Date(fecha);
        return Number.isNaN(valor.getTime()) ? '—' : valor.toLocaleDateString('es-PE');
    }

    function claseEstado(estado) {
        const normalizado = String(estado || '').toLowerCase();
        if (normalizado === 'atendido') return 'status-atendido';
        if (normalizado === 'observado') return 'status-observado';
        if (normalizado.includes('revisión')) return 'status-revision';
        return 'status-registrado';
    }

    function renderizar() {
        const termino = buscar.value.trim().toLocaleLowerCase('es');
        const tipo = filtroTipo.value;
        const estado = filtroEstado.value;
        const tramites = datos.tramites || [];
        const visibles = tramites.filter((documento) => {
            const texto = [documento.codigo, documento.remitente, documento.dni, documento.asunto]
                .join(' ').toLocaleLowerCase('es');
            return (!termino || texto.includes(termino)) &&
                (!tipo || documento.tipo === tipo) &&
                (!estado || String(documento.estado).toLocaleLowerCase('es') === estado);
        });

        document.getElementById('total-documentos').textContent = tramites.length;
        document.getElementById('total-pendientes').textContent = tramites.filter((documento) =>
            ['registrado', 'pendiente', 'en revisión'].includes(String(documento.estado).toLocaleLowerCase('es'))
        ).length;
        document.getElementById('total-atendidos').textContent = tramites.filter((documento) =>
            String(documento.estado).toLocaleLowerCase('es') === 'atendido'
        ).length;
        document.getElementById('total-observados').textContent = tramites.filter((documento) =>
            String(documento.estado).toLocaleLowerCase('es') === 'observado'
        ).length;

        if (!visibles.length) {
            tbody.innerHTML = '<tr><td colspan="7" class="vacio">No hay expedientes que coincidan con la búsqueda.</td></tr>';
            return;
        }
        tbody.innerHTML = visibles.map((documento) => `
            <tr data-id="${esc(documento.codigo)}">
                <td><strong>${esc(documento.codigo)}</strong></td>
                <td>${esc(documento.remitente)}</td>
                <td>${esc(documento.tipo)}</td>
                <td class="celda-asunto">${esc(documento.asunto)}</td>
                <td>${esc(fechaLegible(documento.fecha))}</td>
                <td><span class="status-badge ${claseEstado(documento.estado)}">${esc(documento.estado)}</span></td>
                <td>
                    <a class="btn btn-ver-expediente" href="detalle.html?codigo=${encodeURIComponent(documento.codigo)}" aria-label="Ver expediente ${esc(documento.codigo)}" title="Ver expediente">
                        <span class="material-symbols-outlined" aria-hidden="true">visibility</span>
                    </a>
                    ${accionesCrudLista(documento.codigo)}
                </td>
            </tr>`).join('');
    }

    importarBandejaAnterior();
    renderizar();
    buscar.addEventListener('input', renderizar);
    filtroTipo.addEventListener('change', renderizar);
    filtroEstado.addEventListener('change', renderizar);
    window.addEventListener('storage', (event) => {
        if (event.key === APP.claveDatos) {
            datos = leerDatos();
            renderizar();
        }
    });

    habilitarCrudLista({
        tbodyId: 'tbody-tramites',
        idField: 'codigo',
        campos: camposEdicionTramite(),
        leerRegistros: () => datos.tramites,
        guardarRegistros: guardarTramites,
        alCambiar: renderizar
    });
});
