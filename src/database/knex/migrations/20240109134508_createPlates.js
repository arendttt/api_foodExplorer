exports.up = knex => knex.schema.createTable("plates", table => {
  table.increments("id");
  table.text("title").notNullable();
  table.text("description");
  table.integer("price").notNullable();
  table.text("image");

  table.enum("category", ["meal", "appetizers", "deserts"], { useNative: true, enumName: "category"}).notNullable().default("meal");

  table.timestamp("created_at").default(knex.fn.now());
  table.timestamp("updated_at").default(knex.fn.now());

});


exports.down = knex => knex.schema.dropTable("plates");