
'use strict';

document.addEventListener('DOMContentLoaded', () => {

    const botones = document.querySelectorAll('.opcion-reporte');
    const resultado = document.getElementById('resultado');
    const tituloFiltro = document.getElementById('titulo-filtro');

    const filtroGrado = document.getElementById('filtro-grado');
    const filtroSeccion = document.getElementById('filtro-seccion');
    const filtroFecha = document.getElementById('filtro-fecha');
    const filtroTipo = document.getElementById('filtro-tipo');

    const btnGenerar = document.getElementById('generar');
    const btnLimpiar = document.getElementById('limpiar');
    const btnPDF = document.getElementById('descargar-pdf');
    const btnExcel = document.getElementById('descargar-excel');

    let tipoActual = 'matricula';
    let filasActuales = [];
    let encabezadosActuales = [];
    let tituloActual = '';

    // Obtener los datos guardados por el sistema
    function obtenerDatos() {
        function leerLista(clave) {
            try {
                const valor = JSON.parse(localStorage.getItem(clave) || '[]');
                return Array.isArray(valor) ? valor : [];
            } catch (error) {
                console.error('Error al leer ' + clave, error);
                return [];
            }
        }

        let datosGenerales = {};

        if (typeof leerDatos === 'function') {
            datosGenerales = leerDatos() || {};
        } else {
            try {
                datosGenerales = JSON.parse(
                    localStorage.getItem('jcm_demo_datos') || '{}'
                );
            } catch (error) {
                datosGenerales = {};
            }
        }

        return {
            ...datosGenerales,
            estudiantes: leerLista('jcm_demo_estudiantes'),
            matriculas: leerLista('jcm_demo_matriculas'),
            apoderados: leerLista('jcm_demo_apoderados'),
            asignaciones: leerLista('jcm_demo_asignaciones'),
            aforo: Array.isArray(datosGenerales.aforo)
                ? datosGenerales.aforo
                : [],
            tramites: Array.isArray(datosGenerales.tramites)
                ? datosGenerales.tramites
                : []
        };
    }
    function obtenerEstadisticasMatricula(datos) {
        const anioSeleccionado = document.getElementById('anio').value;

        const estudiantes = datos.estudiantes || [];
        const matriculas = datos.matriculas || [];
        const apoderados = datos.apoderados || [];
        const asignaciones = datos.asignaciones || [];

        function obtenerAnio(matricula) {
            if (matricula.anioLectivo) {
                return String(matricula.anioLectivo);
            }

            if (matricula.fechaMatricula) {
                return String(matricula.fechaMatricula).substring(0, 4);
            }

            return '';
        }

        function normalizarEstado(estado) {
            return String(estado || '')
                .trim()
                .toLowerCase();
        }

        const matriculasDelAnio = matriculas.filter(matricula =>
            obtenerAnio(matricula) === String(anioSeleccionado)
        );

        const idsMatriculados = new Set(
            matriculasDelAnio
                .filter(matricula => {
                    const estado = normalizarEstado(matricula.estado);

                    return estado === 'finalizado' ||
                        estado === 'ratificado';
                })
                .map(matricula => String(matricula.estudianteId))
                .filter(id => id && id !== 'undefined' && id !== 'null')
        );

        const idsEstudiantes = new Set(
            estudiantes
                .map(estudiante => String(estudiante.id))
                .filter(id => id && id !== 'undefined' && id !== 'null')
        );

        // Evita contar matrículas de estudiantes que no están en el padrón.
        const totalMatriculados = [...idsMatriculados]
            .filter(id => idsEstudiantes.has(id))
            .length;

        const totalEstudiantes = idsEstudiantes.size;

        const totalPendientes = Math.max(
            0,
            totalEstudiantes - totalMatriculados
        );

        const idsApoderados = new Set(
            apoderados
                .map(apoderado => String(apoderado.id))
                .filter(id => id && id !== 'undefined' && id !== 'null')
        );

        const idsApoderadosAsociados = new Set(
            asignaciones
                .map(asignacion => String(asignacion.apoderadoId))
                .filter(id => idsApoderados.has(id))
        );

        return {
            totalEstudiantes,
            totalMatriculados,
            totalPendientes,
            totalApoderados: idsApoderados.size,
            apoderadosAsociados: idsApoderadosAsociados.size,
            totalAsociaciones: asignaciones.length
        };
    }

    // Escapar texto para mostrarlo en la tabla
    function seguro(texto) {
        if (typeof esc === 'function') {
            return esc(texto ?? '');
        }

        return String(texto ?? '').replace(/[&<>"']/g, c => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        })[c]);
    }

    // Cambiar entre los tres tipos de reportes
    function cambiarTipo(tipo) {
        tipoActual = tipo;

        botones.forEach(boton => {
            boton.classList.toggle(
                'activo',
                boton.dataset.tipo === tipo
            );
        });

        filtroGrado.hidden = tipo !== 'matricula';
        filtroSeccion.hidden = tipo !== 'matricula';

        filtroFecha.hidden = tipo !== 'documentos';
        filtroTipo.hidden = tipo !== 'documentos';

        const titulos = {
            matricula: 'Filtros del reporte de matrícula',
            documentos: 'Filtros de documentos recibidos',
            consolidado: 'Reporte consolidado general'
        };

        tituloFiltro.textContent = titulos[tipo];

        generarReporte();
    }

    // Preparar la información del reporte de matrícula
    function reporteMatricula(datos) {
        const grado = document.getElementById('grado').value;
        const seccion = document.getElementById('seccion').value;

        const estadisticas = obtenerEstadisticasMatricula(datos);
        const aforo = datos.aforo || [];

        const registros = aforo.filter(item => {
            const cumpleGrado =
                grado === 'Todos' ||
                String(item.seccion || '').startsWith(grado);

            const cumpleSeccion =
                seccion === 'Todas' ||
                String(item.seccion || '').endsWith(seccion);

            return cumpleGrado && cumpleSeccion;
        });

        const totalCapacidad = registros.reduce(
            (suma, item) => suma + Number(item.capacidad || 0),
            0
        );

        const totalVacantes = Math.max(
            0,
            totalCapacidad - estadisticas.totalMatriculados
        );

        tituloActual = 'Reporte de matrículas';

        encabezadosActuales = [
            'Sección',
            'Capacidad',
            'Matriculados',
            'Vacantes'
        ];

        filasActuales = registros.map(item => [
            item.seccion,
            item.capacidad,
            item.matriculados,
            Math.max(
                0,
                Number(item.capacidad || 0) -
                Number(item.matriculados || 0)
            )
        ]);

        const resumen =
            `Año ${document.getElementById('anio').value}` +
            ` | Estudiantes registrados: ${estadisticas.totalEstudiantes}` +
            ` | Estudiantes matriculados: ${estadisticas.totalMatriculados}` +
            ` | Estudiantes pendientes: ${estadisticas.totalPendientes}` +
            ` | Apoderados registrados: ${estadisticas.totalApoderados}` +
            ` | Capacidad de las secciones mostradas: ${totalCapacidad}` +
            ` | Vacantes según el aforo mostrado: ${totalVacantes}`;

        mostrarTabla(
            tituloActual,
            encabezadosActuales,
            filasActuales,
            resumen
        );
    }

    // Preparar la información de documentos recibidos
    function reporteDocumentos(datos) {
        const fecha = document.getElementById('fecha').value;
        const tipo = document.getElementById('tipo-documento').value;

        const tramites = datos.tramites || [];

        const registros = tramites.filter(item => {
            const cumpleFecha =
                !fecha || String(item.fecha || '').startsWith(fecha);

            const cumpleTipo =
                tipo === 'Todos' || item.tipo === tipo;

            return cumpleFecha && cumpleTipo;
        });

        tituloActual = 'Reporte de documentos recibidos';

        encabezadosActuales = [
            'Código',
            'Remitente',
            'Tipo',
            'Asunto',
            'Fecha',
            'Estado'
        ];

        filasActuales = registros.map(item => [
            item.codigo,
            item.remitente,
            item.tipo,
            item.asunto,
            item.fecha ? item.fecha.replace('T', ' ') : '',
            item.estado
        ]);

        const pendientes = registros.filter(
            item => item.estado === 'Pendiente'
        ).length;

        const atendidos = registros.filter(
            item => item.estado === 'Atendido'
        ).length;

        const revision = registros.filter(
            item => item.estado === 'En revisión'
        ).length;

        mostrarTabla(
            tituloActual,
            encabezadosActuales,
            filasActuales,
            `Total de documentos: ${registros.length} | Pendientes: ${pendientes} | En revisión: ${revision} | Atendidos: ${atendidos}`
        );
    }

    // Preparar el consolidado general
    function reporteConsolidado(datos) {
        const estadisticas = obtenerEstadisticasMatricula(datos);

        const tramites = datos.tramites || [];
        const aforo = datos.aforo || [];

        const capacidad = aforo.reduce(
            (suma, item) => suma + Number(item.capacidad || 0), 0
        );

        const matriculadosAforo = aforo.reduce(
            (suma, item) => suma + Number(item.matriculados || 0), 0
        );

        const vacantes = Math.max(0, capacidad - matriculadosAforo);

        const pendientesDocumentos = tramites.filter(
            item => item.estado === 'Pendiente'
        ).length;

        const revision = tramites.filter(
            item => item.estado === 'En revisión'
        ).length;

        const atendidos = tramites.filter(
            item => item.estado === 'Atendido'
        ).length;

        tituloActual = 'Consolidado general institucional';

        encabezadosActuales = ['Indicador', 'Cantidad'];

        filasActuales = [
            ['Estudiantes registrados', estadisticas.totalEstudiantes],
            ['Estudiantes matriculados', estadisticas.totalMatriculados],
            ['Estudiantes pendientes de matrícula', estadisticas.totalPendientes],
            ['Apoderados registrados', estadisticas.totalApoderados],
            ['Apoderados asociados a estudiantes', estadisticas.apoderadosAsociados],
            ['Asociaciones apoderado-estudiante', estadisticas.totalAsociaciones],
            ['Capacidad total de secciones', capacidad],
            ['Vacantes según aforo registrado', vacantes],
            ['Documentos recibidos', tramites.length],
            ['Documentos pendientes', pendientesDocumentos],
            ['Documentos en revisión', revision],
            ['Documentos atendidos', atendidos]
        ];

        mostrarTabla(
            tituloActual,
            encabezadosActuales,
            filasActuales,
            'Resumen institucional del año ' +
            document.getElementById('anio').value
        );
    }

    // Mostrar el resultado en pantalla
    function mostrarTabla(titulo, encabezados, filas, resumen) {
        let html = `<h3>${seguro(titulo)}</h3>`;

        html += `<p>${seguro(resumen)}</p>`;

        if (filas.length === 0) {
            html += '<p class="vacio">No se encontraron registros para los filtros seleccionados.</p>';
        } else {
            html += '<table class="tabla-reporte"><thead><tr>';

            encabezados.forEach(encabezado => {
                html += `<th>${seguro(encabezado)}</th>`;
            });

            html += '</tr></thead><tbody>';

            filas.forEach(fila => {
                html += '<tr>';

                fila.forEach(celda => {
                    html += `<td>${seguro(celda)}</td>`;
                });

                html += '</tr>';
            });

            html += '</tbody></table>';
        }

        resultado.innerHTML = html;
    }

    // Generar el reporte seleccionado
    function generarReporte() {
        try {
            const datos = obtenerDatos();

            if (tipoActual === 'matricula') {
                reporteMatricula(datos);
            } else if (tipoActual === 'documentos') {
                reporteDocumentos(datos);
            } else {
                reporteConsolidado(datos);
            }
        } catch (error) {
            resultado.innerHTML =
                '<p class="vacio">No se pudo generar el reporte. Verifica los datos del sistema.</p>';
            console.error(error);
        }
    }

    // Descargar el reporte en PDF
    function descargarPDF() {
        if (!window.jspdf || !window.jspdf.jsPDF) {
            alert('No se pudo cargar la herramienta PDF. Revisa tu conexión a Internet.');
            return;
        }

        if (filasActuales.length === 0) {
            alert('No hay registros para descargar.');
            return;
        }

        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();

        pdf.setFontSize(16);
        pdf.text('I.E. Jose Carlos Mariategui - Conchan', 14, 18);

        pdf.setFontSize(13);
        pdf.text(tituloActual, 14, 29);

        pdf.setFontSize(9);

        let y = 42;

        const ancho = 180 / encabezadosActuales.length;
        const alturaFila = 9;

        encabezadosActuales.forEach((texto, indice) => {
            pdf.text(
                String(texto).substring(0, 22),
                14 + indice * ancho,
                y
            );
        });

        y += alturaFila;

        filasActuales.forEach(fila => {
            if (y > 275) {
                pdf.addPage();
                y = 20;
            }

            fila.forEach((valor, indice) => {
                const texto = String(valor ?? '').substring(0, 25);

                pdf.text(
                    texto,
                    14 + indice * ancho,
                    y
                );
            });

            y += alturaFila;
        });

        pdf.save('reporte-' + tipoActual + '.pdf');
    }

    // Descargar el reporte en Excel
    function descargarExcel() {
        if (!window.XLSX) {
            alert('No se pudo cargar la herramienta Excel. Revisa tu conexión a Internet.');
            return;
        }

        if (filasActuales.length === 0) {
            alert('No hay registros para descargar.');
            return;
        }

        const datosExcel = [
            encabezadosActuales,
            ...filasActuales
        ];

        const hoja = XLSX.utils.aoa_to_sheet(datosExcel);

        const libro = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            libro,
            hoja,
            'Reporte'
        );

        XLSX.writeFile(
            libro,
            'reporte-' + tipoActual + '.xlsx'
        );
    }

    // Eventos de las tarjetas
    botones.forEach(boton => {
        boton.addEventListener('click', () => {
            cambiarTipo(boton.dataset.tipo);
        });
    });

    // Eventos de los filtros y botones
    btnGenerar.addEventListener('click', generarReporte);

    btnLimpiar.addEventListener('click', () => {
        document.getElementById('anio').addEventListener('change', generarReporte);
        document.getElementById('anio').value = '2026';
        document.getElementById('grado').value = 'Todos';
        document.getElementById('seccion').value = 'Todas';
        document.getElementById('fecha').value = '';
        document.getElementById('tipo-documento').value = 'Todos';

        generarReporte();
    });

    btnPDF.addEventListener('click', descargarPDF);
    btnExcel.addEventListener('click', descargarExcel);

    // Mostrar el primer reporte al abrir la pantalla
    cambiarTipo('matricula');

});
