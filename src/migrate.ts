import { Migrator, sql } from "kysely";
import db from "./database";

const migrator = new Migrator({
  db,
  provider: {
    async getMigrations() {
      return {
        "0001_embarkation": {
          async up(db) {
            await db.schema
              .createTable("embarkations")
              .ifNotExists()
              .addColumn("id", "bigint", (col) =>
                col.generatedAlwaysAsIdentity().notNull().primaryKey()
              )
              .addColumn("name", "varchar(50)", (col) => col.notNull())
              .addColumn("created_at", "timestamptz", (col) =>
                col.notNull().defaultTo(sql`now()`)
              )
              .addColumn("updated_at", "timestamptz", (col) =>
                col.notNull().defaultTo(sql`now()`)
              )
              .addColumn("deleted_at", "timestamptz", (col) =>
                col.defaultTo(sql`null`)
              )
              .execute();
            await db.schema
              .createIndex("embarkations_name_unique_index")
              .unique()
              .ifNotExists()
              .on("embarkations")
              .column("name")
              .where(sql`deleted_at`, "is", null)
              .execute();
          },
          async down(db) {
            await db.schema
              .dropIndex("embarkations_name_unique_index")
              .ifExists()
              .execute();
            await db.schema.dropTable("embarkations").ifExists().execute();
          },
        },
        "0002_hotel": {
          async up(db) {
            await db.schema
              .createType("hotel_type")
              .asEnum(["Makkah", "Madinah"])
              .execute();
            await db.schema
              .createTable("hotels")
              .ifNotExists()
              .addColumn("id", "bigint", (col) =>
                col.generatedAlwaysAsIdentity().notNull().primaryKey()
              )
              .addColumn("type", sql`hotel_type`, (col) => col.notNull())
              .addColumn("name", "varchar(128)", (col) => col.notNull())
              .addColumn("star", "smallint", (col) =>
                col.notNull().check(sql`star >= 1 AND star <= 5`)
              )
              .addColumn("check_in", "timestamptz", (col) => col.notNull())
              .addColumn("check_out", "timestamptz", (col) => col.notNull())
              .addColumn("description", "varchar(256)", (col) => col.notNull())
              .addColumn("distance_from_kabbah_in_meter", "integer", (col) =>
                col.notNull().check(sql`distance_from_kabbah_in_meter > 0`)
              )
              .addColumn("map_link", "varchar(256)", (col) => col.notNull())
              .addColumn("address", "varchar(256)", (col) => col.notNull())
              .addColumn("food_type", "varchar(50)", (col) => col.notNull())
              .addColumn("food_amount_per_day", "integer", (col) =>
                col.notNull().check(sql`food_amount_per_day > 0`)
              )
              .addColumn("review_link", "varchar(256)", (col) => col.notNull())
              .addColumn("created_at", "timestamptz", (col) =>
                col.notNull().defaultTo(sql`now()`)
              )
              .addColumn("updated_at", "timestamptz", (col) =>
                col.notNull().defaultTo(sql`now()`)
              )
              .addColumn("deleted_at", "timestamptz", (col) =>
                col.defaultTo(sql`null`)
              )
              .execute();
            await db.schema
              .createIndex("hotels_name_unique_index")
              .unique()
              .ifNotExists()
              .on("hotels")
              .column("name")
              .where(sql`deleted_at`, "is", null)
              .execute();
            await db.schema
              .createTable("hotels_facilities")
              .ifNotExists()
              .addColumn("hotel_id", "bigint", (col) =>
                col
                  .notNull()
                  .references("hotels.id")
                  .onUpdate("no action")
                  .onDelete("cascade")
              )
              .addColumn("icon", "varchar(50)", (col) => col.notNull())
              .addColumn("name", "varchar(50)", (col) => col.notNull())
              .execute();
            await db.schema
              .createIndex("hotels_facilities_hotel_id_name_unique_index")
              .unique()
              .ifNotExists()
              .on("hotels_facilities")
              .columns(["hotel_id", "name"])
              .execute();
            await db.schema
              .createTable("hotels_food_menu")
              .ifNotExists()
              .addColumn("hotel_id", "bigint", (col) =>
                col
                  .notNull()
                  .references("hotels.id")
                  .onUpdate("no action")
                  .onDelete("cascade")
              )
              .addColumn("amount", "integer", (col) => col.notNull())
              .addColumn("name", "varchar(50)", (col) => col.notNull())
              .execute();
            await db.schema
              .createIndex("hotels_food_menu_hotel_id_name_unique_index")
              .unique()
              .ifNotExists()
              .on("hotels_food_menu")
              .columns(["hotel_id", "name"])
              .execute();
          },
          async down(db) {
            await db.schema
              .dropIndex("hotels_food_menu_hotel_id_name_unique_index")
              .ifExists()
              .execute();
            await db.schema.dropTable("hotels_food_menu").ifExists().execute();
            await db.schema
              .dropIndex("hotels_name_unique_index")
              .ifExists()
              .execute();
            await db.schema.dropTable("hotels_facilities").ifExists().execute();
            await db.schema.dropTable("hotels_food_menu").ifExists().execute();
            await db.schema.dropTable("hotels").ifExists().execute();
            await db.schema.dropType("hotel_type").ifExists().execute();
          },
        },
        "0003_airline": {
          async up(db) {
            await db.schema
              .createTable("airlines")
              .ifNotExists()
              .addColumn("id", "bigint", (col) =>
                col.generatedAlwaysAsIdentity().notNull().primaryKey()
              )
              .addColumn("name", "varchar(128)", (col) => col.notNull())
              .addColumn("star", "smallint", (col) =>
                col.notNull().check(sql`star >= 1 AND star <= 5`)
              )
              .addColumn("created_at", "timestamptz", (col) =>
                col.notNull().defaultTo(sql`now()`)
              )
              .addColumn("updated_at", "timestamptz", (col) =>
                col.notNull().defaultTo(sql`now()`)
              )
              .addColumn("deleted_at", "timestamptz", (col) =>
                col.defaultTo(sql`null`)
              )
              .execute();
            await db.schema
              .createIndex("airlines_name_unique_index")
              .unique()
              .ifNotExists()
              .on("airlines")
              .column("name")
              .where(sql`deleted_at`, "is", null)
              .execute();
          },
          async down(db) {
            await db.schema
              .dropIndex("airlines_name_unique_index")
              .ifExists()
              .execute();
            await db.schema.dropTable("airlines").ifExists().execute();
          },
        },
        "0004_bus": {
          async up(db) {
            await db.schema
              .createTable("buses")
              .ifNotExists()
              .addColumn("id", "bigint", (col) =>
                col.generatedAlwaysAsIdentity().notNull().primaryKey()
              )
              .addColumn("name", "varchar(50)", (col) => col.notNull())
              .addColumn("created_at", "timestamptz", (col) =>
                col.notNull().defaultTo(sql`now()`)
              )
              .addColumn("updated_at", "timestamptz", (col) =>
                col.notNull().defaultTo(sql`now()`)
              )
              .addColumn("deleted_at", "timestamptz", (col) =>
                col.defaultTo(sql`null`)
              )
              .execute();
            await db.schema
              .createIndex("buses_name_unique_index")
              .unique()
              .ifNotExists()
              .on("buses")
              .column("name")
              .where(sql`deleted_at`, "is", null)
              .execute();
          },
          async down(db) {
            await db.schema
              .dropIndex("buses_name_unique_index")
              .ifExists()
              .execute();
            await db.schema.dropTable("buses").ifExists().execute();
          },
        },
        "0005_room_type": {
          async up(db) {
            await db.schema
              .createTable("room_types")
              .ifNotExists()
              .addColumn("id", "bigint", (col) =>
                col.generatedAlwaysAsIdentity().notNull().primaryKey()
              )
              .addColumn("name", "varchar(50)", (col) => col.notNull())
              .addColumn("created_at", "timestamptz", (col) =>
                col.notNull().defaultTo(sql`now()`)
              )
              .addColumn("updated_at", "timestamptz", (col) =>
                col.notNull().defaultTo(sql`now()`)
              )
              .addColumn("deleted_at", "timestamptz", (col) =>
                col.defaultTo(sql`null`)
              )
              .execute();
            await db.schema
              .createIndex("room_types_name_unique_index")
              .unique()
              .ifNotExists()
              .on("room_types")
              .column("name")
              .where(sql`deleted_at`, "is", null)
              .execute();
          },
          async down(db) {
            await db.schema
              .dropIndex("room_types_name_unique_index")
              .ifExists()
              .execute();
            await db.schema.dropTable("room_types").ifExists().execute();
          },
        },
        "0006_city_tour": {
          async up(db) {
            await db.schema
              .createType("city_tour_city")
              .asEnum(["Makkah", "Madinah"])
              .execute();
            await db.schema
              .createTable("city_tours")
              .ifNotExists()
              .addColumn("id", "bigint", (col) =>
                col.generatedAlwaysAsIdentity().notNull().primaryKey()
              )
              .addColumn("city", sql`city_tour_city`, (col) => col.notNull())
              .addColumn("name", "varchar(50)", (col) => col.notNull())
              .addColumn("description", "varchar(256)", (col) => col.notNull())
              .addColumn("created_at", "timestamptz", (col) =>
                col.notNull().defaultTo(sql`now()`)
              )
              .addColumn("updated_at", "timestamptz", (col) =>
                col.notNull().defaultTo(sql`now()`)
              )
              .addColumn("deleted_at", "timestamptz", (col) =>
                col.defaultTo(sql`null`)
              )
              .execute();
            await db.schema
              .createIndex("city_tours_name_unique_index")
              .unique()
              .ifNotExists()
              .on("city_tours")
              .column("name")
              .where(sql`deleted_at`, "is", null)
              .execute();
          },
          async down(db) {
            await db.schema
              .dropIndex("city_tours_name_unique_index")
              .ifExists()
              .execute();
            await db.schema.dropTable("city_tours").ifExists().execute();
            await db.schema.dropType("city_tour_city").ifExists().execute();
          },
        },
        "0007_muthawif": {
          async up(db) {
            await db.schema
              .createTable("muthawif")
              .ifNotExists()
              .addColumn("id", "bigint", (col) =>
                col.generatedAlwaysAsIdentity().notNull().primaryKey()
              )
              .addColumn("name", "varchar(50)", (col) => col.notNull())
              .addColumn("bio", "varchar(128)", (col) => col.notNull())
              .addColumn("created_at", "timestamptz", (col) =>
                col.notNull().defaultTo(sql`now()`)
              )
              .addColumn("updated_at", "timestamptz", (col) =>
                col.notNull().defaultTo(sql`now()`)
              )
              .addColumn("deleted_at", "timestamptz", (col) =>
                col.defaultTo(sql`null`)
              )
              .execute();
            await db.schema
              .createIndex("muthawif_name_unique_index")
              .unique()
              .ifNotExists()
              .on("muthawif")
              .column("name")
              .where(sql`deleted_at`, "is", null)
              .execute();
          },
          async down(db) {
            await db.schema
              .dropIndex("muthawif_name_unique_index")
              .ifExists()
              .execute();
            await db.schema.dropTable("muthawif").ifExists().execute();
          },
        },
      };
    },
  },
});

const { error, results } = await migrator.migrateToLatest();

results?.forEach((it) => {
  if (it.status === "Success") {
    console.log(`migration "${it.migrationName}" was executed successfully`);
  } else if (it.status === "Error") {
    console.error(`failed to execute migration "${it.migrationName}"`);
  }
});

if (error) {
  console.error("failed to migrate");
  console.error(error);
  process.exit(1);
}

await db.destroy();
