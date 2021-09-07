const mongoose = require('mongoose');
const movieSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true
    },
    title: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    actors: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Actor'
    }]
});
module.exports = mongoose.model('Movie', movieSchema);