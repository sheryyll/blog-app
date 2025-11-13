// In routes/articles.js
const router = require('express').Router();
let Article = require('../models/article.model');

// 1. GET ALL ARTICLES (R - Read)
// URL: /articles/
// Supports filtering by tag and date: /articles?tag=tech&date=2024-01-01
router.route('/').get((req, res) => {
  // Build query object based on filters
  let query = {};
  
  // Filter by tag
  if (req.query.tag) {
    query.tags = req.query.tag;
  }
  
  // Filter by date (published date)
  if (req.query.date) {
    const startOfDay = new Date(req.query.date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(req.query.date);
    endOfDay.setHours(23, 59, 59, 999);
    
    query.createdAt = {
      $gte: startOfDay,
      $lte: endOfDay
    };
  }
  
  Article.find(query)
    .sort({ createdAt: -1 }) // Sort by publishing date, newest first
    .then(articles => res.json(articles))
    .catch(err => res.status(400).json('Error: ' + err));
});

// 2. CREATE NEW ARTICLE (C - Create)
// URL: /articles/add
router.route('/add').post((req, res) => {
  const { title, content, author, tags } = req.body;

  const newArticle = new Article({
    title,
    content,
    author,
    tags,
  });

  newArticle.save()
    .then(() => res.json('Article added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

// 3. GET SINGLE ARTICLE (R - Read)
// URL: /articles/12345
router.route('/:id').get((req, res) => {
  Article.findById(req.params.id)
    .then(article => res.json(article))
    .catch(err => res.status(400).json('Error: ' + err));
});

// 4. DELETE ARTICLE (D - Delete)
// URL: /articles/12345
router.route('/:id').delete((req, res) => {
  Article.findByIdAndDelete(req.params.id)
    .then(() => res.json('Article deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

// 5. UPDATE ARTICLE (U - Update)
// URL: /articles/update/12345
// Supports both POST and PUT methods for RESTful compliance
router.route('/update/:id').post((req, res) => {
  Article.findById(req.params.id)
    .then(article => {
      if (!article) {
        return res.status(404).json('Article not found');
      }
      
      article.title = req.body.title;
      article.content = req.body.content;
      article.author = req.body.author;
      article.tags = req.body.tags;

      article.save()
        .then(() => res.json('Article updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

// Alternative PUT method for RESTful compliance
router.route('/:id').put((req, res) => {
  Article.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(article => {
      if (!article) {
        return res.status(404).json('Article not found');
      }
      res.json('Article updated!');
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;