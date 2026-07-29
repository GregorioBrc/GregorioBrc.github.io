# Compilador TINY - Extension Procedural, Gestion de Ambitos y Generacion TM

[![Java](https://img.shields.io/badge/Java-8%2B-ED8B00?style=flat-square&logo=openjdk&logoColor=white)](https://www.java.com/)
[![JFlex](https://img.shields.io/badge/Lexer-JFlex%201.9-00599C?style=flat-square)](https://jflex.de/)
[![JavaCUP](https://img.shields.io/badge/Parser-JavaCUP%2011b-CC292B?style=flat-square)](http://www2.cs.tum.edu/projects/cup/)
[![PowerShell](https://img.shields.io/badge/Automation-PowerShell-5391FE?style=flat-square&logo=powershell&logoColor=white)](https://microsoft.com/)

## Descripcion General

Este proyecto implementa un **compilador completo de un solo paso** para una version extendida del lenguaje imperativo **TINY**. El sistema realiza las fases de analisis lexico, analisis sintactico LALR(1), verificacion semantica mediante tablas de simbolos jerarquicas y generacion de codigo objeto en ensamblador para la maquina virtual de registros **Tiny Machine (TM)**.

A partir de la especificacion academica original, el lenguaje fue extendido para soportar construcciones de programacion procedural (funciones con retorno y parametros), arreglos unidimensionales (vectores), operador modulo, estructuras de control iterativas avanzadas (`for`) y manejo dinamico de marcos de pila (*Stack Frames*).

---

## Extensiones del Lenguaje y Optimizaciones

### 1. Descomposicion Sintactica de Bucles (AST Lowering)

Para mantener la simplicidad y eficiencia en el backend generador de codigo, el ciclo `for` no emite instrucciones complejas directamente. En su lugar, la clase `NodoFor` implementa la descomposicion sintactica en la fase del parser (`For_to_Repeat()`), reescribiendo el nodo en una combinacion equivalente de:

```

Asignacion Inicial + If (Verificacion de limite) + Repeat (Cuerpo + Incremento)

```

### 2. Gestion de Ambitos y Pila de Tablas de Simbolos

La clase `TablaSimbolos` implementa la visibilidad de variables globales y locales mediante una **pila de tablas hash** (`Stack<HashMap<String, RegistroSimbolo>>`).

* **Soporte Procedural**: Entradas y salidas de contexto (`EntrarAmbito` y `SalirAmbito`) que reservan bloques de direcciones de memoria locales para evitar colisiones entre variables globales y locales.
* **Tipado de Registros**: Diferenciacion de simbolos mediante jerarquia de clases: `RegistroSimbolo` (variables simples), `RegistroArray` (vectores con tamaño y desplazamiento) y `RegistroFuncion` (subrutinas con recuento de parametros y direccion de inicio).

### 3. Soporte de Arreglos (Vectores)

* Declaracion explicita de arreglos mediante la sintaxis `var identificador[tamaño]`.
* Calculo dinamico de desplazamiento en tiempo de ejecucion (`dir_base + indice`) mediante instrucciones de registro a memoria (`RM`).
* Validacion semantica que bloquea limites negativos o accesos fuera de rango estatico durante la carga de la tabla de simbolos.

### 4. Implementacion Ensamblador del Operador Modulo (`MOD`)

Dado que la Tiny Machine (TM) carece de una instruccion nativa para el residuo de la division, el generador de codigo emite un bloque de 9 instrucciones ensamblador secuenciales que calculan el residuo algebraico:

```

q = operando_izq / operando_der
p = operando_der * q
residuo = operando_izq - p

```

---

## Fases de Compilacion y Arquitectura del Sistema

El flujo de traduccion de codigo fuente `.tiny` a ensamblador `.tm` consta de las siguientes etapas:

1. **Analisis Lexico (`Lexico.java` / `lexico.flex`)**: Escaner generado con JFlex que reconoce tokens, palabras reservadas (`fun`, `return`, `var`, `for`, `to`, `do`), operadores aritmeticos/relacionales e ignora comentarios entre llaves `{}`.
2. **Analisis Sintactico (`parser.java` / `sintactico.cup`)**: Parser LALR(1) generado con JavaCUP que construye el Arbol de Sintaxis Abstracta (AST) jerarquico utilizando clases especializadas derivando de `NodoBase`.
3. **Analisis Semantico (`TablaSimbolos.java`)**: Recorrido del AST para la validacion de identificadores no declarados, concordancia de parametros en llamadas a funcion y construccion del mapa de memoria.
4. **Generacion de Codigo Objeto (`Generador.java` / `UtGen.java`)**: Emision de instrucciones TM utilizando la distribucion de registros de la CPU objetivo.

---

## Modelo de Memoria y Registros de la Maquina Virtual (TM)

El generador mapea la ejecucion sobre los registros nativos de la Tiny Machine:

| Registro | Identificador | Funcion |
| --- | --- | --- |
| `reg[0]` | `AC` | Acumulador principal para operaciones y retorno de funciones |
| `reg[1]` | `AC1` | Acumulador secundario para operando izquierdo en operaciones |
| `reg[5]` | `GP` | Puntero Global (*Global Pointer*) a la memoria estatica de variables |
| `reg[6]` | `MP` | Puntero de Memoria (*Memory Pointer*) al tope de la pila temporal |
| `reg[7]` | `PC` | Contador de Programa (*Program Counter*) |

---

## Automatizacion de Compilacion (`Analist.ps1`)

El proyecto incluye un script en PowerShell para regenerar automaticamente el analizador lexico y el parser sintactico tras modificaciones en la gramatica:

```powershell
./Analist.ps1
```

### Ejecucion del Compilador

Para compilar un archivo fuente `.tiny` y emitir el codigo objeto TM:

```bash
# Compilacion del proyecto Java
javac -cp "lib/java-cup-11b.jar;src/" -d bin src/App.java src/nodosAST/*.java src/Registros/*.java

# Ejecucion sobre archivo fuente
java -cp "lib/java-cup-11b.jar;bin" App ejemplo.tiny
```

---

## Ejemplo de Codigo Fuente Soportado

```tiny
fun sumar(a, b)
    return a + b;
endf

var lista[5];
i := 0;

for i := 0 to 4 do
    lista[i] := i * 2;
end;

write sumar(lista[2], 10);
```

---

**Desarrollado por:**  
Jose Gregorio Briceño Romero  
Francisco José Sanchez Zea  
*Ingenieria Informatica - Universidad Nacional Experimental del Tachira (UNET)*
