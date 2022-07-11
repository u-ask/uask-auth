
exports.up = function(knex) {
  return knex.schema.table("accounts", t=> {
    t.dropPrimary();
    t.unique("userid");
    t.primary("id");
  });
};

exports.down = function(knex) {
  return knex.schema.table("accounts", t=> {
    t.dropPrimary("userid");
  });
};
