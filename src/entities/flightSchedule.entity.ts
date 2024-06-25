import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToOne,
	PrimaryGeneratedColumn,
	type Relation,
} from "typeorm";
import Aircraft from "./aircraft.entity";
import FlightEvent from "./flightEvent.entity";
import Transit from "./transit.entity";

@Entity({
	name: "flight_schedules",
})
export default class FlightSchedule {
	@PrimaryGeneratedColumn("identity", {
		name: "id",
		generatedIdentity: "ALWAYS",
		type: "bigint",
	})
	id: number;

	@OneToOne(() => FlightEvent)
	@JoinColumn({
		name: "take_off_id",
		foreignKeyConstraintName: "flight_schedule_take_off_foreign",
		referencedColumnName: "id",
	})
	takeOff: Relation<FlightEvent>;

	@Column({
		name: "duration",
		type: "int",
	})
	duration: number;

	@Column({
		name: "flight_number",
		type: "varchar",
		length: 128,
	})
	flightNumber: string;

	@ManyToOne(
		() => Aircraft,
		(aircraft) => aircraft.flightSchedules,
	)
	@JoinColumn({
		name: "aircraft_id",
		foreignKeyConstraintName: "flight_schedule_aircraft_foreign",
		referencedColumnName: "id",
	})
	aircraft: Relation<Aircraft>;

	@Column({
		name: "baggage",
		type: "int",
	})
	baggage: number;

	@Column({
		name: "cabin_baggage",
		type: "int",
	})
	cabinBaggage: number;

	@Column({
		name: "seat_layout",
		type: "varchar",
		length: 16,
	})
	seatLayout: string;

	@OneToOne(() => FlightEvent)
	@JoinColumn({
		name: "landing_id",
		foreignKeyConstraintName: "flight_schedule_landing_foreign",
		referencedColumnName: "id",
	})
	landing: Relation<FlightEvent>;

	@OneToOne(() => Transit, { nullable: true })
	@JoinColumn({
		name: "transit_id",
		foreignKeyConstraintName: "flight_schedule_transit_foreign",
		referencedColumnName: "id",
	})
	transit: Relation<Transit> | null;

	@OneToOne(
		() => FlightSchedule,
		(flightSchedule) => flightSchedule.prev,
		{ nullable: true },
	)
	@JoinColumn({
		name: "next_id",
		foreignKeyConstraintName: "flight_schedule_next_foreign",
		referencedColumnName: "id",
	})
	next: Relation<FlightSchedule> | null;

	@OneToOne(
		() => FlightSchedule,
		(flightSchedule) => flightSchedule.next,
		{ nullable: true },
	)
	prev: Relation<FlightSchedule> | null;
}
