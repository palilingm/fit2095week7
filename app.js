//https://hub.packtpub.com/building-movie-api-express/
const express = require('express');
const mongoose = require('mongoose');

const actors = require('./routers/actor');
const { addActor } = require('./routers/movie');
const movies = require('./routers/movie');

const app = express();

app.listen(8080);


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose.connect('mongodb://localhost:27017/movies', function (err) {
    if (err) {
        return console.log('Mongoose - connection error:', err);
    }
    console.log('Connect Successfully');

});

//Configuring Endpoints
//Actor RESTFul endpoionts 
app.get('/actors', actors.getAll); //Updated //Done
app.post('/actors', actors.createOne);
app.get('/actors/:id', actors.getOne);
app.put('/actors/:id', actors.updateOne);
app.post('/actors/:id/:movie', actors.addMovie);
app.delete('/actors/:id', actors.deleteOne); //Changet to use fidn and delete
//New
app.delete('/actors/deleteAll/:id', actors.deleteWithMovie); //Done?
app.delete('/actors/:id/:movie', actors.deleteMovie); //Done
app.get('/actors/year/:year1/:year2', actors.getYear); //Done


//Movie RESTFul  endpoints
app.get('/movies', movies.getAll); //Updated //Done
app.post('/movies', movies.createOne);
app.get('/movies/:id', movies.getOne);
app.put('/movies/:id', movies.updateOne);
//New
app.delete('/movies/year', movies.deleteYear);
app.delete('/movies/:id', movies.deleteOne); //Done
app.delete('/movies/:id/:actor', movies.deleteActor); //Done
app.put('/movies/:id/:actor', movies.addActor); //Done
