'use strict';

(function () {
    if (sesionActiva()) { location.replace('principal.html'); return; }

    const form = document.getElementById('form-login');
    const msg = document.getElementById('login-msg');
    const msgTexto = document.getElementById('login-msg-texto');
    const boton = document.getElementById('btn-ingresar');
    const inputUsuario = document.getElementById('usuario');
    const inputClave = document.getElementById('clave');
    let intentos = 0;

    function mostrarError(texto) {
        msgTexto.textContent = texto;
        msg.hidden = false;
    }

    function bloquear(segundos) {
        boton.disabled = true;
        inputUsuario.disabled = true;
        inputClave.disabled = true;
        const tic = setInterval(() => {
            segundos -= 1;
            if (segundos > 0) {
                mostrarError('Demasiados intentos. Espera ' + segundos + ' segundos para volver a intentar.');
            } else {
                clearInterval(tic);
                intentos = 0;
                boton.disabled = false;
                inputUsuario.disabled = false;
                inputClave.disabled = false;
                msg.hidden = true;
                inputClave.value = '';
                inputClave.focus();
            }
        }, 1000);
        mostrarError('Demasiados intentos. Espera ' + segundos + ' segundos para volver a intentar.');
    }

    form.addEventListener('submit', e => {
        e.preventDefault();
        const usuario = inputUsuario.value.trim().toLowerCase();
        const clave = inputClave.value;

        if (!usuario || !clave) {
            mostrarError('Escribe tu usuario y tu contraseña para ingresar.');
            return;
        }
        if (usuario === APP.usuario && clave === APP.clave) {
            try { sessionStorage.setItem(APP.claveSesion, '1'); } catch (err) { /* nada */ }
            location.href = 'principal.html';
            return;
        }
        intentos += 1;
        if (intentos >= 3) {
            bloquear(10);
        } else {
            mostrarError('Usuario o contraseña incorrectos. Intento ' + intentos + ' de 3.');
            inputClave.select();
        }
    });

    document.getElementById('ver-clave').addEventListener('click', e => {
        const visible = inputClave.type === 'text';
        inputClave.type = visible ? 'password' : 'text';
        e.currentTarget.setAttribute('aria-label', visible ? 'Mostrar contraseña' : 'Ocultar contraseña');
        e.currentTarget.querySelector('span').textContent = visible ? 'visibility' : 'visibility_off';
    });

    inputUsuario.focus();
})();
