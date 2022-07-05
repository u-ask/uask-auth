
exports.up = function(knex) {
  return knex.schema.table("accounts", t => {
    t.string("extra_infos");
  });
};

exports.down = function(knex) {
  return knex.schema.table("accounts", t => {
    t.dropColumn("extra_infos");
  });
};
