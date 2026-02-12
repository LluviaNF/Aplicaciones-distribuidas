// npm install express

var express = require('express');
var app = express(); //Contenedor de Endpoints o WS Restful

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async function (request, response) {

    r ={
      'message':'Nothing to send'
    };

    response.json(r);
});


// Call this service sending payload in body: raw - json
/*
{
    "id": "pt001",
    "lat": "ertydfg456Dfgwerty",
    "long": "12345678,34567890"
    "id1_e": "pt001",
    "lat1_e": "ertydfg456Dfgwerty",
    "long1_e": "12345678,34567890"
}
*/
app.post("/echo", async function (req, res) {
  const cid = req.body.id;
  const clat = req.body.token;
  const clong = req.body.geo;
  const cid1_e = req.body.id1;
  const clat1_e = req.body.token1;
  const clong1_e = req.body.geo1;

    r ={
      'id_e': cid,
      'id2_e': cid1_e,
      'lat_e': clat,
      'lat2_e': clat1_e,
      'long_e': clong,
      'long2_e': clong1_e
    };

    res.json(r);
});

app.listen(3000, function() {
    console.log('Aplicación ejemplo, escuchando el puerto 3000!');
});

