import {
	Column,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	type Relation,
	Unique,
} from "typeorm";
import FlightSchedule from "./flightSchedule.entity";

@Entity({
	name: "aircrafts",
})
@Unique("aircraft_name_unique", ["name"])
export default class Aircraft {
	@PrimaryGeneratedColumn("identity", {
		name: "id",
		generatedIdentity: "ALWAYS",
		type: "bigint",
	})
	id: number;

	@Column({
		name: "name",
		type: "varchar",
		length: 128,
	})
	name: string;

	@OneToMany(
		() => FlightSchedule,
		(flightSchedule) => flightSchedule.aircraft,
	)
	flightSchedules: Relation<FlightSchedule[]>;
}
