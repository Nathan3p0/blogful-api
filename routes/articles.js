const express = require('express');
const router = express.Router();
const ArticlesService = require('../controllers/articles-service');

router.get('/', (req, res, next) => {
    const knexInstance = req.app.get('db');
    ArticlesService.getAllArticles(knexInstance)
        .then(articles => {
            res.json(articles)
        })
        .catch(next)
});

router.get('/:article_id', (req, res, next) => {
    const knexInstance = req.app.get('db');
    ArticlesService.getById(knexInstance, req.params.article_id)
        .then(article => {
            if (!article) {
                return res.status(404).json({
                    error: { message: `Article doesn't exist` }
                })
            }
            res.json(article)
        })
        .catch(next)
})


module.exports = router;