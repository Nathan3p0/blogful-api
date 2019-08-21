const ArticlesService = {
    getAllArticles(knex) {
        return knex.select('*').from('blogful_articles');
    },
    getById(knex, id) {
        return knex.select('*').from('blogful_articles').where('id', id).first();
    },
    postNewArticle(knex, article) {
        return knex('blogful_articles').insert(article);
    }
};

module.exports = ArticlesService;