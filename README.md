# BOOSTRAP — Repositorio de Rutas de Acción
## Microfábrica 3D Cardel · Erik J. Hernández

> **Propósito:** analizar TODAS las rutas de acción posibles (capital, nivel de arranque, modelo de ventas) desde la situación actual — capital escaso, buró manchado, 0 competencia local — y mantener la ruta maestra recomendada.
> **Fecha:** 2026-07-18 · **Moneda:** MXN · **Proyecto base:** `C:\Users\paxel80\PROYECTOS\Microfabrica-3D-Cardel`

---

## Estructura del repositorio (3 niveles)

```
boostrap/
├── README.md                      ← Este índice
├── _plantilla-ruta.md             ← Plantilla estándar para analizar cualquier ruta nueva
│
├── 00-contexto/                   ← NIVEL 0: de dónde partes
│   └── punto-de-partida.md          Recursos, restricciones duras, ventajas
│
├── 01-capital/                    ← NIVEL 1: ¿de dónde sale el dinero?
│   ├── README.md                    Índice + tabla comparativa R1-R8
│   ├── R1-abuela-prestamo-familiar/analisis.md    ⭐ 4.35
│   ├── R2-venta-de-cosas/analisis.md              ⭐ 4.20
│   ├── R3-promover-aval/analisis.md               ⭐ 3.45
│   ├── R4-socio-capitalista/                      ⭐ Variante estructurada (8 archivos: 12 segmentos + red de contactos)
│   ├── R5-prestanombre/analisis.md                ⚠️ Última opción
│   ├── R6-financieras/analisis.md                 ❌ ahora / ✅ Fase 2
│   ├── R7-quitas-buro/analisis.md                 🔧 paralelo
│   └── R8-combinada/analisis.md                   🏆 4.65
│   └── R9-credito-sin-buro/                       🎯 FOCO ACTUAL (7 archivos)
│
├── 02-arranque/                   ← NIVEL 2: ¿con cuánto arrancar?
│   ├── README.md                    Índice + gatillos de transición
│   ├── N1-minimo/analisis.md                      🏆 $32,000
│   ├── N2-ideal/analisis.md                       ⏳ $57-65k (se construye solo)
│   └── N3-fase2/analisis.md                       ❌ ahora / ✅ mes 6-8
│
├── 03-modelo/                     ← NIVEL 3: ¿qué vender primero?
│   ├── README.md                    Índice M1-M3
│   ├── M1-b2c-primero/analisis.md                 ⚠️ insuficiente sola
│   ├── M2-industrial-primero/analisis.md          ⚠️ destino, no inicio
│   └── M3-mixta/analisis.md                       🏆 4.70
│
├── 04-matriz/                     ← NIVEL 4: decisión
│   └── matriz-maestra.md            Scoring ponderado + escenarios A-E
│
└── 05-plan/                       ← NIVEL 5: ejecución
    └── ruta-maestra.md              Calendario semana a semana + KPIs
```

---

## Cómo usar este repositorio

1. **Analizar una ruta:** abre su carpeta → `analisis.md` (definición, números, riesgos, pasos, datos pendientes, veredicto)
2. **Añadir una ruta nueva:** copia `_plantilla-ruta.md` en una carpeta nueva de su dimensión y regístrala en el README de esa dimensión
3. **Actualizar estados:** cada `analisis.md` tiene campo Estado (⬜ pendiente · 🔄 en análisis · ✅ validada · ❌ descartada) y checklist de datos por validar
4. **Decidir:** `04-matriz/matriz-maestra.md` pondera todo contra tu situación
5. **Ejecutar:** `05-plan/ruta-maestra.md`

---

## Resumen ejecutivo (el veredicto en 30 segundos)

- **Capital:** R8 = R1 (abuela+pagaré) + R2 (ventas) + R3 (PROMOVER aval) = $32,000-45,000 · R7 (quitas) EN PARALELO
- **Arranque:** N1 mínimo-plus $32,000 — la X2D no se negocia; inventario y WC se construyen con flujo
- **Modelo:** M3 mixta — B2C semanas 3-4, caza industrial desde semana 5 con muestras
- **Fase 2:** mes 6-8 con buró limpio + métricas, vía NAFIN o socio

> **Regla de oro:** una orden pagada vale más que 10 cartas de intención.

---

## Documentos del proyecto principal (fuente de datos)

`EXPEDIENTE-MAESTRO.md` · `BOOTSTRAP-OPTIMO.md` (v4.0 precios reales) · `COMPARATIVA-BOOTSTRAP-RUTA.md` · `PANORAMA-ESTRATEGICO.md` · `SOLICITUD-FINANCIAMIENTO.md`
