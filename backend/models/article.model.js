const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, default: 'Admin' },
    tags: [{ type: String }], // An array of strings
}, {
    timestamps: true, // Automatically adds 'createdAt' and 'updatedAt'
});

const Article = mongoose.model('Article', articleSchema);
module.exports = Article;