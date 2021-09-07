const mongoose = require('mongoose');
const Actor = require('../models/actor');
const Movie = require('../models/movie');
module.exports = {
    getAll: function (req, res) {
        Actor.find(function (err, actors) {
            if (err) {
                return res.status(404).json(err);
            } else {
                res.json(actors);
            }
        });
    },
    createOne: function (req, res) {
        let newActorDetails = req.body;
        // newActorDetails._id = new mongoose.Types.ObjectId(); //Removed because of added auto to schema
        let actor = new Actor(newActorDetails);
        actor.save(function (err) {
            res.json(actor);
        });
    },
    getOne: function (req, res) {
        Actor.findOne({
                _id: req.params.id
            })
            .populate('movies')
            .exec(function (err, actor) {
                if (err) return res.status(400).json(err);
                if (!actor) return res.status(404).json();
                res.json(actor);
            });
    },
    updateOne: function (req, res) {
        Actor.findOneAndUpdate({
            _id: req.params.id
        }, req.body, function (err, actor) {
            if (err) return res.status(400).json(err);
            if (!actor) return res.status(404).json();
            res.json(actor);
        });
    },
    deleteOne: function (req, res) {
        Actor.findOneAndRemove({
            _id: req.params.id
        }, function (err) {
            if (err) return res.status(400).json(err);
            res.json();
        });
    },
    addMovie: function (req, res) {
        Actor.findOne({
            _id: req.params.id
        }, function (err, actor) {
            if (err) return res.status(400).json(err);
            if (!actor) return res.status(404).json();
            Movie.findOne({
                _id: req.params.movie //changed
            }, function (err, movie) {
                if (err) return res.status(400).json(err);
                if (!movie) return res.status(404).json();
                actor.movies.push(movie._id);
                actor.save(function (err) {
                    if (err) return res.status(500).json(err);
                    res.json(actor);
                });
            });
        });
    },
    deleteMovie: (req, res) => { //Remove a movie from an actor
        Actor.findOne({
            _id: req.params.id
        }, function (err, actor) {
            if (err) return res.status(400).json(err);
            if (!actor) return res.status(404).json("No such actor is found!");
            console.log(actor.movies);
            let pos = findOccurence(actor.movies, req.params.movie);
            if (!pos) return res.status(404).json("The actor did not play in that movie");
            actor.movies.splice(pos, 1);
            actor.save(function (err) {
                    if (err) return res.status(500).json(err);
                    res.json(actor);
                });
        });
    }
};

//functions
function findOccurence(array, query) { //Find first occurence in an array
    for (let i = 0; i < array.length; i++) {
        if (array[i] == query) {
            return i;
        }
    }
    return false;
}