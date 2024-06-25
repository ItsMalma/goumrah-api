import {
	Column,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	type Relation,
	Unique,
} from "typeorm";
import FlightEvent from "./flightEvent.entity";
import Transit from "./transit.entity";

@Entity({
	name: "airports",
})
@Unique("airport_name_unique", ["name"])
@Unique("airport_code_unique", ["code"])
export default class Airport {
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

	@Column({
		name: "code",
		type: "varchar",
		length: 8,
	})
	code: string;

	@OneToMany(
		() => FlightEvent,
		(flightEvent) => flightEvent.airport,
	)
	flightEvents: Relation<FlightEvent[]>;

	@OneToMany(
		() => Transit,
		(transit) => transit.airport,
	)
	transits: Relation<Transit[]>;
}
