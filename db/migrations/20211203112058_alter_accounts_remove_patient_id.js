exports.up = async function (knex) {
  const accounts = await knex.table("accounts").whereNotNull("participant_id");
  for (const a of accounts) {
    const surveys = { ...JSON.parse(a.surveys), participants: [a.participant_id] };
    await knex
      .table("accounts")
      .where("id", a.id)
      .update({ surveys: JSON.stringify(surveys) });
  }
  await knex.schema.alterTable("accounts", t => {
    t.dropColumn("participant_id");
  });
};

exports.down = async function (knex) {
  await knex.schema.alterTable("accounts", t => {
    t.string("participant_id");
  });
  const accounts = await knex.table("accounts");
  for (const a of accounts) {
    const { participants, ...surveys } = JSON.parse(a.surveys);
    const participantId = participants?.[0];
    await knex
      .table("accounts")
      .where("id", a.id)
      .update({ participant_id: participantId, surveys: JSON.stringify(surveys) });
  }
};
