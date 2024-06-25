import {
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	type Relation,
} from "typeorm";
import Airline from "./airline.entity";
import BundleDetail from "./bundleDetail.entity";
import FlightSchedule from "./flightSchedule.entity";

@Entity({
	name: "flights",
})
export default class Flight {
	@PrimaryGeneratedColumn("identity", {
		name: "id",
		generatedIdentity: "ALWAYS",
		type: "bigint",
	})
	id: number;

	@ManyToOne(
		() => Airline,
		(airline) => airline.flights,
	)
	@JoinColumn({
		name: "airline_id",
		foreignKeyConstraintName: "flight_airline_foreign",
		referencedColumnName: "id",
	})
	airline: Relation<Airline>;

	@OneToOne(() => FlightSchedule)
	@JoinColumn({
		name: "outbound_id",
		foreignKeyConstraintName: "flight_outbound_foreign",
		referencedColumnName: "id",
	})
	outbound: Relation<FlightSchedule>;

	@OneToOne(() => FlightSchedule)
	@JoinColumn({
		name: "inbound_id",
		foreignKeyConstraintName: "flight_inbound_foreign",
		referencedColumnName: "id",
	})
	inbound: Relation<FlightSchedule>;

	@OneToMany(
		() => BundleDetail,
		(bundleDetail) => bundleDetail.flight,
	)
	bundleDetails: Relation<BundleDetail[]>;
}
