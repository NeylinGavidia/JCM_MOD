---
name: JCM Responsive Design Skill
purpose: Guía para construir páginas con un diseño responsive, legible y consistente con la identidad institucional del panel JCM.
---

# Skill: Diseño responsive para la página JCM

## Objetivo
Crear interfaces que se adapten de manera fluida a diferentes tamaños de pantalla sin perder claridad, accesibilidad ni jerarquía visual. La experiencia debe mantenerse funcional en desktop, tablet y móvil, priorizando rapidez de lectura y manejo de información.

## Principios base

### 1. Mobile first
- Diseñar primero para móvil.
- Usar componentes de una sola columna y texto compacto.
- Agregar espacios, columnas y densidad según se amplía la pantalla.

### 2. Layout adaptable
- Utilizar contenedores con ancho máximo y proporciones flexibles.
- Evitar fijar anchos absolutos en elementos principales.
- Priorizar el uso de `flex`, `grid` y `minmax()` cuando sea necesario.

### 3. Jerarquía visual clara
- En móvil, los elementos importantes deben ir primero.
- Los menús, tablas y formularios deben reorganizarse para evitar desbordamientos.
- La información crítica no debe depender de hover para mostrarse.

## Breakpoints recomendados

```css
:root {
  --mobile: 0px;
  --tablet: 768px;
  --desktop: 1024px;
  --wide: 1280px;
}
```

### Móvil
- Ancho: hasta 767px
- Usar layout en una sola columna.
- Menú en drawer o sidebar desplegable.
- Tarjetas y formularios con padding pequeño y texto legible.

### Tablet
- Ancho: 768px a 1023px
- Mantener columnas dobles cuando sea posible.
- Reducir ancho de sidebar o convertirlo en rail compacto.
- Agrupar métricas en filas de 2 columnas.

### Desktop
- Ancho: 1024px en adelante
- Usar dos o tres columnas según la funcionalidad.
- Mantener navegación lateral visible o fija.
- Usar tablas, paneles y dashboard con mayor densidad visual.

## Reglas de diseño por componente

### Navegación
- En móvil: menú oculto con botón de hamburguesa.
- En tablet: sidebar compacta o iconos con texto breve.
- En desktop: sidebar fija con nombre completo y secciones claras.
- Mantener el estado activo visible y con contraste suficiente.

### Tarjetas de resumen
- En móvil: apilar verticalmente.
- En tablet: máximo 2 columnas.
- En desktop: 3 o 4 columnas según el contenido.
- Cada tarjeta debe mantener una altura consistente visualmente.

### Formularios
- Campos en una sola columna en mobile.
- En tablet pueden agruparse en 2 columnas.
- En desktop, distribuir en 2 a 3 columnas si la información lo requiere.
- Marcas de error y etiquetas deben ser visibles sin depender del tamaño del campo.

### Tablas
- En móvil, evitar tablas anchas sin scroll horizontal.
- Usar `overflow-x: auto` con contenedor responsivo.
- Convertir filas complejas en tarjetas o listas si la información es muy densa.
- Mantener botones de acción accesibles al toque.

### Modales y overlays
- En móvil: ocupar casi todo el ancho y altura útil de la pantalla.
- En tablet: ancho moderado con contenido agrupado.
- En desktop: ancho fijo según tipo de formulario o detalle.

## Estilo visual recomendado
Basado en la guía institucional del sistema:

- Color principal: verde institucional.
- Acento secundario: ámbar.
- Alertas críticas: rojo cívico.
- Espaciado modular: 4px, 8px, 16px, 24px, 32px.
- Radios suaves: 8px a 16px.
- Bordes limpios y contrastes suficientes para lectura.

## Buenas prácticas de CSS

```css
.container {
  width: min(100% - 1rem, 1200px);
  margin-inline: auto;
}

.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
```

## Checklist de validación responsive
- [ ] La página se visualiza correctamente en 375px.
- [ ] El menú funciona sin bloquear el contenido.
- [ ] Los botones pueden pulsarse cómodamente en móvil.
- [ ] Las tarjetas se apilan o reordenan correctamente.
- [ ] Las tablas no se rompen ni salen del contenedor.
- [ ] Los textos mantienen legibilidad sin zoom.
- [ ] Los formularios se ajustan sin pérdida de funcionalidad.
- [ ] No hay elementos cortados ni desplazados fuera de la pantalla.

## Resultado esperado
Una interfaz moderna, clara y adaptable que preserve la identidad institucional del proyecto y permita trabajar con comodidad desde cualquier dispositivo, con prioridad en la funcionalidad y la lectura rápida.
