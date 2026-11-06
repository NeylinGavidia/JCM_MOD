---
name: JCM Conchán Panel Directivo
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#41493e'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#717a6d'
  outline-variant: '#c0c9bb'
  surface-tint: '#2a6b2c'
  primary: '#00450d'
  on-primary: '#ffffff'
  primary-container: '#1b5e20'
  on-primary-container: '#90d689'
  inverse-primary: '#91d78a'
  secondary: '#855300'
  on-secondary: '#ffffff'
  secondary-container: '#fea619'
  on-secondary-container: '#684000'
  tertiary: '#7c0008'
  on-tertiary: '#ffffff'
  tertiary-container: '#a8000f'
  on-tertiary-container: '#ffb2a9'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#acf4a4'
  primary-fixed-dim: '#91d78a'
  on-primary-fixed: '#002203'
  on-primary-fixed-variant: '#0c5216'
  secondary-fixed: '#ffddb8'
  secondary-fixed-dim: '#ffb95f'
  on-secondary-fixed: '#2a1700'
  on-secondary-fixed-variant: '#653e00'
  tertiary-fixed: '#ffdad6'
  tertiary-fixed-dim: '#ffb4ab'
  on-tertiary-fixed: '#410002'
  on-tertiary-fixed-variant: '#93000b'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 26px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.03em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-mobile: 0.75rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style
This design system establishes an executive, accessible, and institutional digital environment crafted specifically for the leadership and administrative body of the educational institution. The brand personality balances civic dignity, administrative precision, and community trust. It transforms traditional school recordkeeping into a clean, modern governance dashboard.

The aesthetic philosophy draws on **Corporate / Modern** principles fused with a tactile institutional character:
- **Atmosphere:** Clean, orderly, and highly legible for busy school principals, administrative secretaries, and academic coordinators managing matriculations, capacities, official petitions, and parent records.
- **Visual anchors:** Rooted in the school's heritage—reflected in the deep institutional green of the school facade, the golden-amber heraldic warmth of the school crest, and precise civic crimson highlights.
- **Tone of voice:** Formal, reassuring, transparent, and strictly functional, avoiding unnecessary visual noise while maintaining human warmth.

## Colors
The color architecture reflects the architectural presence and regional identity of Conchán:

- **Primary (`#1b5e20` - Verde Pino Institucional):** Represents civic authority, academic growth, and institutional continuity. Used for primary top bars, active navigation states, primary action buttons, key metrics, and official validation badges. A lighter tint (`#2e7d32`) serves as hover/interactive feedback.
- **Secondary (`#f59e0b` - Ámbar Heráldico / Sol Radiante):** Inspired by the golden frame and flame of the school crest. Serves as an accent for alerts, attention banners, pending document states in Mesa de Partes, and starred records.
- **Tertiary (`#dc2626` - Rojo Cívico Republicano):** Derived from the Peruvian national flag. Used strictly for urgent administrative alerts, critical deadlines, rejected/cancelled requests, quota saturation warnings, and destructive actions.
- **Neutral Surface & Canvas (`#f8fafc` / `#f1f5f9` / `#ffffff`):** Soft, non-glare administrative slate backgrounds that reduce eye fatigue during long operational hours. Slate 900 (`#0f172a`) ensures optimal typographic contrast and readability.
- **Borders & Dividers (`#e2e8f0`):** Crisp, subtle delineation that structures complex data grids without clutter.

## Typography
Typographic rhythm combines **Plus Jakarta Sans** for structural headings and executive metrics with **Inter** for data grids, dense administrative tables, and form inputs.

- **Plus Jakarta Sans:** Delivers geometric poise and modern clarity in headers, module banners, student counters, and summary cards.
- **Inter:** Chosen for its industry-standard optical legibility, neutrality, and clear tabular numerical distinction, ideal for student DNI codes, expediente tracking numbers, school grade registers, and date stamps.
- **Hierarchy:** High contrast in weight (Bold/SemiBold headings paired with Regular body text) guarantees rapid scanning when reviewing multiple student applications or official documents.

## Layout & Spacing
The layout follows a robust **Fluid-within-Container Grid** system:

- **Desktop (12 columns):** Employs a persistent executive vertical navigation bar (260px fixed width) coupled with a fluid workspace with `margin: 2rem` and `gutter: 1.25rem`. Complex modules (such as Expediente Trámite vs. Document Preview) divide naturally into 8:4 or 7:5 column relationships.
- **Tablet (8 columns):** Sidebar collapses into a high-density icon rail (72px), preserving grid breathing room with `gutter: 1rem` and `margin: 1.5rem`.
- **Mobile (4 columns):** Adapts to an off-canvas drawer navigation. Key metrics wrap into single or double-card columns with `margin-mobile: 1rem` and `gutter-mobile: 0.75rem`.
- **Spacing Cadence:** Adheres to a strict 4px/8px modular rhythm (`space-xs` through `space-xl`) ensuring uniform padding across KPI cards, form fields, and status badges.

