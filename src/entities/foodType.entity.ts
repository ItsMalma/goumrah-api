import {
	Column,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	type Relation,
	Unique,
} from "typeorm";
import Hotel from "./hotel.entity";

@Entity({
	name: "food_types",
})
@Unique("food_type_name_unique", ["name"])
export default class FoodType {
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
		() => Hotel,
		(hotel) => hotel.foodType,
	)
	hotels: Relation<Hotel[]>;
}
