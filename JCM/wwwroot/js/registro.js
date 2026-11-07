'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formRegistro');
    if (!form) return;

    const dni = document.getElementById('dniRemitente');
    const folios = document.getElementById('folios');
    const archivo = document.getElementById('archivoAdjunto');

    dni.addEventListener('input', () => {
        dni.value = dni.value.replace(/\D/g, '').slice(0, 8);
    });

    archivo.addEventListener('change', () => {
        const file = archivo.files[0];
        if (!file) return;
        const tiposPermitidos = ['application/pdf', 'image/jpeg', 'image/png'];
        if (!tiposPermitidos.includes(file.type) || file.size > 5 * 1024 * 1024) {
            mostrarToast('Adjunta un PDF, JPG o PNG de máximo 5 MB.', 'warn');
            archivo.value = '';
        }
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!form.checkValidity()) {
            mostrarToast('Completa los campos obligatorios y corrige los datos inválidos.', 'warn');
            form.reportValidity();
            return;
        }
        if (!/^\d{8}$/.test(dni.value)) {
            dni.setCustomValidity('El DNI debe tener exactamente 8 dígitos.');
            dni.reportValidity();
            dni.setCustomValidity('');
            return;
        }
        const cantidadFolios = Number(folios.value);
        if (!Number.isInteger(cantidadFolios) || cantidadFolios < 1 || cantidadFolios > 500) {
            mostrarToast('El número de folios debe estar entre 1 y 500.', 'warn');
            folios.focus();
            return;
        }

        const datos = leerDatos();
        const siguiente = datos.tramites.reduce((maximo, documento) => {
            const numero = Number(String(documento.codigo || '').split('-').pop());
            return Number.isInteger(numero) ? Math.max(maximo, numero) : maximo;
        }, 0) + 1;
        const codigo = 'EXP-' + new Date().getFullYear() + '-' + String(siguiente).padStart(4, '0');
        const documento = {
            codigo,
            remitente: document.getElementById('nombreRemitente').value.trim(),
            dni: dni.value,
            correo: document.getElementById('correoRemitente').value.trim(),
            tipo: document.getElementById('tipoDocumento').value,
            asunto: document.getElementById('asunto').value.trim(),
            folios: cantidadFolios,
            archivo: archivo.files[0].name,
            fecha: new Date().toISOString(),
            estado: 'Registrado',
            observacion: ''
        };
        datos.tramites.unshift(documento);
        if (!guardarDatos(datos)) return;

        mostrarToast('Documento registrado. Se generó el expediente ' + codigo + '.', 'ok');
        window.location.href = 'detalle.html?codigo=' + encodeURIComponent(codigo);
    });
});
