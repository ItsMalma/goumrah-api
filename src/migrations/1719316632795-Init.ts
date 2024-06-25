import type { MigrationInterface, QueryRunner } from "typeorm";

export class Init1719316632795 implements MigrationInterface {
	name = "Init1719316632795";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "images" ("id" bigint GENERATED ALWAYS AS IDENTITY NOT NULL, "src" character varying(32) NOT NULL, "alt" character varying(255), CONSTRAINT "image_src_unique" UNIQUE ("src"), CONSTRAINT "PK_1fe148074c6a1a91b63cb9ee3c9" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "reviews" ("id" bigint GENERATED ALWAYS AS IDENTITY NOT NULL, "rating" integer NOT NULL, "bundle_id" bigint, CONSTRAINT "PK_231ae565c273ee700b283f15c1d" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "bundles" ("id" bigint GENERATED ALWAYS AS IDENTITY NOT NULL, "name" character varying(128) NOT NULL, "description" character varying(255) NOT NULL, CONSTRAINT "bundle_name_unique" UNIQUE ("name"), CONSTRAINT "PK_a9118b2e4597aede4d5d4c43433" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "buses" ("id" bigint GENERATED ALWAYS AS IDENTITY NOT NULL, "name" character varying(128) NOT NULL, "help_link" character varying(128) NOT NULL, "thumbnail" bigint, CONSTRAINT "bus_name_unique" UNIQUE ("name"), CONSTRAINT "REL_1782ef82456baa50d4e1dfcee5" UNIQUE ("thumbnail"), CONSTRAINT "PK_ddebc0eeba64a019ae072975947" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "embarkations" ("id" bigint GENERATED ALWAYS AS IDENTITY NOT NULL, "name" character varying(128) NOT NULL, CONSTRAINT "embarkation_name_unique" UNIQUE ("name"), CONSTRAINT "PK_35744c7af5f61612d34dc8fe4de" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "airlines" ("id" bigint GENERATED ALWAYS AS IDENTITY NOT NULL, "rating" integer NOT NULL, "name" character varying(128) NOT NULL, "help_link" character varying(128) NOT NULL, "thumbnail" bigint, CONSTRAINT "airline_name_unique" UNIQUE ("name"), CONSTRAINT "REL_9994098bbd2f4a9d24c41eba05" UNIQUE ("thumbnail"), CONSTRAINT "PK_74f50545f40719d6a763da9da47" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "aircrafts" ("id" bigint GENERATED ALWAYS AS IDENTITY NOT NULL, "name" character varying(128) NOT NULL, CONSTRAINT "aircraft_name_unique" UNIQUE ("name"), CONSTRAINT "PK_7da518226f0426668b00b2eade3" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "transits" ("id" bigint GENERATED ALWAYS AS IDENTITY NOT NULL, "duration" integer NOT NULL, "airport_id" bigint, CONSTRAINT "PK_1f75cb2d9a0c6f80d5183832009" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "airports" ("id" bigint GENERATED ALWAYS AS IDENTITY NOT NULL, "name" character varying(128) NOT NULL, "code" character varying(8) NOT NULL, CONSTRAINT "airport_code_unique" UNIQUE ("code"), CONSTRAINT "airport_name_unique" UNIQUE ("name"), CONSTRAINT "PK_507127316cedb7ec7447d0cb3d7" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "flight_events" ("id" bigint GENERATED ALWAYS AS IDENTITY NOT NULL, "date_time" TIMESTAMP WITH TIME ZONE NOT NULL, "terminal" character varying(128) NOT NULL, "airport_id" bigint, CONSTRAINT "PK_d3d27bf9fe17404f07e239100e7" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "flight_schedules" ("id" bigint GENERATED ALWAYS AS IDENTITY NOT NULL, "duration" integer NOT NULL, "flight_number" character varying(128) NOT NULL, "baggage" integer NOT NULL, "cabin_baggage" integer NOT NULL, "seat_layout" character varying(16) NOT NULL, "take_off_id" bigint, "aircraft_id" bigint, "landing_id" bigint, "transit_id" bigint, "next_id" bigint, CONSTRAINT "REL_78189f79e937910c2856c3b4a1" UNIQUE ("take_off_id"), CONSTRAINT "REL_a00f672d3c075a35a6eafd1064" UNIQUE ("landing_id"), CONSTRAINT "REL_32edda2c18b4910d0aaa4c319e" UNIQUE ("transit_id"), CONSTRAINT "REL_738dcfef0858542550a3d820bb" UNIQUE ("next_id"), CONSTRAINT "PK_7cf69d370385a7553c2bd958783" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "flights" ("id" bigint GENERATED ALWAYS AS IDENTITY NOT NULL, "airline_id" bigint, "outbound_id" bigint, "inbound_id" bigint, CONSTRAINT "REL_3597736b29744414b19925eb39" UNIQUE ("outbound_id"), CONSTRAINT "REL_0cc582a024db05bb9334fff245" UNIQUE ("inbound_id"), CONSTRAINT "PK_c614ef3382fdd70b6d6c2c8d8dd" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "facilities" ("id" bigint GENERATED ALWAYS AS IDENTITY NOT NULL, "icon" character varying(128) NOT NULL, "name" character varying(128) NOT NULL, CONSTRAINT "facility_name_unique" UNIQUE ("name"), CONSTRAINT "PK_2e6c685b2e1195e6d6394a22bc7" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "food_types" ("id" bigint GENERATED ALWAYS AS IDENTITY NOT NULL, "name" character varying(128) NOT NULL, CONSTRAINT "food_type_name_unique" UNIQUE ("name"), CONSTRAINT "PK_c55974f2728db5e98b13b47658a" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "food_menus" ("id" bigint GENERATED ALWAYS AS IDENTITY NOT NULL, "name" character varying(128) NOT NULL, CONSTRAINT "food_menu_name_unique" UNIQUE ("name"), CONSTRAINT "PK_e683eb60a718815c3ab84089b97" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "hotel_foods" ("id" bigint GENERATED ALWAYS AS IDENTITY NOT NULL, "amount" integer NOT NULL, "hotel_id" bigint, "food_menu_id" bigint, CONSTRAINT "hotel_food_hotel_food_menu_unique" UNIQUE ("food_menu_id", "hotel_id"), CONSTRAINT "PK_ef7c96c6170f21588d577039208" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "hotels" ("id" bigint GENERATED ALWAYS AS IDENTITY NOT NULL, "rating" integer NOT NULL, "name" character varying(128) NOT NULL, "help_link" character varying(128) NOT NULL, "description" character varying(255) NOT NULL, "map_link" character varying(255) NOT NULL, "address" character varying(255) NOT NULL, "distance" integer NOT NULL, "review_link" character varying(255) NOT NULL, "thumbnail" bigint, "food_type_id" bigint, CONSTRAINT "hotel_name_unique" UNIQUE ("name"), CONSTRAINT "REL_c1962f4a6b42a27011f6ec49f3" UNIQUE ("thumbnail"), CONSTRAINT "PK_2bb06797684115a1ba7c705fc7b" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "hotel_schedules" ("id" bigint GENERATED ALWAYS AS IDENTITY NOT NULL, "check_in" date NOT NULL, "check_out" date NOT NULL, "hotel_id" bigint, CONSTRAINT "PK_30d407a92a30d8a754981c6e423" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "muthowif" ("id" bigint GENERATED ALWAYS AS IDENTITY NOT NULL, "name" character varying(128) NOT NULL, "bio" character varying(128) NOT NULL, "detail" character varying(255) NOT NULL, "thumbnail" bigint, CONSTRAINT "muthowif_name_unique" UNIQUE ("name"), CONSTRAINT "REL_b0eb042bcdeec9a24109182556" UNIQUE ("thumbnail"), CONSTRAINT "PK_38220efb24befa39bf79e35bfb0" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "room_types" ("id" bigint GENERATED ALWAYS AS IDENTITY NOT NULL, "name" character varying(128) NOT NULL, CONSTRAINT "room_type_name_unique" UNIQUE ("name"), CONSTRAINT "PK_b6e1d0a9b67d4b9fbff9c35ab69" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "bundle_details" ("id" bigint GENERATED ALWAYS AS IDENTITY NOT NULL, "price" numeric NOT NULL, "date" date NOT NULL, "bundle_id" bigint, "embarkation_id" bigint, "room_type_id" bigint, "makkah_hotel_id" bigint, "madinah_hotel_id" bigint, "flight_id" bigint, "bus_id" bigint, CONSTRAINT "bundle_detail_unique" UNIQUE ("date", "embarkation_id", "room_type_id"), CONSTRAINT "PK_e1de83ed20b717df2f44e67da05" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "schedules" ("id" bigint GENERATED ALWAYS AS IDENTITY NOT NULL, "name" character varying(128) NOT NULL, "date" date NOT NULL, "bundle_detail_id" bigint, "next_id" bigint, CONSTRAINT "REL_86149ce48fc1264f3bea74fdea" UNIQUE ("next_id"), CONSTRAINT "PK_7e33fc2ea755a5765e3564e66dd" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "agendas" ("id" bigint GENERATED ALWAYS AS IDENTITY NOT NULL, "date_time" TIMESTAMP WITH TIME ZONE NOT NULL, "description" character varying(255) NOT NULL, "schedule_id" bigint, "next_id" bigint, CONSTRAINT "REL_9fbcd98ff25405473f047c6e12" UNIQUE ("next_id"), CONSTRAINT "PK_5fea8668c8712b8292ded824549" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "bundle_images" ("bundle_id" bigint NOT NULL, "image_id" bigint NOT NULL, CONSTRAINT "PK_0dedf776e4e02d02cf651cad50b" PRIMARY KEY ("bundle_id", "image_id"))`,
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_5178aa79b975ba0b46bc16270c" ON "bundle_images" ("bundle_id") `,
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_1fd9fd0984ebbb4dade1bac0d7" ON "bundle_images" ("image_id") `,
		);
		await queryRunner.query(
			`CREATE TABLE "airline_images" ("airline_id" bigint NOT NULL, "image_id" bigint NOT NULL, CONSTRAINT "PK_f46f423261bf3c99e87a64fe978" PRIMARY KEY ("airline_id", "image_id"))`,
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_8dcebe521061aacd1a51d1f233" ON "airline_images" ("airline_id") `,
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_0c7753e663bd8f5253126aba24" ON "airline_images" ("image_id") `,
		);
		await queryRunner.query(
			`CREATE TABLE "hotel_images" ("hotel_id" bigint NOT NULL, "image_id" bigint NOT NULL, CONSTRAINT "PK_9937d205a81de30595bd915d059" PRIMARY KEY ("hotel_id", "image_id"))`,
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_65dd867699502f1b83455c128c" ON "hotel_images" ("hotel_id") `,
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_3c9ff5bd8fb9adf4a9ba475585" ON "hotel_images" ("image_id") `,
		);
		await queryRunner.query(
			`CREATE TABLE "hotel_facilities" ("hotel_id" bigint NOT NULL, "facility_id" bigint NOT NULL, CONSTRAINT "PK_dd292b69feea002b6a7c5dc333d" PRIMARY KEY ("hotel_id", "facility_id"))`,
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_99463b02616df9b35b13b2939f" ON "hotel_facilities" ("hotel_id") `,
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_52037a506ca7084939b4dc59b9" ON "hotel_facilities" ("facility_id") `,
		);
		await queryRunner.query(
			`CREATE TABLE "bundle_detail_muthowif" ("bundle_detail_id" bigint NOT NULL, "muthowif_id" bigint NOT NULL, CONSTRAINT "PK_c9631934432fca663ca129fecba" PRIMARY KEY ("bundle_detail_id", "muthowif_id"))`,
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_d166309af02e48195ad422e5b9" ON "bundle_detail_muthowif" ("bundle_detail_id") `,
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_515a80eb6d71570b1afefc18fc" ON "bundle_detail_muthowif" ("muthowif_id") `,
		);
		await queryRunner.query(
			`ALTER TABLE "reviews" ADD CONSTRAINT "review_bundle_foreign" FOREIGN KEY ("bundle_id") REFERENCES "bundles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "buses" ADD CONSTRAINT "bus_thumbnail_foreign" FOREIGN KEY ("thumbnail") REFERENCES "images"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "airlines" ADD CONSTRAINT "airline_thumbnail_foreign" FOREIGN KEY ("thumbnail") REFERENCES "images"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "transits" ADD CONSTRAINT "transit_airport_foreign" FOREIGN KEY ("airport_id") REFERENCES "airports"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "flight_events" ADD CONSTRAINT "flight_events_airport_foreign" FOREIGN KEY ("airport_id") REFERENCES "airports"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "flight_schedules" ADD CONSTRAINT "flight_schedule_take_off_foreign" FOREIGN KEY ("take_off_id") REFERENCES "flight_events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "flight_schedules" ADD CONSTRAINT "flight_schedule_aircraft_foreign" FOREIGN KEY ("aircraft_id") REFERENCES "aircrafts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "flight_schedules" ADD CONSTRAINT "flight_schedule_landing_foreign" FOREIGN KEY ("landing_id") REFERENCES "flight_events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "flight_schedules" ADD CONSTRAINT "flight_schedule_transit_foreign" FOREIGN KEY ("transit_id") REFERENCES "transits"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "flight_schedules" ADD CONSTRAINT "flight_schedule_next_foreign" FOREIGN KEY ("next_id") REFERENCES "flight_schedules"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "flights" ADD CONSTRAINT "flight_airline_foreign" FOREIGN KEY ("airline_id") REFERENCES "airlines"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "flights" ADD CONSTRAINT "flight_outbound_foreign" FOREIGN KEY ("outbound_id") REFERENCES "flight_schedules"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "flights" ADD CONSTRAINT "flight_inbound_foreign" FOREIGN KEY ("inbound_id") REFERENCES "flight_schedules"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "hotel_foods" ADD CONSTRAINT "hotel_food_hotel_foreign" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "hotel_foods" ADD CONSTRAINT "hotel_food_food_menu_foreign" FOREIGN KEY ("food_menu_id") REFERENCES "food_menus"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "hotels" ADD CONSTRAINT "hotel_thumbnail_foreign" FOREIGN KEY ("thumbnail") REFERENCES "images"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "hotels" ADD CONSTRAINT "hotel_food_type_foreign" FOREIGN KEY ("food_type_id") REFERENCES "food_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "hotel_schedules" ADD CONSTRAINT "hotel_schedule_hotel_foreign" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "muthowif" ADD CONSTRAINT "muthowif_thumbnail_foreign" FOREIGN KEY ("thumbnail") REFERENCES "images"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "bundle_details" ADD CONSTRAINT "bundle_detail_bundle_foreign" FOREIGN KEY ("bundle_id") REFERENCES "bundles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "bundle_details" ADD CONSTRAINT "bundle_detail_embarkation_foreign" FOREIGN KEY ("embarkation_id") REFERENCES "embarkations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "bundle_details" ADD CONSTRAINT "bundle_detail_room_type_foreign" FOREIGN KEY ("room_type_id") REFERENCES "room_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "bundle_details" ADD CONSTRAINT "bundle_detail_makkah_hotel_foreign" FOREIGN KEY ("makkah_hotel_id") REFERENCES "hotel_schedules"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "bundle_details" ADD CONSTRAINT "bundle_detail_madinah_hotel_foreign" FOREIGN KEY ("madinah_hotel_id") REFERENCES "hotel_schedules"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "bundle_details" ADD CONSTRAINT "bundle_detail_flight_foreign" FOREIGN KEY ("flight_id") REFERENCES "flights"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "bundle_details" ADD CONSTRAINT "bundle_detail_bus_foreign" FOREIGN KEY ("bus_id") REFERENCES "buses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "schedules" ADD CONSTRAINT "schedule_bundle_detail_foreign" FOREIGN KEY ("bundle_detail_id") REFERENCES "bundle_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "schedules" ADD CONSTRAINT "schedule_next_foreign" FOREIGN KEY ("next_id") REFERENCES "schedules"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "agendas" ADD CONSTRAINT "agenda_schedule_foreign" FOREIGN KEY ("schedule_id") REFERENCES "schedules"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "agendas" ADD CONSTRAINT "agenda_next_foreign" FOREIGN KEY ("next_id") REFERENCES "agendas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "bundle_images" ADD CONSTRAINT "bundle_images_bundle_foreign" FOREIGN KEY ("bundle_id") REFERENCES "bundles"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		);
		await queryRunner.query(
			`ALTER TABLE "bundle_images" ADD CONSTRAINT "bundle_images_image_foreign" FOREIGN KEY ("image_id") REFERENCES "images"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		);
		await queryRunner.query(
			`ALTER TABLE "airline_images" ADD CONSTRAINT "airline_images_airline_foreign" FOREIGN KEY ("airline_id") REFERENCES "airlines"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		);
		await queryRunner.query(
			`ALTER TABLE "airline_images" ADD CONSTRAINT "airline_images_image_foreign" FOREIGN KEY ("image_id") REFERENCES "images"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		);
		await queryRunner.query(
			`ALTER TABLE "hotel_images" ADD CONSTRAINT "hotel_images_hotel_foreign" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		);
		await queryRunner.query(
			`ALTER TABLE "hotel_images" ADD CONSTRAINT "hotel_images_image_foreign" FOREIGN KEY ("image_id") REFERENCES "images"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		);
		await queryRunner.query(
			`ALTER TABLE "hotel_facilities" ADD CONSTRAINT "hotel_facilities_hotel_foreign" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		);
		await queryRunner.query(
			`ALTER TABLE "hotel_facilities" ADD CONSTRAINT "hotel_facilities_facility_foreign" FOREIGN KEY ("facility_id") REFERENCES "facilities"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		);
		await queryRunner.query(
			`ALTER TABLE "bundle_detail_muthowif" ADD CONSTRAINT "bundle_detail_muthowif_bundle_detail_foreign" FOREIGN KEY ("bundle_detail_id") REFERENCES "bundle_details"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		);
		await queryRunner.query(
			`ALTER TABLE "bundle_detail_muthowif" ADD CONSTRAINT "bundle_detail_muthowif_muthowif_foreign" FOREIGN KEY ("muthowif_id") REFERENCES "muthowif"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "bundle_detail_muthowif" DROP CONSTRAINT "bundle_detail_muthowif_muthowif_foreign"`,
		);
		await queryRunner.query(
			`ALTER TABLE "bundle_detail_muthowif" DROP CONSTRAINT "bundle_detail_muthowif_bundle_detail_foreign"`,
		);
		await queryRunner.query(
			`ALTER TABLE "hotel_facilities" DROP CONSTRAINT "hotel_facilities_facility_foreign"`,
		);
		await queryRunner.query(
			`ALTER TABLE "hotel_facilities" DROP CONSTRAINT "hotel_facilities_hotel_foreign"`,
		);
		await queryRunner.query(
			`ALTER TABLE "hotel_images" DROP CONSTRAINT "hotel_images_image_foreign"`,
		);
		await queryRunner.query(
			`ALTER TABLE "hotel_images" DROP CONSTRAINT "hotel_images_hotel_foreign"`,
		);
		await queryRunner.query(
			`ALTER TABLE "airline_images" DROP CONSTRAINT "airline_images_image_foreign"`,
		);
		await queryRunner.query(
			`ALTER TABLE "airline_images" DROP CONSTRAINT "airline_images_airline_foreign"`,
		);
		await queryRunner.query(
			`ALTER TABLE "bundle_images" DROP CONSTRAINT "bundle_images_image_foreign"`,
		);
		await queryRunner.query(
			`ALTER TABLE "bundle_images" DROP CONSTRAINT "bundle_images_bundle_foreign"`,
		);
		await queryRunner.query(
			`ALTER TABLE "agendas" DROP CONSTRAINT "agenda_next_foreign"`,
		);
		await queryRunner.query(
			`ALTER TABLE "agendas" DROP CONSTRAINT "agenda_schedule_foreign"`,
		);
		await queryRunner.query(
			`ALTER TABLE "schedules" DROP CONSTRAINT "schedule_next_foreign"`,
		);
		await queryRunner.query(
			`ALTER TABLE "schedules" DROP CONSTRAINT "schedule_bundle_detail_foreign"`,
		);
		await queryRunner.query(
			`ALTER TABLE "bundle_details" DROP CONSTRAINT "bundle_detail_bus_foreign"`,
		);
		await queryRunner.query(
			`ALTER TABLE "bundle_details" DROP CONSTRAINT "bundle_detail_flight_foreign"`,
		);
		await queryRunner.query(
			`ALTER TABLE "bundle_details" DROP CONSTRAINT "bundle_detail_madinah_hotel_foreign"`,
		);
		await queryRunner.query(
			`ALTER TABLE "bundle_details" DROP CONSTRAINT "bundle_detail_makkah_hotel_foreign"`,
		);
		await queryRunner.query(
			`ALTER TABLE "bundle_details" DROP CONSTRAINT "bundle_detail_room_type_foreign"`,
		);
		await queryRunner.query(
			`ALTER TABLE "bundle_details" DROP CONSTRAINT "bundle_detail_embarkation_foreign"`,
		);
		await queryRunner.query(
			`ALTER TABLE "bundle_details" DROP CONSTRAINT "bundle_detail_bundle_foreign"`,
		);
		await queryRunner.query(
			`ALTER TABLE "muthowif" DROP CONSTRAINT "muthowif_thumbnail_foreign"`,
		);
		await queryRunner.query(
			`ALTER TABLE "hotel_schedules" DROP CONSTRAINT "hotel_schedule_hotel_foreign"`,
		);
		await queryRunner.query(
			`ALTER TABLE "hotels" DROP CONSTRAINT "hotel_food_type_foreign"`,
		);
		await queryRunner.query(
			`ALTER TABLE "hotels" DROP CONSTRAINT "hotel_thumbnail_foreign"`,
		);
		await queryRunner.query(
			`ALTER TABLE "hotel_foods" DROP CONSTRAINT "hotel_food_food_menu_foreign"`,
		);
		await queryRunner.query(
			`ALTER TABLE "hotel_foods" DROP CONSTRAINT "hotel_food_hotel_foreign"`,
		);
		await queryRunner.query(
			`ALTER TABLE "flights" DROP CONSTRAINT "flight_inbound_foreign"`,
		);
		await queryRunner.query(
			`ALTER TABLE "flights" DROP CONSTRAINT "flight_outbound_foreign"`,
		);
		await queryRunner.query(
			`ALTER TABLE "flights" DROP CONSTRAINT "flight_airline_foreign"`,
		);
		await queryRunner.query(
			`ALTER TABLE "flight_schedules" DROP CONSTRAINT "flight_schedule_next_foreign"`,
		);
		await queryRunner.query(
			`ALTER TABLE "flight_schedules" DROP CONSTRAINT "flight_schedule_transit_foreign"`,
		);
		await queryRunner.query(
			`ALTER TABLE "flight_schedules" DROP CONSTRAINT "flight_schedule_landing_foreign"`,
		);
		await queryRunner.query(
			`ALTER TABLE "flight_schedules" DROP CONSTRAINT "flight_schedule_aircraft_foreign"`,
		);
		await queryRunner.query(
			`ALTER TABLE "flight_schedules" DROP CONSTRAINT "flight_schedule_take_off_foreign"`,
		);
		await queryRunner.query(
			`ALTER TABLE "flight_events" DROP CONSTRAINT "flight_events_airport_foreign"`,
		);
		await queryRunner.query(
			`ALTER TABLE "transits" DROP CONSTRAINT "transit_airport_foreign"`,
		);
		await queryRunner.query(
			`ALTER TABLE "airlines" DROP CONSTRAINT "airline_thumbnail_foreign"`,
		);
		await queryRunner.query(
			`ALTER TABLE "buses" DROP CONSTRAINT "bus_thumbnail_foreign"`,
		);
		await queryRunner.query(
			`ALTER TABLE "reviews" DROP CONSTRAINT "review_bundle_foreign"`,
		);
		await queryRunner.query(
			`DROP INDEX "public"."IDX_515a80eb6d71570b1afefc18fc"`,
		);
		await queryRunner.query(
			`DROP INDEX "public"."IDX_d166309af02e48195ad422e5b9"`,
		);
		await queryRunner.query(`DROP TABLE "bundle_detail_muthowif"`);
		await queryRunner.query(
			`DROP INDEX "public"."IDX_52037a506ca7084939b4dc59b9"`,
		);
		await queryRunner.query(
			`DROP INDEX "public"."IDX_99463b02616df9b35b13b2939f"`,
		);
		await queryRunner.query(`DROP TABLE "hotel_facilities"`);
		await queryRunner.query(
			`DROP INDEX "public"."IDX_3c9ff5bd8fb9adf4a9ba475585"`,
		);
		await queryRunner.query(
			`DROP INDEX "public"."IDX_65dd867699502f1b83455c128c"`,
		);
		await queryRunner.query(`DROP TABLE "hotel_images"`);
		await queryRunner.query(
			`DROP INDEX "public"."IDX_0c7753e663bd8f5253126aba24"`,
		);
		await queryRunner.query(
			`DROP INDEX "public"."IDX_8dcebe521061aacd1a51d1f233"`,
		);
		await queryRunner.query(`DROP TABLE "airline_images"`);
		await queryRunner.query(
			`DROP INDEX "public"."IDX_1fd9fd0984ebbb4dade1bac0d7"`,
		);
		await queryRunner.query(
			`DROP INDEX "public"."IDX_5178aa79b975ba0b46bc16270c"`,
		);
		await queryRunner.query(`DROP TABLE "bundle_images"`);
		await queryRunner.query(`DROP TABLE "agendas"`);
		await queryRunner.query(`DROP TABLE "schedules"`);
		await queryRunner.query(`DROP TABLE "bundle_details"`);
		await queryRunner.query(`DROP TABLE "room_types"`);
		await queryRunner.query(`DROP TABLE "muthowif"`);
		await queryRunner.query(`DROP TABLE "hotel_schedules"`);
		await queryRunner.query(`DROP TABLE "hotels"`);
		await queryRunner.query(`DROP TABLE "hotel_foods"`);
		await queryRunner.query(`DROP TABLE "food_menus"`);
		await queryRunner.query(`DROP TABLE "food_types"`);
		await queryRunner.query(`DROP TABLE "facilities"`);
		await queryRunner.query(`DROP TABLE "flights"`);
		await queryRunner.query(`DROP TABLE "flight_schedules"`);
		await queryRunner.query(`DROP TABLE "flight_events"`);
		await queryRunner.query(`DROP TABLE "airports"`);
		await queryRunner.query(`DROP TABLE "transits"`);
		await queryRunner.query(`DROP TABLE "aircrafts"`);
		await queryRunner.query(`DROP TABLE "airlines"`);
		await queryRunner.query(`DROP TABLE "embarkations"`);
		await queryRunner.query(`DROP TABLE "buses"`);
		await queryRunner.query(`DROP TABLE "bundles"`);
		await queryRunner.query(`DROP TABLE "reviews"`);
		await queryRunner.query(`DROP TABLE "images"`);
	}
}
