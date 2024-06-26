import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity({
	name: "facilities",
})
@Unique("facility_name_unique", ["name"])
export default class Facility {
	@PrimaryGeneratedColumn("identity", {
		name: "id",
		generatedIdentity: "ALWAYS",
		type: "bigint",
	})
	id: number;

	@Column({
		name: "icon",
		type: "varchar",
		length: 128,
	})
	icon: string;

	@Column({
		name: "name",
		type: "varchar",
		length: 128,
	})
	name: string;
}
