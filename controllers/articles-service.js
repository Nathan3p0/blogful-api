const ArticlesService = {
    getAllArticles(knex) {
        return knex.select('*').from('blogful_articles');
    },
    getById(knex, id) {
        return knex.select('*').from('blogful_articles').where('id', id).first();
    }
};

module.exports = ArticlesService;