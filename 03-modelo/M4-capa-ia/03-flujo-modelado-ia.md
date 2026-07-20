# 03 — Flujo de Modelado 3D con IA

> Tu cuello de botella real NO es la impresora: eran las 2-4 horas de modelado por pieza personalizada. Con IA + plantillas paramétricas baja a **30-60 minutos**, y tu rol se convierte en verificar, no en crear desde cero.

---
## Ruta A — Pieza repetible (70% del trabajo): catálogo paramétrico

Para perillas, clips, soportes, letreros, porta-precios, organizadores: NO se modela cada vez.

1. Construyes UNA vez el modelo paramétrico en FreeCAD (con tabla de medidas)
2. Cliente pide perilla para lavadora Mabe X → cambias 3 valores en la tabla → exportas
3. **Tiempo: 10-15 min** en vez de 2 horas

**Plan de construcción del catálogo (1 plantilla nueva por semana):**

| Semana | Plantilla paramétrica | Segmento que habilita |
|---|---|---|
| 1 | Perillas (lavadoras/estufas, eje D/estriado/redondo) | Línea blanca |
| 2 | Clips automotrices (10 medidas más pedidas) | Automotriz/refaccionarias |
| 3 | Soportes y adaptadores car audio | Car audio |
| 4 | Letrero con logo (texto + forma base) | Bares/tiendas |
| 5 | Organizadores de mostrador/herramienta | Talleres/tiendas |
| 6 | Conectores/herrajes de mueble | Muebles |

> Este catálogo se convierte en un ACTIVO del negocio: modelos probados que ningún competidor nuevo tiene.

## Ruta B — Pieza única/orgánica (20%): IA generativa

Para figuras, piezas irregulares, modelos desde foto:

```
Foto del cliente (o descripción) → Meshy/Tripo (image-to-3D)
   → malla base en 2-5 min → limpieza en Blender/Meshmixer (15-30 min)
   → TU verificación → slicer → impresión
```

- **Figuras/coleccionables:** la IA queda al 80-90%; tú limpias soportes y detalles. Ideal para este segmento
- **Piezas rotas (línea blanca, auto):** el cliente manda foto de la pieza rota con medidas; la IA da el borrador y TÚ corriges las cotas críticas

## Ruta C — Pieza funcional con tolerancia (10%): tú + IA de consulta

Engranes, acoples, fixtures, jigs: la IA generativa NO da tolerancias. Flujo:

1. Tú modelas en FreeCAD (con ayuda de ChatGPT/Claude para resolver geometría, no para generar la pieza)
2. Imprimes prueba de ajuste (solo la sección crítica, 20-30 min, centavos de material)
3. Verificas con calibrador, ajustas, imprimes final

---
## Tu checklist de verificación (tu nuevo trabajo, en una hoja)

| # | Verificación | Herramienta |
|---|---|---|
| 1 | Cotas críticas ±0.2mm (o lo que pida el ajuste) | Calibrador digital |
| 2 | Ajuste real con la pieza/eje/rosca del cliente | Prueba física |
| 3 | Material correcto para el uso (PETG exterior, ASA sol, PA-CF estructural) | Tabla de decisión |
| 4 | Acabado: sin hilos, capas firmes, bordes limpios | Vista/tacto |
| 5 | Foto del trabajo aprobado (para catálogo y reporte al socio) | Celular |

> Si pasa los 5 puntos → sale. Si no → se reimprime con corrección. **Esta hoja ES tu valor: la IA no tiene calibrador ni criterio.**

## Cuándo la IA NO sirve (decirlo claro)

- Tolerancias mecánicas reales (la IA aproxima, no mide)
- Piezas de seguridad (ni con IA ni sin IA — no se hacen)
- Entender el PROBLEMA del cliente (eso lo haces tú en 2 preguntas)

## Efecto en capacidad

| Antes (v2.0) | Con IA (v2.1) |
|---|---|
| Modelado 2-4h por pieza personalizada | 30-60 min (Ruta A/B) |
| Tú: 20h/sem producción + 20h ventas | Tú: **10h/sem verificación + 30h ventas/red** |
| Cotización personalizada: 24h | **1 hora** (ventaja competitiva que se anuncia) |
