const mongoose = require('mongoose');
const Actor = require('../models/actor');
const Movie = require('../models/movie');
const ObjectId = require('mongodb').ObjectID;
module.exports = {
    getAll: function (req, res) {
        Actor.find({}).populate('movies').exec((function (err, actors) {
            if (err) {
                return res.status(404).json(err);
            } else {
                res.json(actors);
            }
        }));
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
        Actor.findOneAndDelete({
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
            if (!actor) return res.status(404).json("The actor did not exist");
            Movie.findOne({
                _id: req.params.movie //changed
            }, function (err, movie) {
                if (err) return res.status(400).json(err);
                if (!movie) return res.status(404).json("The movie does not exist");
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
            // console.log(actor.movies[0].equals(req.params.movie), actor.movies);
            let pos = deleteFirstOccurence(actor.movies, req.params.movie);
            if (!pos) return res.status(404).json("The actor did not play in that movie");
            actor.save(function (err) {
                if (err) return res.status(500).json(err);
                res.json(actor);
            });
        });
    },
    getYear: (req, res) => {
        Actor.where('bYear').lte(req.params.year1).gte(req.params.year2).exec((err, actors) => {
            if (err) return res.status(400).json(err);
            if (!actors) return res.status(404).json("There's no actor born between those years");
            res.json(actors)
        });
    },
    deleteWithMovie: (req, res) => {
        Actor.findOne({
            _id: req.params.id
        }, function (err, actor) {
            if (err) return res.status(400).json(err);
            if (!actor) return res.status(404).json("No such actor is found!");
            for (i = 0; i < actor.movies.length; i++) {
                //Deleting any movie which the actor reference
                Movie.findByIdAndDelete({
                        _id: actor.movies[i]
                    },
                    function (err, data) {
                        if (err) return res.status(400).json(err);
                    });
                //// Deleting any references to that actor in every movie
                // Movie.findById({
                //     _id: req.params.id
                // }, (err, data) => {
                //     if (err) return res.status(400).json(err);
                //     let pos = deleteFirstOccurence(data.actors, req.params.id);
                //     data.actors.splice(pos, 1);
                //     data.save(function (err) {
                //         if (err) return res.status(500).json(err);
                //     });
                // });
            }
            Actor.findOneAndDelete({
                _id: req.params.id
            }, function (err) {
                if (err) return res.status(400).json(err);
            });
            res.json(i + ' movies were deleted')
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