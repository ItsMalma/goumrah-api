/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `airline_certificates` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `airlines` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `airports` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `airports` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[date,embarkation_id,room_type_id]` on the table `bundle_details` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `bundles` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `buses` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `embarkations` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `facilities` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `food_menus` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `food_types` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `hotels` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[src]` on the table `images` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `muthowif` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `room_types` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "airline_certificates_name_key" ON "airline_certificates"("name");

-- CreateIndex
CREATE UNIQUE INDEX "airlines_name_key" ON "airlines"("name");

-- CreateIndex
CREATE UNIQUE INDEX "airports_name_key" ON "airports"("name");

-- CreateIndex
CREATE UNIQUE INDEX "airports_code_key" ON "airports"("code");

-- CreateIndex
CREATE UNIQUE INDEX "bundle_details_date_embarkation_id_room_type_id_key" ON "bundle_details"("date", "embarkation_id", "room_type_id");

-- CreateIndex
CREATE UNIQUE INDEX "bundles_name_key" ON "bundles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "buses_name_key" ON "buses"("name");

-- CreateIndex
CREATE UNIQUE INDEX "embarkations_name_key" ON "embarkations"("name");

-- CreateIndex
CREATE UNIQUE INDEX "facilities_name_key" ON "facilities"("name");

-- CreateIndex
CREATE UNIQUE INDEX "food_menus_name_key" ON "food_menus"("name");

-- CreateIndex
CREATE UNIQUE INDEX "food_types_name_key" ON "food_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "hotels_name_key" ON "hotels"("name");

-- CreateIndex
CREATE UNIQUE INDEX "images_src_key" ON "images"("src");

-- CreateIndex
CREATE UNIQUE INDEX "muthowif_name_key" ON "muthowif"("name");

-- CreateIndex
CREATE UNIQUE INDEX "room_types_name_key" ON "room_types"("name");