## Elevation & Depth
Depth is expressed through subtle **Tonal Layers and Low-Contrast Outlines**, avoiding dramatic heavy drops in favor of crisp administrative professionalism:

- **Base Layer (Elevation 0):** Background canvas `#f8fafc` where foundational grids and section backdrops rest.
- **Card & Table Containers (Elevation 1):** Solid `#ffffff` background with a crisp border (`1px solid #e2e8f0`) and an ambient shadow (`box-shadow: 0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.04)`).
- **Interactive / Hover Surfaces (Elevation 2):** Elevated interactive elements and active rows introduce subtle upward presence (`box-shadow: 0 4px 6px -1px rgba(27, 94, 32, 0.06), 0 2px 4px -2px rgba(15, 23, 42, 0.04)`).
- **Modals, Flyouts & Slide-in Drawers (Elevation 3):** Administrative detail modals (e.g., student expediente dossier, new trámite entry form) utilize deeper containment (`box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.06)`) combined with a dark neutral backdrop veil (`rgba(15, 23, 42, 0.4)`).

## Shapes
A roundedness factor of **2** (`0.5rem` / `8px` baseline) is applied throughout the system to combine institutional seriousness with modern digital softness:

- **Standard Elements (8px / `rounded-md`):** Buttons, inputs, search bars, selects, and table action bars.
- **Cards & Data Modules (12px to 16px / `rounded-lg` to `rounded-xl`):** Primary metric overview cards, summary tables, document preview containers, and modal dialogs.
- **Tags, Pills & Status Badges (`rounded-full`):** State indicators for Expediente statuses (Recibido, En Revisión, Aprobado, Observado) use fully rounded capsules for immediate recognition.

## Components

### Buttons
- **Primary:** Deep pine green (`#1b5e20`), white text, bold font (`label-lg`), 8px border-radius, subtle hover darkening to `#2e7d32`.
- **Secondary / Institutional Accent:** Warm amber (`#f59e0b`), dark slate text (`#0f172a`), used for actions requiring special priority (e.g., "Emitir Resolución", "Derivar Trámite").
- **Outline / Secondary Neutral:** White background, 1px border `#cbd5e1`, text `#334155`, hover background `#f1f5f9`.
- **Destructive:** Crimson red (`#dc2626`) for irreversible actions like "Anular Matrícula" or "Rechazar Solicitud".

### Chips & Status Badges
- **Trámite / Expediente Indicators:**
  - *Registrado / Nuevo:* Light blue tint (`#eff6ff`, text `#1d4ed8`).
  - *En Trámite:* Light amber tint (`#fef3c7`, text `#b45309`).
  - *Aprobado / Concluido:* Light emerald tint (`#dcfce7`, text `#15803d`).
  - *Observado / Rechazado:* Light crimson tint (`#fee2e2`, text `#b91c1c`).
- Built with `label-sm`, padding `0.25rem 0.625rem`, and full pill radius.

### Input Fields & Search Bars
- Background `#ffffff`, border `1px solid #cbd5e1`, padding `0.625rem 0.875rem`, text `#0f172a`, placeholder text `#94a3b8`.
- Focus state provides a 2px ring in primary green (`#1b5e20`) with 0.15 opacity expansion.
- Includes integrated prefix icons for DNI search, student surname lookup, and expediente number filters.

### Cards & KPI Dashboard Widgets
- Crisp white surface with 1px border `#e2e8f0` and 12px rounded corners.
- Header features an uppercase category label (`label-sm`), high-contrast numerical metrics in Plus Jakarta Sans (`display-lg`), accompanied by comparative growth pills (e.g., "+12% respecto al año anterior").
- Key metrics: *Total Matriculados*, *Vacantes Disponibles*, *Expedientes Pendientes en Mesa de Partes*, and *Aforo por Grado/Sección*.

### Tables & Data Grids
- Clean header row with soft background `#f8fafc`, text `#64748b`, uppercase `label-xs`.
- Alternating visual rhythm with gentle row borders (`1px solid #f1f5f9`), row hover highlighting with `#f0fdf4` (tinted institucional green).
- Action columns feature direct action icon buttons (Ver Expediente, Editar Matrícula, Descargar Ficha PDF).

### Checkboxes & Radios
- Square 4px radius for checkboxes, circular for radios. Active state filled with primary green `#1b5e20` and white check icon. Focus state ring `#1b5e20` at 20% opacity.