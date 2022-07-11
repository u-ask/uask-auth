
exports.up = async function(knex) {
  await knex.schema.alterTable("accounts", t => {
    t.unique("id");
  });
};

exports.down = async function(knex) {
  await knex.schema.alterTable("accounts", t => {
    t.dropUnique("id");
  });
};
