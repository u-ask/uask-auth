
exports.up = async function(knex) {
  await knex.schema.dropTable("accounts");
  await knex.schema.createTable("accounts", t => {
    t.string("id");
    t.string("userid");
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
    t.primary("userid");
  });
  
};

exports.down = function(knex) {
  
};
