import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	type Relation,
} from "typeorm";
import Airport from "./airport.entity";

@Entity({
	name: "flight_events",
})
export default class FlightEvent {
	@PrimaryGeneratedColumn("identity", {
		name: "id",
		generatedIdentity: "ALWAYS",
		type: "bigint",
	})
	id: number;

	@Column({
		name: "date_time",
		type: "timestamptz",
	})
	dateTime: Date;

	@ManyToOne(
		() => Airport,
		(airport) => airport.flightEvents,
	)
	@JoinColumn({
		name: "airport_id",
		foreignKeyConstraintName: "flight_events_airport_foreign",
		referencedColumnName: "id",
	})
	airport: Relation<Airport>;

	@Column({
		name: "terminal",
		type: "varchar",
		length: 128,
	})
	terminal: string;
}
