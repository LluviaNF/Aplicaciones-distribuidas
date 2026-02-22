// npm install express
var express = require('express');
var app = express(); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// BASE DE DATOS EN MEMORIA 
let tareas = []; // array para el Ejercicio 3

// endpoint raíz existente
app.get("/", async function (request, response) {
    r = { 'message': 'Nothing to send' };
    response.json(r);
});



//1 SERVICIO DE SALUDO 
app.post("/saludo", async function (req, res) {
    const { nombre } = req.body;
    res.json({ estado: 200, mensaje: `Hola, ${nombre}` });
});

//2 CALCULADORA 
app.post("/calcular", async function (req, res) {
    const { a, b, operacion } = req.body;
    let resultado;

    switch (operacion) {
        case 'suma': resultado = a + b; break;
        case 'resta': resultado = a - b; break;
        case 'multiplicacion': resultado = a * b; break;
        case 'division':
            if (b === 0) return res.status(400).json({ estado: 400, error: "No se puede dividir por cero" });
            resultado = a / b;
            break;
        default:
            return res.status(400).json({ estado: 400, error: "Operación no válida" });
    }
    res.json({ estado: 200, resultado: resultado });
});

//3 GESTOR DE TAREAS
app.post("/tareas", async function (req, res) {
    const { id, titulo, completada } = req.body;
    const nuevaTarea = { id, titulo, completada };
    tareas.push(nuevaTarea);
    res.json({ estado: 201, tarea: nuevaTarea });
});

app.get("/tareas", async function (req, res) {
    res.json({ estado: 200, tareas: tareas });
});

app.put("/tareas/:id", async function (req, res) {
    const { id } = req.params;
    const { titulo, completada } = req.body;

    const index = tareas.findIndex(t => t.id == id);
    
    if (index !== -1) {
        tareas[index] = { id: parseInt(id), titulo, completada };
        return res.json({ estado: 200, tarea: tareas[index] });
    }
    res.status(404).json({ estado: 404, mensaje: "No encontrada" });

});

app.delete("/tareas/:id", async function (req, res) {
    const { id } = req.params;
    tareas = tareas.filter(t => t.id != id);
    res.json({ estado: 200, mensaje: "Eliminado" });
});



//4 VALIDADOR DE CONTRASEÑAS 
app.post("/validar-password", async function (req, res) {
    const { password } = req.body;
    let errores = [];

    // validaciones usando expresiones regulares
    if (!password || password.length < 8) errores.push("Debe tener mínimo 8 caracteres");
    if (!/[A-Z]/.test(password)) errores.push("Debe tener al menos una mayúscula");
    if (!/[a-z]/.test(password)) errores.push("Debe tener al menos una minúscula");
    if (!/[0-9]/.test(password)) errores.push("Debe tener al menos un número");

    res.json({
        estado: 200,
        esValida: errores.length === 0, // Es true si no hay errores
        errores: errores
    });
});

//5 CONVERSOR DE TEMPERATURA 
app.post("/convertir-temperatura", async function (req, res) {
    const { valor, desde, hacia } = req.body;
    let convertido = valor;

    // Convertir todo a Celsius primero para facilitar la conversión del final
    let tempCelsius;
    if (desde === 'C') tempCelsius = valor;
    else if (desde === 'F') tempCelsius = (valor - 32) * 5/9;
    else if (desde === 'K') tempCelsius = valor - 273.15;
    else return res.status(400).json({ estado: 400, error: "Escala 'desde' inválida" });

    // Convertir de Celsius a la escala que se pide
    if (hacia === 'C') convertido = tempCelsius;
    else if (hacia === 'F') convertido = (tempCelsius * 9/5) + 32;
    else if (hacia === 'K') convertido = tempCelsius + 273.15;
    else return res.status(400).json({ estado: 400, error: "Escala 'hacia' inválida" });

    // Redondear a 2 decimales para que se vea mejor
    convertido = Math.round(convertido * 100) / 100;

    res.json({
        estado: 200,
        valorOriginal: valor,
        valorConvertido: convertido,
        escalaOriginal: desde,
        escalaConvertida: hacia
    });
});

// 6 BUSCADOR EN ARRAY 
app.post("/buscar", async function (req, res) {
    const { array, elemento } = req.body;
    
    // buscar el índice del elemento
    const indice = array.indexOf(elemento);
    const encontrado = indice !== -1;
    const tipoElemento = typeof elemento;

    res.json({
        estado: 200,
        encontrado: encontrado,
        indice: indice, // será -1 si no lo se encuentra
        tipoElemento: tipoElemento
    });
});

// 7 CONTADOR DE PALABRAS
app.post("/contar-palabras", async (req, res) => {
    try {
        const { texto } = req.body;
        if (typeof texto !== 'string') {
            return res.status(400).json({ estado: 400, error: "Se requiere un string en 'texto'" });
        }

        const palabras = texto.trim().split(/\s+/).filter(word => word.length > 0);
        const palabrasUnicas = new Set(palabras.map(p => p.toLowerCase())).size;

        res.json({
            estado: 200,
            totalPalabras: palabras.length,
            totalCaracteres: texto.length,
            palabrasUnicas: palabrasUnicas
        });
    } catch (error) {
        res.status(500).json({ estado: 500, error: "Error al contar palabras", detalle: error.message });
    }
});


//para saber que el sevidor esta en linea o corriendo
app.listen(3000, function() {
    console.log('Aplicación ejemplo, escuchando el puerto 3000!');
});