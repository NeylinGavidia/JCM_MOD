'use strict';

(function () {
    if (!sesionActiva()) return; // app.js se encarga de volver al inicio de sesión

    let datos = leerDatos();
    const TIPOS = ['Solicitud', 'Certificado', 'Constancia', 'Oficio', 'Otro'];
    const ESTADOS = { 'Pendiente': 'warn', 'En revisión': 'info', 'Atendido': 'ok' };

    const $ = id => document.getElementById(id);

    /* ---------- Saludo ---------- */
    function pintarSaludo() {
        const h = new Date().getHours();
        const saludo = h < 12 ? 'Buenos días' : h < 19 ? 'Buenas tardes' : 'Buenas noches';
        $('saludo').textContent = saludo + ', ' + APP.nombre;
        const f = new Date().toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
        $('fecha').textContent = f.charAt(0).toUpperCase() + f.slice(1);
    }

    /* ---------- Resumen ---------- */
    function pintarResumen() {
        const total = datos.aforo.reduce((s, a) => s + a.matriculados, 0);
        const cupos = datos.aforo.reduce((s, a) => s + a.capacidad, 0);
        const porcentaje = cupos ? Math.round(total / cupos * 100) : 0;
        const pendientes = datos.tramites.filter(t => t.estado === 'Pendiente').length;
        const tarjeta = (icono, etiqueta, valor, detalle, clase) =>
            '<div class="stat ' + (clase || '') + '"><div class="etiqueta"><span class="material-symbols-outlined">' + icono + '</span>' + etiqueta + '</div>' +
            '<div class="valor">' + valor + '</div><div class="detalle">' + detalle + '</div></div>';
        $('stats').innerHTML =
            tarjeta('groups', 'Estudiantes matriculados', total, 'de ' + cupos + ' vacantes disponibles') +
            tarjeta('donut_large', 'Ocupación total', porcentaje + '%', (cupos - total) + ' vacantes libres') +
            tarjeta('supervisor_account', 'Apoderados registrados', datos.apoderados, 'vinculados a estudiantes') +
            tarjeta('description', 'Documentos pendientes', pendientes, datos.tramites.length + ' recibidos en total', pendientes > 0 ? 'alerta' : '');
    }

    /* ---------- Aforo por sección ---------- */
    function pintarAforo() {
        const llenas = [];
        $('lista-aforo').innerHTML = datos.aforo.map(a => {
            const pct = Math.min(100, Math.round(a.matriculados / a.capacidad * 100));
            const llena = a.matriculados >= a.capacidad;
            const casi = !llena && pct >= 90;
            if (llena) llenas.push(a.seccion);
            const chip = llena ? '<span class="chip error">Aula llena</span>' : casi ? '<span class="chip warn">Casi llena</span>' : '<span class="chip ok">Con cupo</span>';
            return '<div class="fila-aforo ' + (llena ? 'llena' : casi ? 'casi' : '') + '">' +
                '<b>' + esc(a.seccion) + '</b>' +
                '<div class="barra" role="img" aria-label="' + pct + '% ocupado"><span style="width:' + pct + '%"></span></div>' +
                '<span class="cupo">' + a.matriculados + ' / ' + a.capacidad + '</span>' + chip + '</div>';
        }).join('');

        const alerta = $('alerta-aforo');
        if (llenas.length) {
            alerta.hidden = false;
            alerta.innerHTML = '<span class="material-symbols-outlined">warning</span><span>' +
                (llenas.length === 1 ? 'La sección ' : 'Las secciones ') + esc(llenas.join(', ')) +
                (llenas.length === 1 ? ' no tiene vacantes.' : ' no tienen vacantes.') + '</span>';
        } else {
            alerta.hidden = true;
        }
        return llenas;
    }

    /* ---------- Documentos recientes ---------- */
    function pintarTramites() {
        const cuerpo = $('cuerpo-tramites');
        if (!datos.tramites.length) {
            cuerpo.innerHTML = '<tr><td class="vacio" colspan="7">Aún no hay documentos recibidos. Usa “Recepcionar documento” para registrar el primero.</td></tr>';
            return;
        }
        cuerpo.innerHTML = datos.tramites.slice(0, 6).map(t => {
            const f = new Date(t.fecha).toLocaleString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
            return '<tr><td><b>' + esc(t.codigo) + '</b></td><td>' + esc(t.remitente) + '</td><td>' + esc(t.tipo) + '</td><td>' + esc(t.asunto) + '</td>' +
                '<td>' + esc(f) + '</td><td>' + esc(t.folios) + '</td><td><span class="chip ' + (ESTADOS[t.estado] || 'info') + '">' + esc(t.estado) + '</span></td></tr>';
        }).join('');
    }

    function pintarTodo() { pintarResumen(); pintarAforo(); pintarTramites(); }

    /* ---------- Recepcionar documento ---------- */
    function abrirRecepcion() {
        const dlg = document.createElement('dialog');
        dlg.className = 'modal';
        dlg.innerHTML =
            '<h3>Recepcionar documento</h3><p>Registra el documento que entrega la persona en mesa de partes.</p>' +
            '<form novalidate id="form-tramite">' +
            campo('remitente', 'Nombre del remitente', '<input id="t-remitente" maxlength="80" autocomplete="off">') +
            '<div class="dos-col">' +
            campo('dni', 'DNI', '<input id="t-dni" inputmode="numeric" maxlength="8" autocomplete="off">') +
            campo('tipo', 'Tipo de documento', '<select id="t-tipo">' + TIPOS.map(t => '<option>' + t + '</option>').join('') + '</select>') +
            '</div>' +
            campo('asunto', 'Asunto', '<input id="t-asunto" maxlength="100" autocomplete="off">') +
            campo('folios', 'Número de folios', '<input id="t-folios" type="number" min="1" max="500" value="1">') +
            '<div class="modal-acciones"><button type="button" class="btn btn-sec" data-cerrar>Cancelar</button>' +
            '<button type="submit" class="btn btn-pri">Guardar y generar cargo</button></div></form>';
        document.body.appendChild(dlg);

        function campo(id, etiqueta, control) {
            return '<div class="campo" id="c-' + id + '"><label for="t-' + id + '">' + etiqueta + '</label>' + control + '<span class="error" id="e-' + id + '"></span></div>';
        }

        const f = id => dlg.querySelector('#t-' + id);
        f('dni').addEventListener('input', () => { f('dni').value = f('dni').value.replace(/\D/g, ''); });
        dlg.querySelector('[data-cerrar]').addEventListener('click', () => dlg.close());
        dlg.addEventListener('close', () => dlg.remove());

        function error(id, texto) {
            dlg.querySelector('#c-' + id).classList.toggle('invalido', !!texto);
            dlg.querySelector('#e-' + id).textContent = texto || '';
            return !texto;
        }

        function validar() {
            const folios = Number(f('folios').value);
            const resultados = [
                error('remitente', f('remitente').value.trim().length < 3 ? 'Escribe el nombre completo del remitente.' : ''),
                error('dni', /^\d{8}$/.test(f('dni').value) ? '' : 'El DNI debe tener 8 dígitos.'),
                error('asunto', f('asunto').value.trim().length < 5 ? 'Describe el asunto en al menos 5 letras.' : ''),
                error('folios', Number.isInteger(folios) && folios >= 1 && folios <= 500 ? '' : 'Indica un número de folios entre 1 y 500.')
            ];
            return resultados.every(Boolean);
        }

        dlg.querySelector('form').addEventListener('submit', async e => {
            e.preventDefault();
            if (!validar()) {
                mostrarToast('Revisa los campos marcados en rojo.', 'warn');
                const primero = dlg.querySelector('.campo.invalido input');
                if (primero) primero.focus();
                return;
            }
            const nuevo = {
                remitente: f('remitente').value.trim(),
                dni: f('dni').value,
                tipo: f('tipo').value,
                asunto: f('asunto').value.trim(),
                folios: Number(f('folios').value),
                fecha: new Date().toISOString(),
                estado: 'Pendiente'
            };
            const repetido = datos.tramites.some(t => t.dni === nuevo.dni && t.asunto.toLowerCase() === nuevo.asunto.toLowerCase() && t.estado !== 'Atendido');
            if (repetido) {
                const seguir = await confirmar({
                    titulo: 'Ya existe un documento parecido',
                    mensaje: 'Hay un trámite pendiente con el mismo DNI y asunto. ¿Quieres registrarlo de todos modos?',
                    textoOk: 'Registrar de todos modos'
                });
                if (!seguir) return;
            }
            const anio = new Date().getFullYear();
            const numeros = datos.tramites.map(t => parseInt(String(t.codigo).split('-')[2], 10) || 0);
            const secuencia = (numeros.length ? Math.max.apply(null, numeros) : 0) + 1;
            nuevo.codigo = 'EXP-' + anio + '-' + String(secuencia).padStart(4, '0');

            datos.tramites.unshift(nuevo);
            if (!guardarDatos(datos)) { datos.tramites.shift(); return; }
            pintarTodo();
            dlg.close();
            mostrarToast('Documento ' + nuevo.codigo + ' registrado. Cargo de recepción generado.', 'ok');
        });

        dlg.showModal();
        f('remitente').focus();
    }

    /* ---------- Restablecer ---------- */
    async function restablecer() {
        const ok = await confirmar({
            titulo: '¿Restablecer los datos de demostración?',
            mensaje: 'Se borrarán los documentos que registraste y todo volverá a los datos de ejemplo.',
            textoOk: 'Restablecer',
            peligro: true
        });
        if (!ok) return;
        datos = datosIniciales();
        if (guardarDatos(datos)) {
            pintarTodo();
            mostrarToast('Datos de demostración restablecidos.', 'ok');
        }
    }

    $('btn-recepcionar').addEventListener('click', abrirRecepcion);
    $('btn-reset').addEventListener('click', restablecer);

    pintarSaludo();
    pintarTodo();

    const llenas = datos.aforo.filter(a => a.matriculados >= a.capacidad).map(a => a.seccion);
    if (llenas.length) {
        setTimeout(() => mostrarToast('Atención: ' + llenas.join(', ') + ' sin vacantes disponibles.', 'warn'), 700);
    }
})();
