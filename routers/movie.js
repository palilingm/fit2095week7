var Actor = require('../models/actor');
var Movie = require('../models/movie');
const mongoose = require('mongoose');
const movie = require('../models/movie');
module.exports = {
    getAll: function (req, res) {
        Movie.find({}).populate('actors').exec(function (err, movies) {
            if (err) return res.status(400).json(err);
            res.json(movies);
        });
    },
    createOne: function (req, res) {
        let newMovieDetails = req.body;
        // newMovieDetails._id = new mongoose.Types.ObjectId(); //Removed because of added auto to schema
        Movie.create(newMovieDetails, function (err, movie) {
            if (err) return res.status(400).json(err);
            res.json(movie);
        });
    },
    getOne: function (req, res) {
        Movie.findOne({
                _id: req.params.id
            })
            .populate('actors')
            .exec(function (err, movie) {
                if (err) return res.status(400).json(err);
                if (!movie) return res.status(404).json();
                res.json(movie);
            });
    },
    updateOne: function (req, res) {
        Movie.findOneAndUpdate({
            _id: req.params.id
        }, req.body, function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();
            res.json(movie);
        });
    },
    deleteOne: (req, res) => { //Delete a movie by ID
        Movie.findByIdAndDelete({
                _id: req.params.id
            },
            function (err, data) {
                if (err) return res.status(400).json(err);
                if (data == null) return res.status(404).json('No movie with such ID!');
                res.json();
            });
    },
    deleteActor: (req, res) => { //Remove an actor from the movie
        Movie.findOne({
            _id: req.params.id
        }, function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json("No such movie is found!");
            // console.log(movie.actors[0].equals(req.params.actor), movie.actors);
            let pos = deleteFirstOccurence(movie.actors, req.params.actor);
            if (!pos) return res.status(404).json("This movie did not have that actor");
            movie.actors.splice(pos, 1);
            movie.save(function (err) {
                if (err) return res.status(500).json(err);
                res.json(movie);
            });
        });
    },
    addActor: (req, res) => {
        Movie.findOne({
            _id: req.params.id
        }, function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json("No such movie is found!");
            Actor.findOne({
                _id: req.params.actor
            }, function (err, actor) {
                if (err) return res.status(400).json(err);
                if (!actor) return res.status(404).json("The actor does not exist");
                movie.actors.push(actor._id);
                movie.save(function (err) {
                    if (err) return res.status(500).json(err);
                    res.json(movie);
                });
            });
        });
    },
    deleteYear: (req, res) => {
        Movie.deleteMany({'year': { $lte: req.body.year1, $gte: req.body.year2}}, (err, movies) => {
            if (err) return res.status(400).json(err);
            // if (movies.deletedCount == 0) res.status(404).json("There's no movie playing between those years"); //Doesn't need this since 0 count is true
            res.json(`${movies.deletedCount} movie(s) was deleted`);
        });
    }
};

//functions
function deleteFirstOccurence(array, query) { //Delete first occurence in an array of objectIDs
    for (let i = 0; i < array.length; i++) {
        if (array[i].equals(query)) {
            array.splice(i, 1);
            return true;
        }
    }
    return false;
}