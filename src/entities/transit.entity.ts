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
	name: "transits",
})
export default class Transit {
	@PrimaryGeneratedColumn("identity", {
		name: "id",
		generatedIdentity: "ALWAYS",
		type: "bigint",
	})
	id: number;

	@Column({
		name: "duration",
		type: "int",
	})
	duration: number;

	@ManyToOne(
		() => Airport,
		(airport) => airport.transits,
	)
	@JoinColumn({
		name: "airport_id",
		foreignKeyConstraintName: "transit_airport_foreign",
		referencedColumnName: "id",
	})
	airport: Relation<Airport>;
}
