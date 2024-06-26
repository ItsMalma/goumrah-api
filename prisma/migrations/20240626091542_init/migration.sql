-- CreateTable
CREATE TABLE "images" (
    "id" SERIAL NOT NULL,
    "src" TEXT NOT NULL,
    "alt" TEXT,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" SERIAL NOT NULL,
    "bundle_id" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "embarkations" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "embarkations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room_types" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "room_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facilities" (
    "id" SERIAL NOT NULL,
    "icon" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "facilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "food_types" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "food_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "food_menus" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "food_menus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hotel_menus" (
    "id" SERIAL NOT NULL,
    "amount" INTEGER NOT NULL,
    "food_menu_id" INTEGER NOT NULL,
    "hotel_id" INTEGER NOT NULL,

    CONSTRAINT "hotel_menus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hotels" (
    "id" SERIAL NOT NULL,
    "thumbnail_id" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "helpLink" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "mapLink" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "distance" INTEGER NOT NULL,
    "food_type_id" INTEGER NOT NULL,
    "reviewLink" TEXT NOT NULL,

    CONSTRAINT "hotels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hotel_schedules" (
    "id" SERIAL NOT NULL,
    "hotel_id" INTEGER NOT NULL,
    "checkIn" TIMESTAMP(3) NOT NULL,
    "checkOut" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hotel_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "airlines" (
    "id" SERIAL NOT NULL,
    "thumbnail_id" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "helpLink" TEXT NOT NULL,

    CONSTRAINT "airlines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "airports" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "airports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flight_events" (
    "id" SERIAL NOT NULL,
    "dateTime" TIMESTAMP(3) NOT NULL,
    "airport_id" INTEGER NOT NULL,
    "terminal" TEXT NOT NULL,

    CONSTRAINT "flight_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transits" (
    "id" SERIAL NOT NULL,
    "duration" INTEGER NOT NULL,
    "airport_id" INTEGER,

    CONSTRAINT "transits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flight_schedules" (
    "id" SERIAL NOT NULL,
    "take_off_id" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "flightNumber" TEXT NOT NULL,
    "aircraftType" TEXT NOT NULL,
    "baggage" INTEGER NOT NULL,
    "cabinBaggage" INTEGER NOT NULL,
    "seatLayout" TEXT NOT NULL,
    "landing_id" INTEGER NOT NULL,
    "transit_id" INTEGER,
    "next_id" INTEGER,

    CONSTRAINT "flight_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flights" (
    "id" SERIAL NOT NULL,
    "airline_id" INTEGER NOT NULL,
    "outbound_id" INTEGER NOT NULL,
    "inbound_id" INTEGER NOT NULL,

    CONSTRAINT "flights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "buses" (
    "id" SERIAL NOT NULL,
    "thumbnail_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "helpLink" TEXT NOT NULL,

    CONSTRAINT "buses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agendas" (
    "id" SERIAL NOT NULL,
    "schedule_id" INTEGER NOT NULL,
    "datetime" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "next_id" INTEGER,

    CONSTRAINT "agendas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedules" (
    "id" SERIAL NOT NULL,
    "bundle_detail_id" INTEGER NOT NULL,
    "day" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "muthowif" (
    "id" SERIAL NOT NULL,
    "thumbnail_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "detail" TEXT NOT NULL,

    CONSTRAINT "muthowif_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bundles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "bundles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bundle_details" (
    "id" SERIAL NOT NULL,
    "bundle_id" INTEGER NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "embarkation_id" INTEGER NOT NULL,
    "room_type_id" INTEGER NOT NULL,
    "makkah_hotel_id" INTEGER NOT NULL,
    "madinah_hotel_id" INTEGER NOT NULL,
    "flight_id" INTEGER NOT NULL,
    "bus_id" INTEGER NOT NULL,

    CONSTRAINT "bundle_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FacilityToHotel" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_HotelToImage" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_AirlineToImage" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_BundleToImage" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_BundleDetailToMuthowif" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "images_src_key" ON "images"("src");

-- CreateIndex
CREATE UNIQUE INDEX "embarkations_name_key" ON "embarkations"("name");

-- CreateIndex
CREATE UNIQUE INDEX "room_types_name_key" ON "room_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "facilities_name_key" ON "facilities"("name");

-- CreateIndex
CREATE UNIQUE INDEX "food_types_name_key" ON "food_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "food_menus_name_key" ON "food_menus"("name");

-- CreateIndex
CREATE UNIQUE INDEX "hotel_menus_food_menu_id_hotel_id_key" ON "hotel_menus"("food_menu_id", "hotel_id");

-- CreateIndex
CREATE UNIQUE INDEX "hotels_name_key" ON "hotels"("name");

-- CreateIndex
CREATE UNIQUE INDEX "airlines_name_key" ON "airlines"("name");

-- CreateIndex
CREATE UNIQUE INDEX "airports_name_key" ON "airports"("name");

-- CreateIndex
CREATE UNIQUE INDEX "airports_code_key" ON "airports"("code");

-- CreateIndex
CREATE UNIQUE INDEX "flight_schedules_take_off_id_key" ON "flight_schedules"("take_off_id");

-- CreateIndex
CREATE UNIQUE INDEX "flight_schedules_landing_id_key" ON "flight_schedules"("landing_id");

-- CreateIndex
CREATE UNIQUE INDEX "flight_schedules_transit_id_key" ON "flight_schedules"("transit_id");

-- CreateIndex
CREATE UNIQUE INDEX "flight_schedules_next_id_key" ON "flight_schedules"("next_id");

-- CreateIndex
CREATE UNIQUE INDEX "flights_outbound_id_key" ON "flights"("outbound_id");

-- CreateIndex
CREATE UNIQUE INDEX "flights_inbound_id_key" ON "flights"("inbound_id");

-- CreateIndex
CREATE UNIQUE INDEX "buses_name_key" ON "buses"("name");

-- CreateIndex
CREATE UNIQUE INDEX "agendas_next_id_key" ON "agendas"("next_id");

-- CreateIndex
CREATE UNIQUE INDEX "schedules_day_bundle_detail_id_key" ON "schedules"("day", "bundle_detail_id");

-- CreateIndex
CREATE UNIQUE INDEX "muthowif_name_key" ON "muthowif"("name");

-- CreateIndex
CREATE UNIQUE INDEX "bundles_name_key" ON "bundles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "bundle_details_makkah_hotel_id_key" ON "bundle_details"("makkah_hotel_id");

-- CreateIndex
CREATE UNIQUE INDEX "bundle_details_madinah_hotel_id_key" ON "bundle_details"("madinah_hotel_id");

-- CreateIndex
CREATE UNIQUE INDEX "bundle_details_date_embarkation_id_room_type_id_key" ON "bundle_details"("date", "embarkation_id", "room_type_id");

-- CreateIndex
CREATE UNIQUE INDEX "_FacilityToHotel_AB_unique" ON "_FacilityToHotel"("A", "B");

-- CreateIndex
CREATE INDEX "_FacilityToHotel_B_index" ON "_FacilityToHotel"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_HotelToImage_AB_unique" ON "_HotelToImage"("A", "B");

-- CreateIndex
CREATE INDEX "_HotelToImage_B_index" ON "_HotelToImage"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AirlineToImage_AB_unique" ON "_AirlineToImage"("A", "B");

-- CreateIndex
CREATE INDEX "_AirlineToImage_B_index" ON "_AirlineToImage"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BundleToImage_AB_unique" ON "_BundleToImage"("A", "B");

-- CreateIndex
CREATE INDEX "_BundleToImage_B_index" ON "_BundleToImage"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BundleDetailToMuthowif_AB_unique" ON "_BundleDetailToMuthowif"("A", "B");

-- CreateIndex
CREATE INDEX "_BundleDetailToMuthowif_B_index" ON "_BundleDetailToMuthowif"("B");

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_bundle_id_fkey" FOREIGN KEY ("bundle_id") REFERENCES "bundles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotel_menus" ADD CONSTRAINT "hotel_menus_food_menu_id_fkey" FOREIGN KEY ("food_menu_id") REFERENCES "food_menus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotel_menus" ADD CONSTRAINT "hotel_menus_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotels" ADD CONSTRAINT "hotels_thumbnail_id_fkey" FOREIGN KEY ("thumbnail_id") REFERENCES "images"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotels" ADD CONSTRAINT "hotels_food_type_id_fkey" FOREIGN KEY ("food_type_id") REFERENCES "food_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotel_schedules" ADD CONSTRAINT "hotel_schedules_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE "_FacilityToHotel" ADD CONSTRAINT "_FacilityToHotel_A_fkey" FOREIGN KEY ("A") REFERENCES "facilities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FacilityToHotel" ADD CONSTRAINT "_FacilityToHotel_B_fkey" FOREIGN KEY ("B") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HotelToImage" ADD CONSTRAINT "_HotelToImage_A_fkey" FOREIGN KEY ("A") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HotelToImage" ADD CONSTRAINT "_HotelToImage_B_fkey" FOREIGN KEY ("B") REFERENCES "images"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AirlineToImage" ADD CONSTRAINT "_AirlineToImage_A_fkey" FOREIGN KEY ("A") REFERENCES "airlines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AirlineToImage" ADD CONSTRAINT "_AirlineToImage_B_fkey" FOREIGN KEY ("B") REFERENCES "images"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BundleToImage" ADD CONSTRAINT "_BundleToImage_A_fkey" FOREIGN KEY ("A") REFERENCES "bundles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BundleToImage" ADD CONSTRAINT "_BundleToImage_B_fkey" FOREIGN KEY ("B") REFERENCES "images"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BundleDetailToMuthowif" ADD CONSTRAINT "_BundleDetailToMuthowif_A_fkey" FOREIGN KEY ("A") REFERENCES "bundle_details"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BundleDetailToMuthowif" ADD CONSTRAINT "_BundleDetailToMuthowif_B_fkey" FOREIGN KEY ("B") REFERENCES "muthowif"("id") ON DELETE CASCADE ON UPDATE CASCADE;
