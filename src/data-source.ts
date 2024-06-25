import { DataSource } from "typeorm";

import Agenda from "./entities/agenda.entity";
import Aircraft from "./entities/aircraft.entity";
import Airline from "./entities/airline.entity";
import Airport from "./entities/airport.entity";
import Bundle from "./entities/bundle.entity";
import BundleDetail from "./entities/bundleDetail.entity";
import Bus from "./entities/bus.entity";
import Embarkation from "./entities/embarkation.entity";
import Facility from "./entities/facility.entity";
import Flight from "./entities/flight.entity";
import FlightEvent from "./entities/flightEvent.entity";
import FlightSchedule from "./entities/flightSchedule.entity";
import FoodMenu from "./entities/foodMenu.entity";
import FoodType from "./entities/foodType.entity";
import Hotel from "./entities/hotel.entity";
import HotelFood from "./entities/hotelFood.entity";
import HotelSchedule from "./entities/hotelSchedule.entity";
import Image from "./entities/image.entity";
import Muthowif from "./entities/muthowif.entity";
import Review from "./entities/review.entity";
import RoomType from "./entities/roomType.entity";
import Schedule from "./entities/schedule.schema";
import Transit from "./entities/transit.entity";
import { Init1719316632795 } from "./migrations/1719316632795-Init";

const dataSource = new DataSource({
	type: "postgres",
	host: Bun.env.POSTGRES_HOST,
	port: Number(Bun.env.POSTGRES_PORT),
	username: Bun.env.POSTGRES_USER,
	password: Bun.env.POSTGRES_PASS,
	database: Bun.env.POSTGRES_NAME,
	synchronize: false,
	logging: ["error", "query", "info", "warn"],
	entities: [
		Bundle,
		BundleDetail,
		Image,
		Review,
		Embarkation,
		RoomType,
		Facility,
		FoodType,
		FoodMenu,
		Hotel,
		HotelFood,
		HotelSchedule,
		Airline,
		Airport,
		Aircraft,
		FlightEvent,
		Transit,
		FlightSchedule,
		Flight,
		Bus,
		Agenda,
		Schedule,
		Muthowif,
	],
	migrations: [Init1719316632795],
	migrationsTableName: "migrations",
});

dataSource
	.initialize()
	.then(() => {
		console.log("Database connected");
	})
	.catch((err) => {
		console.error("Database connection failed", err);
	});

export default dataSource;
