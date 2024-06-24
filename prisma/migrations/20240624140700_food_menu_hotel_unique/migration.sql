/*
  Warnings:

  - A unique constraint covering the columns `[food_menu_id,hotel_id]` on the table `food_menu_hotels` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "food_menu_hotels_food_menu_id_hotel_id_key" ON "food_menu_hotels"("food_menu_id", "hotel_id");
