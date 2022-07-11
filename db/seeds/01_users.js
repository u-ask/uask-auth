const fs = require( "fs");
const path =require( "path");

const users = JSON.parse(fs.readFileSync(path.resolve(__dirname, "./users.json")).toString())

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('accounts').del()
    .then(function () {
      // Inserts seed entries
      return knex('accounts').insert(users.map(u => {
        return {
          id: u.id,
          email: u.email,
          email_verified: u.email_verified,
          given_name: u.given_name,
          password: u.password,
          surname: u.surname,
          salt: u.salt,
          title: u.title,
          phone: u.phone,
          surveys: JSON.stringify(u.surveys),
          userid: u.userid
        }
      }));
    });
};
