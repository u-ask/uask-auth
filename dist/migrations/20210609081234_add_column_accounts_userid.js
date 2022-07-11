
exports.up = function(knex) {
  return knex.schema.table("accounts", t=> {
    t.string("userid");
  });
};

exports.down = function(knex) {
  return knex.schema.table("accounts", t=> {
    t.dropColumn("userid");
  });
};
