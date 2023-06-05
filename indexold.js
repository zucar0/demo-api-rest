const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:true
}))

//Endpoint
app.get('/', (request, response)=>{
    response.json({info: 'La API está en ejecución'});
});

app.listen(port,()=>{
    console.log(`API corriendo en el ${port}`);
});

// Usuarios
app.get('/usuario',(request,response)=>{
    response.json({id:1,nombre:'Joel',apellidos:'Rodriguez'});
})