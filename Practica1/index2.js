//Nombre: Flores Hernandez Lluvia Nahivy
//Materia: Aplicaciones distribuidas    Profesor: Noe Sierra Romero
//Practica 1
//Consiste en crear una serie de servicios web usando un servidor NodeJS
// npm install express
var express = require('express');
var crypto = require('crypto'); // se importa esta libreria para poder utilizar el sha256
var app = express(); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async function (request, response) {
    var r = { 'message': 'Servidor funcionando correctamente' };
    response.json(r);
});


// 1. mascaracteres
app.post("/mascaracteres", function (req, res) {
    const { cadena1, cadena2 } = req.body;

    // Validación de parámetros
    if (!cadena1 || !cadena2) {
        return res.status(400).json({ error: "Faltan parámetros: cadena1 y cadena2" });
    }

    // Lógica: Si son iguales, regresa la primera
    const resultado = (cadena1.length >= cadena2.length) ? cadena1 : cadena2;
    
    res.json({ resultado: resultado });
});

// 2. menoscaracteres
app.post("/menoscaracteres", function (req, res) {
    const { cadena1, cadena2 } = req.body;

    if (!cadena1 || !cadena2) {
        return res.status(400).json({ error: "Faltan parámetros: cadena1 y cadena2" });
    }

    // Lógica: Si son iguales, regresa la primera 
    const resultado = (cadena1.length <= cadena2.length) ? cadena1 : cadena2;

    res.json({ resultado: resultado });
});

// 3. numcaracteres
app.post("/numcaracteres", function (req, res) {
    const { cadena } = req.body;

    if (!cadena) {
        return res.status(400).json({ error: "Falta parámetro: cadena" });
    }
    // Regresa el numero total de caracteres que se introducen
    res.json({ resultado: cadena.length });
});

// 4. palindroma
app.post("/palindroma", function (req, res) {
    const { cadena } = req.body;

    if (!cadena) {
        return res.status(400).json({ error: "Falta parámetro: cadena" });
    }

    // Normalizamos: quitamos espacios y hacemos minúsculas para comparar bien
    
    const limpia = cadena.toLowerCase().replace(/[\W_]/g, '');
    const invertida = limpia.split('').reverse().join('');
    // Ejemplo: "Anita lava la tina" -> "anitalavalatina"

    res.json({ resultado: (limpia === invertida) });
    
});

// 5. concat
app.post("/concat", function (req, res) {
    const { cadena1, cadena2 } = req.body;

    if (!cadena1 || !cadena2) {
        return res.status(400).json({ error: "Faltan parámetros: cadena1 y cadena2" });
    }

    res.json({ resultado: cadena1 + cadena2 });
});

// 6. applysha256
app.post("/applysha256", function (req, res) {
    const { cadena } = req.body;

    if (!cadena) {
        return res.status(400).json({ error: "Falta parámetro: cadena" });
    }

    // Crear el hash
    const hash = crypto.createHash('sha256').update(cadena).digest('hex');

    //regresa la cadena original y la que ya ha sido encriptada
    res.json({ 
        original: cadena, 
        encriptada: hash 
    });
});

// 7. verifysha256
app.post("/verifysha256", function (req, res) {
    const { cadenaNormal, cadenaEncriptada } = req.body;

    if (!cadenaNormal || !cadenaEncriptada) {
        return res.status(400).json({ error: "Faltan parámetros: cadenaNormal y cadenaEncriptada" });
    }

    // Se encripta la normal para ver si coincide con la encriptada recibida
    const hashGenerado = crypto.createHash('sha256').update(cadenaNormal).digest('hex');

    res.json({ resultado: (hashGenerado === cadenaEncriptada) });
});


// Iniciar Servidor 
app.listen(3000, function() {
    console.log('Aplicación escuchando en el puerto 3000!');
});