const express = require('express');
const articlesRouter = express.Router();
const ArticlesService = require('../controllers/articles-service')
const jsonParser = express.json()
const path = require('path')
const xss = require('xss')

const serializeArticle = article => ({
    id: article.id,
    style: article.style,
    title: xss(article.title),
    content: xss(article.content),
    date_published: article.date_published,
})

articlesRouter.route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        ArticlesService.getAllArticles(knexInstance)
            .then(articles => {
                res.json(articles)
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { title, content, style } = req.body
        const newArticle = { title, content, style }

        for (const [key, value] of Object.entries(newArticle)) {
            if (value == null) {
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                })
            }
        }

        ArticlesService.postNewArticle(
            req.app.get('db'),
            newArticle
        )
            .then(article => {
                res.status(201)
                    .location(path.posix.join(req.originalUrl, `/${article.id}`))
                    .json(article)
            })
            .catch(next)
    })

articlesRouter.route('/:article_id')
    .all((req, res, next) => {
        const knexInstance = req.app.get('db')
        const { article_id } = req.params

        ArticlesService.getById(knexInstance, article_id)
            .then(article => {
                if (!article) {
                    return res.status(404).json({
                        error: { message: `Article doesn't exist` }
                    })
                }
                res.article = article
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json(serializeArticle(res.article))
    })
    .delete((req, res, next) => {
        const { article_id } = req.params
        const knexInstance = req.app.get('db')
        ArticlesService.deleteArticle(knexInstance, article_id)
            .then(() => {
                res.status(204).end()
            })
            .catch(next)
    })

module.exports = articlesRouter