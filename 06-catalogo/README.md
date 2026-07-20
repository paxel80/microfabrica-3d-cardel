# 06 — CATÁLOGO MAESTRO POR MERCADO
## 12 mercados × 15-30 productos con desglose de manufactura y precio

> Uso: cotización rápida (bot y respuestas rápidas), lista de mayoreo para refaccionarias, y anexo del proyecto escrito/presentación al socio.

---

## Costos base de manufactura (v4.0, julio 2026)

| Material | Costo/kg | Costo/gramo | Uso |
|---|---|---|---|
| PLA | $380-450 | ~$0.45 | Interior, figuras, decorativo, prototipos |
| PETG | $420-480 | ~$0.50 | Funcional, contacto con agua, uso rudo interior |
| ASA | $480-550 | ~$0.55 | **Exterior** (resiste sol/UV): automotriz, letreros |
| TPU | $650-800 | ~$0.80 | Flexible: sellos, topes, fundas, retenes |
| PA-CF (nylon carbono) | $1,800-2,300 | ~$2.20 | Estructural industrial: jigs, engranes, fixtures |

**Otros costos por impresión:**
- Electricidad: ~$1-3 por hora de impresión
- Desgaste de máquina/boquilla: ~$2/hora (PA-CF desgasta más: ~$4/h)
- **Costo total manufactura ≈ material + (horas × $4)**

## Fórmula de precio de venta

```
Precio = (costo manufactura × 3) + valor de urgencia/personalización
Mínimo por trabajo: $80-150 (aunque sea una pieza de 10g)
Pieza con modelado propio: +$150-400 según complejidad (o $250/h de diseño)
Mayoreo (refaccionarias/tiendas): precio lista − 30-40%
Urgencia <24h: +30-50%
```

> Margen bruto típico resultante: 70-85%. La tabla de cada mercado ya trae los números calculados.

## Índice de catálogos

| # | Archivo | Mercado | Productos |
|---|---|---|---|
| 1 | `01-automotriz.md` | Automotriz (público y mecánicos) | 18 |
| 2 | `02-refaccionarias.md` | Refaccionarias (mayoreo B2B2C) | 16 |
| 3 | `03-car-audio.md` | Car audio | 15 |
| 4 | `04-talleres.md` | Talleres mecánicos | 18 |
| 5 | `05-linea-blanca.md` | Refacciones línea blanca | 20 |
| 6 | `06-muebles.md` | Muebles y carpintería | 16 |
| 7 | `07-bares-restaurantes.md` | Bares y restaurantes | 16 |
| 8 | `08-tiendas-comercios.md` | Tiendas y comercios | 15 |
| 9 | `09-figuras-coleccionables.md` | Figuras y coleccionables | 18 |
| 10 | `10-prototipado-escuelas.md` | Prototipado y escuelas | 15 |
| 11 | `11-industrial.md` | Industrial (ingenios, CIBP, naval) | 15 |
| 12 | `12-bebe-recuerdos.md` | Recuerdos de bebé | 15 |

**Total: 212 productos cotizados.**

## Convenciones de las tablas

- **g** = gramos de filamento · **h** = horas de impresión
- **Mfg** = costo total de manufactura (material + máquina)
- **Precio** = precio de venta al público sugerido
- **Margen** = (precio − mfg) ÷ precio
- Los tiempos son para la Bambu X2D a velocidad estándar (perfil 0.2mm)
