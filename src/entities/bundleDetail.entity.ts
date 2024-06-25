import {
	Column,
	Entity,
	JoinColumn,
	JoinTable,
	ManyToMany,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	type Relation,
	Unique,
} from "typeorm";
import Bundle from "./bundle.entity";
import Bus from "./bus.entity";
import Embarkation from "./embarkation.entity";
import Flight from "./flight.entity";
import HotelSchedule from "./hotelSchedule.entity";
import Muthowif from "./muthowif.entity";
import RoomType from "./roomType.entity";
import Schedule from "./schedule.schema";

@Entity({
	name: "bundle_details",
})
@Unique("bundle_detail_unique", ["date", "embarkation", "roomType"])
export default class BundleDetail {
	@PrimaryGeneratedColumn("identity", {
		name: "id",
		generatedIdentity: "ALWAYS",
		type: "bigint",
	})
	id: number;

	@ManyToOne(
		() => Bundle,
		(bundle) => bundle.reviews,
	)
	@JoinColumn({
		name: "bundle_id",
		foreignKeyConstraintName: "bundle_detail_bundle_foreign",
		referencedColumnName: "id",
	})
	bundle: Relation<Bundle>;

	@Column({
		name: "price",
		type: "decimal",
	})
	price: number;

	@Column({
		name: "date",
		type: "date",
	})
	date: Date;

	@ManyToOne(
		() => Embarkation,
		(embarkation) => embarkation.bundleDetails,
	)
	@JoinColumn({
		name: "embarkation_id",
		foreignKeyConstraintName: "bundle_detail_embarkation_foreign",
		referencedColumnName: "id",
	})
	embarkation: Relation<Embarkation>;

	@ManyToOne(
		() => RoomType,
		(roomType) => roomType.bundleDetails,
	)
	@JoinColumn({
		name: "room_type_id",
		foreignKeyConstraintName: "bundle_detail_room_type_foreign",
		referencedColumnName: "id",
	})
	roomType: Relation<RoomType>;

	@ManyToOne(
		() => HotelSchedule,
		(hotelSchedule) => hotelSchedule.bundleDetailsWithMakkahHotel,
	)
	@JoinColumn({
		name: "makkah_hotel_id",
		foreignKeyConstraintName: "bundle_detail_makkah_hotel_foreign",
		referencedColumnName: "id",
	})
	makkahHotel: Relation<HotelSchedule>;

	@ManyToOne(
		() => HotelSchedule,
		(hotelSchedule) => hotelSchedule.bundleDetailsWithMadinahHotel,
	)
	@JoinColumn({
		name: "madinah_hotel_id",
		foreignKeyConstraintName: "bundle_detail_madinah_hotel_foreign",
		referencedColumnName: "id",
	})
	madinahHotel: Relation<HotelSchedule>;

	@ManyToOne(
		() => Flight,
		(flight) => flight.bundleDetails,
	)
	@JoinColumn({
		name: "flight_id",
		foreignKeyConstraintName: "bundle_detail_flight_foreign",
		referencedColumnName: "id",
	})
	flight: Relation<Flight>;

	@ManyToOne(
		() => Bus,
		(bus) => bus.bundleDetails,
	)
	@JoinColumn({
		name: "bus_id",
		foreignKeyConstraintName: "bundle_detail_bus_foreign",
		referencedColumnName: "id",
	})
	bus: Relation<Bus>;

	@OneToMany(
		() => Schedule,
		(schedule) => schedule.bundleDetail,
	)
	schedules: Relation<Schedule[]>;

	@ManyToMany(() => Muthowif)
	@JoinTable({
		name: "bundle_detail_muthowif",
		joinColumn: {
			name: "bundle_detail_id",
			foreignKeyConstraintName: "bundle_detail_muthowif_bundle_detail_foreign",
			referencedColumnName: "id",
		},
		inverseJoinColumn: {
			name: "muthowif_id",
			foreignKeyConstraintName: "bundle_detail_muthowif_muthowif_foreign",
			referencedColumnName: "id",
		},
	})
	muthowif: Relation<Muthowif[]>;
}
