import {
	Column,
	Entity,
	JoinColumn,
	JoinTable,
	ManyToMany,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	type Relation,
	Unique,
} from "typeorm";
import Facility from "./facility.entity";
import FoodType from "./foodType.entity";
import HotelFood from "./hotelFood.entity";
import HotelSchedule from "./hotelSchedule.entity";
import Image from "./image.entity";

@Entity({
	name: "hotels",
})
@Unique("hotel_name_unique", ["name"])
export default class Hotel {
	@PrimaryGeneratedColumn("identity", {
		name: "id",
		generatedIdentity: "ALWAYS",
		type: "bigint",
	})
	id: number;

	@OneToOne(() => Image, { onDelete: "RESTRICT" })
	@JoinColumn({
		name: "thumbnail",
		foreignKeyConstraintName: "hotel_thumbnail_foreign",
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
		name: "hotel_images",
		joinColumn: {
			name: "hotel_id",
			foreignKeyConstraintName: "hotel_images_hotel_foreign",
			referencedColumnName: "id",
		},
		inverseJoinColumn: {
			name: "image_id",
			foreignKeyConstraintName: "hotel_images_image_foreign",
			referencedColumnName: "id",
		},
	})
	images: Relation<Image[]>;

	@Column({
		name: "description",
		type: "varchar",
		length: 255,
	})
	description: string;

	@ManyToMany(() => Facility)
	@JoinTable({
		name: "hotel_facilities",
		joinColumn: {
			name: "hotel_id",
			foreignKeyConstraintName: "hotel_facilities_hotel_foreign",
			referencedColumnName: "id",
		},
		inverseJoinColumn: {
			name: "facility_id",
			foreignKeyConstraintName: "hotel_facilities_facility_foreign",
			referencedColumnName: "id",
		},
	})
	facilities: Relation<Facility[]>;

	@Column({
		name: "map_link",
		type: "varchar",
		length: 255,
	})
	mapLink: string;

	@Column({
		name: "address",
		type: "varchar",
		length: 255,
	})
	address: string;

	@Column({
		name: "distance",
		type: "int",
	})
	distance: number;

	@ManyToOne(
		() => FoodType,
		(foodType) => foodType.hotels,
	)
	@JoinColumn({
		name: "food_type_id",
		foreignKeyConstraintName: "hotel_food_type_foreign",
		referencedColumnName: "id",
	})
	foodType: Relation<FoodType>;

	@OneToMany(
		() => HotelFood,
		(hotelFood) => hotelFood.hotel,
	)
	foods: Relation<HotelFood[]>;

	@Column({
		name: "review_link",
		type: "varchar",
		length: 255,
	})
	reviewLink: string;

	get foodAmount() {
		return this.foods.reduce((prev, foodHotel) => prev + foodHotel.amount, 0);
	}

	@OneToMany(
		() => HotelSchedule,
		(hotelSchedule) => hotelSchedule.hotel,
	)
	schedules: Relation<HotelSchedule[]>;
}
