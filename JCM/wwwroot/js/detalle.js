'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-seguimiento');
    const contenedor = document.getElementById('detalle-expediente');
    if (!form || !contenedor) return;

    const codigo = new URLSearchParams(location.search).get('codigo');
    const datos = leerDatos();
    const documento = datos.tramites.find((tramite) => tramite.codigo === codigo);

    if (!documento) {
        contenedor.innerHTML = '<section class="form-section full-width"><h3>No se encontró el expediente</h3><p>Regresa a la bandeja de trámites y selecciona un registro existente.</p></section>';
        form.hidden = true;
        return;
    }

    function campo(etiqueta, valor) {
        return '<p><strong>' + esc(etiqueta) + ':</strong> ' + esc(valor || '—') + '</p>';
    }

    contenedor.innerHTML =
        '<section class="form-section"><h3 class="form-section-title">Datos del remitente</h3>' +
        campo('Nombres', documento.remitente) +
        campo('DNI', documento.dni) +
        campo('Correo', documento.correo) + '</section>' +
        '<section class="form-section"><h3 class="form-section-title">Datos del documento</h3>' +
        campo('Código', documento.codigo) +
        campo('Tipo', documento.tipo) +
        campo('Asunto', documento.asunto) +
        campo('Folios', documento.folios) +
        campo('Archivo adjunto', documento.archivo) +
        campo('Fecha de recepción', documento.fecha ? new Date(documento.fecha).toLocaleString('es-PE') : '') + '</section>';

    const estado = document.getElementById('estado-seguimiento');
    if (!Array.from(estado.options).some((opcion) => opcion.value === documento.estado)) {
        const opcion = document.createElement('option');
        opcion.value = documento.estado;
        opcion.textContent = documento.estado;
        estado.appendChild(opcion);
    }
    estado.value = documento.estado;
    document.getElementById('observacion-seguimiento').value = documento.observacion || '';

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const datosActuales = leerDatos();
        const indice = datosActuales.tramites.findIndex((tramite) => tramite.codigo === codigo);
        if (indice < 0) {
            mostrarToast('No se encontró el expediente en los registros actuales.', 'error');
            return;
        }
        datosActuales.tramites[indice] = {
            ...datosActuales.tramites[indice],
            estado: estado.value,
            observacion: document.getElementById('observacion-seguimiento').value.trim()
        };
        if (guardarDatos(datosActuales)) {
            mostrarToast('Seguimiento actualizado correctamente.', 'ok');
            window.setTimeout(() => { location.href = 'tramites.html'; }, 800);
        }
    });
});
