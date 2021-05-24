exports.up = function(knex) {
    return knex.schema.createTable('users', function (table){
      table.increments('user_id');
      table.string('user_email').notNullable();
      table.string('user_password').notNullable();
      table.string('user_name').notNullable();
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('users');
  };
  