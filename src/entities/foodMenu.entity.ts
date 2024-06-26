import {
	Column,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	type Relation,
	Unique,
} from "typeorm";
import HotelFood from "./hotelFood.entity";

@Entity({
	name: "food_menus",
})
@Unique("food_menu_name_unique", ["name"])
export default class FoodMenu {
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
		() => HotelFood,
		(hotelFood) => hotelFood.foodMenu,
	)
	hotels: Relation<HotelFood[]>;
}
