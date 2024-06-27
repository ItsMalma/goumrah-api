/*
  Warnings:

  - You are about to drop the column `aircraftType` on the `flight_schedules` table. All the data in the column will be lost.
  - Added the required column `aircraft_id` to the `flight_schedules` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "flight_schedules" DROP COLUMN "aircraftType",
ADD COLUMN     "aircraft_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "aircrafts" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "aircrafts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "aircrafts_name_key" ON "aircrafts"("name");

-- AddForeignKey
ALTER TABLE "flight_schedules" ADD CONSTRAINT "flight_schedules_aircraft_id_fkey" FOREIGN KEY ("aircraft_id") REFERENCES "aircrafts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
