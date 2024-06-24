-- DropForeignKey
ALTER TABLE "agendas" DROP CONSTRAINT "agendas_next_id_fkey";

-- DropForeignKey
ALTER TABLE "agendas" DROP CONSTRAINT "agendas_schedule_id_fkey";

-- DropForeignKey
ALTER TABLE "airline_certificates" DROP CONSTRAINT "airline_certificates_image_id_fkey";

-- DropForeignKey
ALTER TABLE "airlines" DROP CONSTRAINT "airlines_thumbnail_id_fkey";

-- DropForeignKey
ALTER TABLE "bundle_details" DROP CONSTRAINT "bundle_details_bundle_id_fkey";

-- DropForeignKey
ALTER TABLE "bundle_details" DROP CONSTRAINT "bundle_details_bus_id_fkey";

-- DropForeignKey
ALTER TABLE "bundle_details" DROP CONSTRAINT "bundle_details_embarkation_id_fkey";

-- DropForeignKey
ALTER TABLE "bundle_details" DROP CONSTRAINT "bundle_details_flight_id_fkey";

-- DropForeignKey
ALTER TABLE "bundle_details" DROP CONSTRAINT "bundle_details_madinah_hotel_id_fkey";

-- DropForeignKey
ALTER TABLE "bundle_details" DROP CONSTRAINT "bundle_details_makkah_hotel_id_fkey";

-- DropForeignKey
ALTER TABLE "bundle_details" DROP CONSTRAINT "bundle_details_room_type_id_fkey";

-- DropForeignKey
ALTER TABLE "buses" DROP CONSTRAINT "buses_thumbnail_id_fkey";

-- DropForeignKey
ALTER TABLE "flight_events" DROP CONSTRAINT "flight_events_airport_id_fkey";

-- DropForeignKey
ALTER TABLE "flight_schedules" DROP CONSTRAINT "flight_schedules_landing_id_fkey";

-- DropForeignKey
ALTER TABLE "flight_schedules" DROP CONSTRAINT "flight_schedules_next_id_fkey";

-- DropForeignKey
ALTER TABLE "flight_schedules" DROP CONSTRAINT "flight_schedules_take_off_id_fkey";

-- DropForeignKey
ALTER TABLE "flight_schedules" DROP CONSTRAINT "flight_schedules_transit_id_fkey";

-- DropForeignKey
ALTER TABLE "flights" DROP CONSTRAINT "flights_airline_id_fkey";

-- DropForeignKey
ALTER TABLE "flights" DROP CONSTRAINT "flights_inbound_id_fkey";

-- DropForeignKey
ALTER TABLE "flights" DROP CONSTRAINT "flights_outbound_id_fkey";

-- DropForeignKey
ALTER TABLE "food_menu_hotels" DROP CONSTRAINT "food_menu_hotels_food_menu_id_fkey";

-- DropForeignKey
ALTER TABLE "food_menu_hotels" DROP CONSTRAINT "food_menu_hotels_hotel_id_fkey";

-- DropForeignKey
ALTER TABLE "hotel_schedules" DROP CONSTRAINT "hotel_schedules_hotel_id_fkey";

-- DropForeignKey
ALTER TABLE "hotels" DROP CONSTRAINT "hotels_food_type_id_fkey";

-- DropForeignKey
ALTER TABLE "hotels" DROP CONSTRAINT "hotels_thumbnail_id_fkey";

-- DropForeignKey
ALTER TABLE "muthowif" DROP CONSTRAINT "muthowif_thumbnail_id_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_bundle_id_fkey";

-- DropForeignKey
ALTER TABLE "schedules" DROP CONSTRAINT "schedules_bundle_detail_id_fkey";

