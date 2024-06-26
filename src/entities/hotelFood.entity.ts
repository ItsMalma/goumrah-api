import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	type Relation,
	Unique,
} from "typeorm";
import FoodMenu from "./foodMenu.entity";
import Hotel from "./hotel.entity";

@Entity({
	name: "hotel_foods",
})
@Unique("hotel_food_hotel_food_menu_unique", ["foodMenu", "hotel"])
export default class HotelFood {
	@PrimaryGeneratedColumn("identity", {
		name: "id",
		generatedIdentity: "ALWAYS",
		type: "bigint",
	})
	id: number;

	@Column({
		name: "amount",
		type: "int",
	})
	amount: number;

	@ManyToOne(
		() => Hotel,
		(hotel) => hotel.foods,
	)
	@JoinColumn({
		name: "hotel_id",
		foreignKeyConstraintName: "hotel_food_hotel_foreign",
		referencedColumnName: "id",
	})
	hotel: Relation<Hotel>;

	@ManyToOne(
		() => FoodMenu,
		(foodMenu) => foodMenu.hotels,
	)
	@JoinColumn({
		name: "food_menu_id",
		foreignKeyConstraintName: "hotel_food_food_menu_foreign",
		referencedColumnName: "id",
	})
	foodMenu: Relation<FoodMenu>;
}
