exports.up = function(knex) {
    return knex.schema.createTable('events', function (table){
      table.increments('event_id');
      table.string('event_description').notNullable();
      table.string('event_startHour').notNullable();
      table.string('event_endHour').notNullable();
      table.date('event_date').notNullable();

      table.integer('user_id').unsigned().notNullable();
      table.foreign('user_id').references('user_id').inTable('users');
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('events');
  };
  