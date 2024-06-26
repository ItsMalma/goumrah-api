import {
	Column,
	Entity,
	JoinColumn,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	type Relation,
	Unique,
} from "typeorm";
import BundleDetail from "./bundleDetail.entity";
import Image from "./image.entity";

@Entity({
	name: "buses",
})
@Unique("bus_name_unique", ["name"])
export default class Bus {
	@PrimaryGeneratedColumn("identity", {
		name: "id",
		generatedIdentity: "ALWAYS",
		type: "bigint",
	})
	id: number;

	@OneToOne(() => Image, { onDelete: "RESTRICT" })
	@JoinColumn({
		name: "thumbnail",
		foreignKeyConstraintName: "bus_thumbnail_foreign",
		referencedColumnName: "id",
	})
	thumbnail: Relation<Image>;

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

	@OneToMany(
		() => BundleDetail,
		(bundleDetail) => bundleDetail.bus,
	)
	bundleDetails: Relation<BundleDetail[]>;
}
