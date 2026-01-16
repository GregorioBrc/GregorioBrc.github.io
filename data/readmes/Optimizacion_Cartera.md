# Optimización de Cartera - Algoritmos Genéticos

## 📊 Descripción General

Este proyecto implementa un algoritmo genético para optimizar carteras de inversión financiera, maximizando el beneficio esperado mientras minimiza el riesgo (varianza). El sistema utiliza datos históricos de cuatro acciones Ficticias : Ecopetrol, PREC, PfbColom y GrupoSura.

## 🎯 Objetivos

- **Optimización Multiobjetivo**: Maximizar rendimiento esperado y minimizar riesgo simultáneamente
- **Diversificación Inteligente**: Distribuir óptimamente el capital entre múltiples activos
- **Análisis de Frontera Eficiente**: Generar la curva de Markowitz para diferentes niveles de riesgo
- **Comparación de Estrategias**: Evaluar enfoques mono-objetivo vs multi-objetivo

## 🧬 Algoritmo Genético Implementado

### Características Principales

- **Población**: 500 individuos por generación
- **Generaciones**: 300 iteraciones evolutivas
- **Selección**: Torneo binario con criterios de dominancia
- **Cruce**: Cruce uniforme con pesos aleatorios
- **Mutación**: Mutación gaussiana adaptativa con restricciones
- **Elitismo**: Preservación de los mejores individuos

### Estructura del Cromosoma

Cada individuo representa una distribución de activos:

- **Gen 0**: Proporción en Ecopetrol
- **Gen 1**: Proporción en PREC
- **Gen 2**: Proporción en PfbColom
- **Gen 3**: Proporción en GrupoSura

**Restricción**: `Σ(x_i) = 1.0` y `x_i ≥ 0` para todo i

### Funciones de Evaluación

1. **Rendimiento Esperado (E)**:

   ```
   E = Σ(beneficio_i × proporción_i)
   ```

2. **Riesgo Total (σ²)**:

   ```
   σ² = ΣΣ(covarianza_ij × proporción_i × proporción_j)
   ```

3. **Fitness Mono-objetivo**:

   ```
   Fitness = E / σ²
   ```

4. **Dominancia Multi-objetivo**:
   - Contador de individuos dominados
   - Distancia euclidiana al frente de Pareto

## 📈 Datos de Entrada

### Acciones Analizadas

| Activo | Beneficio Esperado | Varianza |
|--------|-------------------|----------|
| Ecopetrol | 0.00429493 | 0.00671900 |
| PREC | 0.02689857 | 0.03438852 |
| PfbColom | 0.00827647 | 0.00344421 |
| GrupoSura | 0.00794438 | 0.00233944 |

### Matriz de Covarianzas

```
          Eco.    PREC    PfbC    G.Sura
Ecopetrol  -1   0.01194 0.00171 0.00161
PREC    0.01194   -1   0.00403 0.00375
PfbColom 0.00171 0.00403   -1   0.00185
G.Sura  0.00161 0.00375 0.00185   -1
```

## 🖥️ Estructura del Proyecto

```
Optimizacion_Cartera/
├── src/
│   ├── Program.java      # Clase principal con el algoritmo genético
│   ├── Sujeto.java       # Clase individuo con genes y evaluación
│   └── Datos.java        # Datos financieros de entrada
├── bin/                  # Archivos compilados (.class)
├── D.csv                 # Resultados en formato CSV (Beneficio;Riesgo)
├── Datos.txt             # Resultados completos con iteración
├── X.txt                 # Log detallado de cada generación
└── README.md            # Este archivo
```

## 🚀 Cómo Ejecutar

### Requisitos Previos

- Java 8 o superior
- IDE o compilador Java (Eclipse, IntelliJ, VS Code)

### Compilación

```bash
javac -d bin src/*.java
```

### Ejecución

```bash
java -cp bin Program
```

### Parámetros Configurables

En [`Program.java`](src/Program.java:11):

```java
public Program(int Cant, int Epoc, int n, int Tipo) {
    // Cant: Tamaño de población (500)
    // Epoc: Número de generaciones (300) 
    // n: Número de iteración para múltiples corridas
    // Tipo: 1=Mono-objetivo, 2=Multi-objetivo
}
```

## 📊 Archivos de Salida

### D.csv

Formato: `beneficio;riesgo`

- 600 puntos de la frontera eficiente
- Valores optimizados para diferentes ponderaciones riesgo-beneficio

### Datos.txt  

Formato: `iteración\tbeneficio\trisgo\tfitness`

- 600 registros (300 mono-objetivo + 300 multi-objetivo)
- Tercera columna: fitness o ratio beneficio/riesgo

### X.txt

- Log detallado de cada generación
- Mejor individuo por generación con valores de genes
- Útil para debugging y análisis de convergencia

## 🔍 Análisis de Resultados

### Interpretación de Salidas

1. **Frontera Eficiente**: Curva en espacio beneficio-riesgo
2. **Portafolio Óptimo**: Mayor beneficio por unidad de riesgo
3. **Diversificación**: Distribución balanceada entre activos
4. **Convergencia**: Estabilización del fitness a través de generaciones

### Visualización Recomendada

```python
import pandas as pd
import matplotlib.pyplot as plt

# Leer CSV
df = pd.read_csv('D.csv', sep=';', header=None, 
                 names=['Beneficio', 'Riesgo'])

# Graficar frontera eficiente
plt.scatter(df['Riesgo'], df['Beneficio'], alpha=0.6)
plt.xlabel('Riesgo (Varianza)')
plt.ylabel('Beneficio Esperado')
plt.title('Frontera Eficiente de Markowitz')
plt.show()
```

## 🧪 Experimentos Recomendados

1. **Comparación de Estrategias**:
   - Ejecutar ambos modos (mono y multi-objetivo)
   - Analizar diversidad de soluciones
   - Evaluar robustez

2. **Sensibilidad a Parámetros**:
   - Variar tamaño de población
   - Ajustar probabilidad de mutación
   - Modificar criterios de selección

3. **Análisis Temporal**:
   - Ejecutar múltiples corridas
   - Estudiar varianza en resultados
   - Identificar portafolios consistentes

## 📚 Referencias Teóricas

### Teoría de Markowitz

- **Modelo de Media-Varianza**: Optimización riesgo-beneficio
- **Frontera Eficiente**: Conjunto de portafolios óptimos
- **Diversificación**: Reducción de riesgo sin sacrificar rendimiento

### Algoritmos Genéticos

- **Selección Natural**: Supervivencia del más apto
- **Operadores Genéticos**: Cruce y mutación
- **Convergencia**: Tendencia hacia óptimo global

## 📄 Licencia

Proyecto académico para fines educativos e investigativos.

---

**Nota**: Los datos financieros utilizados son ilustrativos. Para aplicaciones reales, utilizar datos históricos actualizados y considerar costos de transacción, impuestos y otras variables del mercado.
