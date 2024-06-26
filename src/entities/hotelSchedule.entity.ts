import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	type Relation,
} from "typeorm";
import BundleDetail from "./bundleDetail.entity";
import Hotel from "./hotel.entity";

@Entity({
	name: "hotel_schedules",
})
export default class HotelSchedule {
	@PrimaryGeneratedColumn("identity", {
		name: "id",
		generatedIdentity: "ALWAYS",
		type: "bigint",
	})
	id: number;

	@ManyToOne(
		() => Hotel,
		(hotel) => hotel.schedules,
	)
	@JoinColumn({
		name: "hotel_id",
		foreignKeyConstraintName: "hotel_schedule_hotel_foreign",
		referencedColumnName: "id",
	})
	hotel: Relation<Hotel>;

	@Column({
		name: "check_in",
		type: "date",
	})
	checkIn: Date;

	@Column({
		name: "check_out",
		type: "date",
	})
	checkOut: Date;

	@OneToMany(
		() => BundleDetail,
		(bundleDetail) => bundleDetail.makkahHotel,
	)
	bundleDetailsWithMakkahHotel: Relation<BundleDetail[]>;

	@OneToMany(
		() => BundleDetail,
		(bundleDetail) => bundleDetail.madinahHotel,
	)
	bundleDetailsWithMadinahHotel: Relation<BundleDetail[]>;
}
