document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('formRegistro');
  if (!form) return; // Si no estamos en la página de registro, no hace nada

  const dniInput = document.getElementById('dniRemitente');
  const correoInput = document.getElementById('correoRemitente');
  const foliosInput = document.getElementById('folios');
  const fileInput = document.getElementById('archivoAdjunto');

  dniInput.addEventListener('input', function() {
    this.value = this.value.replace(/\D/g, '').slice(0, 8);
    if (this.value.length !== 8) this.classList.add('error'); else this.classList.remove('error');
  });

  correoInput.addEventListener('blur', function() {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (this.value && !regex.test(this.value)) this.classList.add('error'); else this.classList.remove('error');
  });

  foliosInput.addEventListener('input', function() {
    const val = parseInt(this.value);
    if (isNaN(val) || val < 1 || val > 500) this.classList.add('error'); else this.classList.remove('error');
  });

  fileInput.addEventListener('change', function() {
    const file = this.files[0];
    if (!file) return;
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) { alert('Solo PDF, JPG o PNG.'); this.value = ''; }
    else if (file.size > 5 * 1024 * 1024) { alert('Máximo 5 MB.'); this.value = ''; }
  });

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    let isValid = true;
    form.querySelectorAll('[required]').forEach(field => {
      if (!field.value.trim()) { field.classList.add('error'); isValid = false; } 
      else { field.classList.remove('error'); }
    });
    if (dniInput.value.length !== 8) { dniInput.classList.add('error'); isValid = false; }
    const folios = parseInt(foliosInput.value);
    if (isNaN(folios) || folios < 1) { foliosInput.classList.add('error'); isValid = false; }

    if (isValid) {
      alert('Documento registrado correctamente. Código de expediente: EXP-2026-0050');
      window.location.href = 'bandeja.html';
    } else {
      alert('Corrija los campos en rojo.');
    }
  });
}); 