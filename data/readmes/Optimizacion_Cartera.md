# Optimizacion de Cartera de Inversion mediante Algoritmos Geneticos

[![Java](https://img.shields.io/badge/Java-8%2B-ED8B00?style=flat-square&logo=openjdk&logoColor=white)](https://www.java.com/)
[![Algorithms](https://img.shields.io/badge/Algorithm-Genetic%20Algorithm-00599C?style=flat-square)](https://en.wikipedia.org/wiki/Genetic_algorithm)
[![Optimization](https://img.shields.io/badge/Optimization-Markowitz%20Model-512BD4?style=flat-square)](https://en.wikipedia.org/wiki/Markowitz_model)
[![Data Format](https://img.shields.io/badge/Output-CSV%20%7C%20TXT-239120?style=flat-square)](https://docs.oracle.com/)

## Descripcion General

Este proyecto implementa un sistema de optimizacion cuantitativa de portafolios financieros aplicando **Algoritmos Geneticos (AG)** sobre el modelo de media-varianza de **Harry Markowitz**. El objetivo es encontrar la distribucion optima de capital entre un conjunto de activos financieros, maximizando el rendimiento esperado del portafolio ($E$) mientras se minimiza simultaneamente el riesgo total expresado como la varianza conjunta ($\sigma^2$).

El sistema analiza dos enfoques evolutivos: una estrategia **Mono-objetivo** orientada a maximizar la relacion rendimiento/riesgo (ratio tipo Sharpe) y una estrategia **Multi-objetivo** basada en conteo de dominancia de Pareto y distancia euclidiana de afinidad para construir la **Frontera Eficiente**.

---

## Modelo Formulado y Restricciones

### Codificacion del Cromosoma (`Sujeto.java`)

Cada individuo en la poblacion representa un portafolio de inversion compuesto por 4 genes ($x_0, x_1, x_2, x_3$), donde cada gen equivale a la proporcion de capital asignado a un activo especifico:

* $x_0$: Proporcion asignada a Ecopetrol.
* $x_1$: Proporcion asignada a PREC.
* $x_2$: Proporcion asignada a PfbColom.
* $x_3$: Proporcion asignada a GrupoSura.

### Restricciones del Dominio

1. **Conservacion del Capital**: $\sum_{i=0}^{3} x_i = 1.0$ (El 100% del presupuesto es asignado).
2. **No Venta en Corto**: $x_i \ge 0 \quad \forall i \in \{0, 1, 2, 3\}$.

### Funciones Financieras de Evaluacion

1. **Rendimiento Esperado del Portafolio ($E$)**:
   $$E = \sum_{i=0}^{3} (E_i \cdot x_i)$$

2. **Riesgo Total / Varianza del Portafolio ($\sigma^2$)**:
   $$\sigma^2 = \sum_{i=0}^{3} \sum_{j=0}^{3} (\Sigma_{ij} \cdot x_i \cdot x_j)$$
   *Donde $\Sigma_{ij}$ representa la covarianza entre los activos $i$ y $j$ (o la varianza propia cuando $i = j$).*

---

## Estrategias de Seleccion y Operadores Geneticos

### Parametros de la Simulacion Evolutiva

* **Tamaño de Poblacion**: 500 individuos por generacion.
* **Iteraciones Evolutivas**: 300 generaciones por experimento.
* **Experimentos Totales**: 600 ejecuciones (300 corridas mono-objetivo + 300 corridas multi-objetivo).

### 1. Optimizacion Mono-Objetivo (`Tipo = 1`)

Ajusta la aptitud del individuo mediante la funcion de adecuacion:
$$\text{Fitness} = \frac{E}{\sigma^2}$$
Los individuos se ordenan de mayor a menor aptitud, preservando el 50% superior de la poblacion para cruce.

### 2. Optimizacion Multi-Objetivo (`Tipo = 2`)

* **Frente de Pareto por Conteo de Dominancia (`DetermDom`)**: Asigna una puntuacion basada en cuantos individuos de la poblacion superan al sujeto actual en ambos criterios ($E_j > E_i$ o $\sigma^2_j < \sigma^2_i$). Selecciona el 25% con menor indice de dominancia.
* **Preservacion de Diversidad por Distancia Euclidiana (`Deter_Dist_Eu`)**: Mide el distanciamiento espacial entre soluciones no dominadas para prevenir la convergencia prematura en un solo punto, seleccionando un 10% adicional de individuos alejados.

### 3. Cruce y Mutacion Adaptativa

* **Cruce Uniforme Ponderado**: Genera descendientes combinando genes con un factor estocastico:
  $$x_{\text{hijo}} = x_A \cdot \text{Combi} + x_B \cdot (1 - \text{Combi})$$
* **Mutacion Gaussiana con Ajuste de Balance**: Aplica perturbaciones controladas sobre un gen ($x_i \pm \Delta$) y redistribuye equitativamente el cambio sobre los 3 genes restantes ($\mp \Delta / 3$) para garantizar que la suma total permanezca estrictamente igual a $1.0$.

---

## Datos de Entrada Financieros (`Datos.java`)

### Retorno Esperado y Varianza por Activo

| Activo | Rendimiento Esperado ($E_i$) | Varianza Propia ($\sigma_i^2$) |
| --- | --- | --- |
| **Ecopetrol** | 0.00429493 | 0.00671900 |
| **PREC** | 0.02689857 | 0.03438852 |
| **PfbColom** | 0.00827647 | 0.00344421 |
| **GrupoSura** | 0.00794438 | 0.00233944 |

### Matriz de Covarianzas ($\Sigma$)

```

             Ecopetrol       PREC       PfbColom    GrupoSura
Ecopetrol    0.00671900   0.01193778   0.00170523   0.00161020
PREC         0.01193778   0.03438852   0.00402569   0.00375060
PfbColom     0.00170523   0.00402569   0.00344421   0.00185332
GrupoSura    0.00161020   0.00375060   0.00185332   0.00233944

```

---

## Ejecucion y Archivos de Salida

### Compilacion y Ejecucion via Consola

```bash
# Compilar clases
javac -d bin src/*.java

# Ejecutar programa principal
java -cp bin Program
```

### Estructura de Archivos Generados

* **`D.csv`**: Archivo separado por punto y coma con formato `Beneficio;Riesgo` conteniendo los 600 puntos resultantes para la construccion de la Frontera Eficiente.
* **`Datos.txt`**: Tabulacion detallada por corrida con columnas `Iteracion \t Beneficio \t Riesgo \t Fitness`.
* **`X.txt`**: Traza completa de la poblacion por generacion, incluyendo los pesos especificos de los 4 genes del mejor sujeto.

---

## Visualizacion Cuantitativa de la Frontera Eficiente

Script en Python utilizando `pandas` y `matplotlib` para procesar el archivo `D.csv` y graficar la frontera de Markowitz:

```python
import pandas as pd
import matplotlib.pyplot as plt

# Cargar datos generados por el algoritmo genetico
df = pd.read_csv('D.csv', sep=';', header=None, names=['Rendimiento', 'Riesgo'])

# Graficar nube de puntos y frontera eficiente
plt.figure(figsize=(10, 6))
plt.scatter(df['Riesgo'], df['Rendimiento'], color='#1E88E5', alpha=0.5, edgecolors='none', s=20)
plt.title('Frontera Eficiente de Markowitz - Algoritmo Genetico')
plt.xlabel('Riesgo del Portafolio (Varianza $\sigma^2$)')
plt.ylabel('Rendimiento Esperado ($E$)')
plt.grid(True, linestyle='--', alpha=0.6)
plt.show()
```

---

**Desarrollado por Jose Gregorio Briceño Romero**  
*Ingenieria Informatica - Universidad Nacional Experimental del Tachira (UNET)*
