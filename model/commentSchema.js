const mongoose = require('mongoose')


const commentSchema = new mongoose.Schema({
    comments:{
        type: String,
        required: true
    }
})