-- DropForeignKey
ALTER TABLE "transits" DROP CONSTRAINT "transits_airport_id_fkey";

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_bundle_id_fkey" FOREIGN KEY ("bundle_id") REFERENCES "bundles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "food_menu_hotels" ADD CONSTRAINT "food_menu_hotels_food_menu_id_fkey" FOREIGN KEY ("food_menu_id") REFERENCES "food_menus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "food_menu_hotels" ADD CONSTRAINT "food_menu_hotels_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotels" ADD CONSTRAINT "hotels_thumbnail_id_fkey" FOREIGN KEY ("thumbnail_id") REFERENCES "images"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotels" ADD CONSTRAINT "hotels_food_type_id_fkey" FOREIGN KEY ("food_type_id") REFERENCES "food_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotel_schedules" ADD CONSTRAINT "hotel_schedules_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "airline_certificates" ADD CONSTRAINT "airline_certificates_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "images"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "airlines" ADD CONSTRAINT "airlines_thumbnail_id_fkey" FOREIGN KEY ("thumbnail_id") REFERENCES "images"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flight_events" ADD CONSTRAINT "flight_events_airport_id_fkey" FOREIGN KEY ("airport_id") REFERENCES "airports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transits" ADD CONSTRAINT "transits_airport_id_fkey" FOREIGN KEY ("airport_id") REFERENCES "airports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flight_schedules" ADD CONSTRAINT "flight_schedules_take_off_id_fkey" FOREIGN KEY ("take_off_id") REFERENCES "flight_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flight_schedules" ADD CONSTRAINT "flight_schedules_landing_id_fkey" FOREIGN KEY ("landing_id") REFERENCES "flight_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flight_schedules" ADD CONSTRAINT "flight_schedules_transit_id_fkey" FOREIGN KEY ("transit_id") REFERENCES "transits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flight_schedules" ADD CONSTRAINT "flight_schedules_next_id_fkey" FOREIGN KEY ("next_id") REFERENCES "flight_schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flights" ADD CONSTRAINT "flights_airline_id_fkey" FOREIGN KEY ("airline_id") REFERENCES "airlines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flights" ADD CONSTRAINT "flights_outbound_id_fkey" FOREIGN KEY ("outbound_id") REFERENCES "flight_schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flights" ADD CONSTRAINT "flights_inbound_id_fkey" FOREIGN KEY ("inbound_id") REFERENCES "flight_schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buses" ADD CONSTRAINT "buses_thumbnail_id_fkey" FOREIGN KEY ("thumbnail_id") REFERENCES "images"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendas" ADD CONSTRAINT "agendas_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendas" ADD CONSTRAINT "agendas_next_id_fkey" FOREIGN KEY ("next_id") REFERENCES "agendas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_bundle_detail_id_fkey" FOREIGN KEY ("bundle_detail_id") REFERENCES "bundle_details"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "muthowif" ADD CONSTRAINT "muthowif_thumbnail_id_fkey" FOREIGN KEY ("thumbnail_id") REFERENCES "images"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bundle_details" ADD CONSTRAINT "bundle_details_bundle_id_fkey" FOREIGN KEY ("bundle_id") REFERENCES "bundles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bundle_details" ADD CONSTRAINT "bundle_details_embarkation_id_fkey" FOREIGN KEY ("embarkation_id") REFERENCES "embarkations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bundle_details" ADD CONSTRAINT "bundle_details_room_type_id_fkey" FOREIGN KEY ("room_type_id") REFERENCES "room_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bundle_details" ADD CONSTRAINT "bundle_details_makkah_hotel_id_fkey" FOREIGN KEY ("makkah_hotel_id") REFERENCES "hotel_schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bundle_details" ADD CONSTRAINT "bundle_details_madinah_hotel_id_fkey" FOREIGN KEY ("madinah_hotel_id") REFERENCES "hotel_schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bundle_details" ADD CONSTRAINT "bundle_details_flight_id_fkey" FOREIGN KEY ("flight_id") REFERENCES "flights"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bundle_details" ADD CONSTRAINT "bundle_details_bus_id_fkey" FOREIGN KEY ("bus_id") REFERENCES "buses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
