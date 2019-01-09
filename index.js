"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const restService = express();
const mysql = require('mysql');
const HOST = "74.208.160.86";
const USER = "root";
const PASSWORD = "Hs1EE00b05";
const DATABASE = "neurona_wireless";
restService.use(
  bodyParser.urlencoded({
    extended: true
  })
);
restService.use(bodyParser.json());
// Funcion que se llama desde DialogFlow
restService.post("/echo", function(req, res) {
  var Sensores =
    req.body.queryResult &&
    req.body.queryResult.parameters &&
    req.body.queryResult.parameters.Sensores
      ? req.body.queryResult.parameters.Sensores
      : "vacio";
  var Estacion =
    req.body.queryResult &&
    req.body.queryResult.parameters &&
    req.body.queryResult.parameters.Estacion
      ? req.body.queryResult.parameters.Estacion
      : "vacio";
  var email =
    req.body.queryResult &&
    req.body.queryResult.parameters &&
    req.body.queryResult.parameters.email
      ? req.body.queryResult.parameters.email
      : "vacio";

  var respuesta  = "";
  var id_sensor  = "";
  var idestacion = "";
  var tipoValor  = "";
  var idUsuario  = "";
  var idNeurona  = "";

  if (Sensores == "vacio" || Estacion == "vacio" || email == "vacio"){ //Si cualquiera esta vacio
    if (Sensores == "vacio" && Estacion != "vacio" && email != "vacio") {
      ConsultaEmail(email, function(resultadoEmail) {
        if (resultadoEmail!=null) {
          respuesta = "Si esta en el sistema";
          return res.json({
            fulfillmentText: respuesta,
            source: "webhook-echo-sample"
          });
        }else{
          espuesta = "Lo siento, usted no pertenece a nuestro sistema, ¿Necesitas algo más?";
          return res.json({
            fulfillmentText: respuesta,
            source: "webhook-echo-sample"
          });
        }
      });
    }
  }else{ //Da todos los datos

  }


});

function ConsultaLectura(id_estacion, resultado) {
    var connection = mysql.createConnection({
      host: HOST,
      user: USER,
      password: PASSWORD,
      database: DATABASE
    });
    connection.connect(function(err) {
      if (err) throw err;
      resultado("Connected!");
    });
    var returnValue = "Valor";
    connection.query("SELECT MAX(id) AS id FROM lectures WHERE station_id = "+id_estacion, function(error, result){
      if(error){
        resultado(null);
      }else{
          if(result[0] == undefined){
            resultado(null);
          }else{
            returnValue = result[0].id;
            resultado(returnValue);
          }
        }
     }
    );
    connection.end();
}

function ConsultaValor(id_lectura,id_sensor, resultado) {
    var connection = mysql.createConnection({
      host: HOST,
      user: USER,
      password: PASSWORD,
      database: DATABASE
    });
    connection.connect(function(err) {
      if (err) throw err;
      resultado("Connected!");
    });
    var returnValue = "Valor";
    var Sentencia = "SELECT value FROM registers WHERE lecture_id = '"+id_lectura+"' AND sensor_id = '"+id_sensor+"'";
    connection.query(Sentencia, function(error, result){
        if(error){
          resultado(null);
        }else{
          if(result[0] == undefined){
            resultado(null);
          }else{
            returnValue = result[0].value;
            resultado(returnValue);
          }
        }
      }
    );
    connection.end();
}

function ConsultaEmail(email, resultado) {
    var connection = mysql.createConnection({
      host: HOST,
      user: USER,
      password: PASSWORD,
      database: DATABASE
    });
    connection.connect(function(err) {
      if (err) throw err;
      console.log("Connected!");
    });
    var returnValue = "Valor";
    var Sentencia = "SELECT id FROM users WHERE email = '"+email+"'";
    connection.query(Sentencia, function(error, result){
        if(error){
          resultado(null);
        }else{
          if(result[0] == undefined){
            resultado(null);
          }else{
            returnValue = result[0].id;
            resultado(returnValue);
          }
        }
      }
    );
    connection.end();
}

function ConsultaNeurona(idUsuario, Estacion, resultado) {
    var connection = mysql.createConnection({
      host: HOST,
      user: USER,
      password: PASSWORD,
      database: DATABASE
    });
    connection.connect(function(err) {
      if (err) throw err;
      console.log("Connected!");
    });
    var returnValue = "Valor";
    var Sentencia = "SELECT id FROM stations WHERE user_id = '"+idUsuario+"' AND name = '"+Estacion+"' ";
    connection.query(Sentencia, function(error, result){
        if(error){
          resultado(null);
        }else{
          if(result[0] == undefined){
            resultado(null);
          }else{
            returnValue = result[0].id;
            resultado(returnValue);
          }
        }
      }
    );
    connection.end();
}

function ConsultaAllValores(id_lectura, resultado) {
    var connection = mysql.createConnection({
      host: HOST,
      user: USER,
      password: PASSWORD,
      database: DATABASE
    });
    connection.connect(function(err) {
      if (err) throw err;
      resultado("Connected!");
    });
    var returnValue = "Valor";
    var Sentencia = "SELECT value FROM registers WHERE lecture_id = '"+id_lectura+"'";
    connection.query(Sentencia, function(error, result){
        if(error){
          resultado(null);
        }else{
          if(result[0] == undefined){
            resultado(null);
          }else{
            returnValue = result[0].value;
            resultado(returnValue);
          }
        }
      }
    );
    connection.end();
}

restService.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening");
});






