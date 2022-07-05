
exports.up = function(knex) {
  return knex.schema.alterTable("accounts", t => {
    t.string("surveys", 10000).alter();
  });
};

exports.down = function(knex) {
};
