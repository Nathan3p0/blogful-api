const express = require('express');
const router = express.Router();
const ArticlesService = require('../controllers/articles-service');
const jsonParser = express.json()

router.use(jsonParser);

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

router.post('/', (req, res, next) => {
    const { title, content, style } = req.body;
    const newArticle = { title, content, style };

    ArticlesService.postNewArticle(
        req.app.get('db'),
        newArticle
    )
        .then(article => {
            res.status(201)
                .location('back')
                .json(article)
        })
        .catch(next)
})


module.exports = router;