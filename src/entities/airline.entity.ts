import {
	Column,
	Entity,
	JoinColumn,
	JoinTable,
	ManyToMany,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	type Relation,
	Unique,
} from "typeorm";
import Flight from "./flight.entity";
import Image from "./image.entity";

@Entity({
	name: "airlines",
})
@Unique("airline_name_unique", ["name"])
export default class Airline {
	@PrimaryGeneratedColumn("identity", {
		name: "id",
		generatedIdentity: "ALWAYS",
		type: "bigint",
	})
	id: number;

	@OneToOne(() => Image, { onDelete: "RESTRICT" })
	@JoinColumn({
		name: "thumbnail",
		foreignKeyConstraintName: "airline_thumbnail_foreign",
		referencedColumnName: "id",
	})
	thumbnail: Relation<Image>;

	@Column({
		name: "rating",
		type: "int",
	})
	rating: number;

	@Column({
		name: "name",
		type: "varchar",
		length: 128,
	})
	name: string;

	@Column({
		name: "help_link",
		type: "varchar",
		length: 128,
	})
	helpLink: string;

	@ManyToMany(() => Image)
	@JoinTable({
		name: "airline_images",
		joinColumn: {
			name: "airline_id",
			foreignKeyConstraintName: "airline_images_airline_foreign",
			referencedColumnName: "id",
		},
		inverseJoinColumn: {
			name: "image_id",
			foreignKeyConstraintName: "airline_images_image_foreign",
			referencedColumnName: "id",
		},
	})
	images: Relation<Image[]>;

	@OneToMany(
		() => Flight,
		(flight) => flight.airline,
	)
	flights: Relation<Flight[]>;
}
