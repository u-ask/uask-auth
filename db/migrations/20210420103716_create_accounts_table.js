
exports.up = function(knex) {
  return knex.schema.hasTable("accounts").then(async b => {
    if (!b)
      await knex.schema.createTable("accounts", t => {
        t.string("id");
        t.string("email");
        t.boolean("email_verified");
        t.string("given_name");
        t.string("password");
        t.string("surname");
        t.string("salt");
        t.string("title");
        t.string("phone");
        t.string("surveys");
        t.string("participant_id")
        t.primary("email");
      });
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("accounts");
};
