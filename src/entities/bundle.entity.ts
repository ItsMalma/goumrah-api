import {
	Column,
	Entity,
	JoinTable,
	ManyToMany,
	OneToMany,
	PrimaryGeneratedColumn,
	type Relation,
	Unique,
} from "typeorm";
import BundleDetail from "./bundleDetail.entity";
import Image from "./image.entity";
import Review from "./review.entity";

@Entity({
	name: "bundles",
})
@Unique("bundle_name_unique", ["name"])
export default class Bundle {
	@PrimaryGeneratedColumn("identity", {
		name: "id",
		generatedIdentity: "ALWAYS",
		type: "bigint",
	})
	id: number;

	@ManyToMany(() => Image)
	@JoinTable({
		name: "bundle_images",
		joinColumn: {
			name: "bundle_id",
			foreignKeyConstraintName: "bundle_images_bundle_foreign",
			referencedColumnName: "id",
		},
		inverseJoinColumn: {
			name: "image_id",
			foreignKeyConstraintName: "bundle_images_image_foreign",
			referencedColumnName: "id",
		},
	})
	images: Relation<Image[]>;

	@OneToMany(
		() => Review,
		(review) => review.bundle,
	)
	reviews: Relation<Review[]>;

	@Column({
		name: "name",
		type: "varchar",
		length: 128,
	})
	name: string;

	@Column({
		name: "description",
		type: "varchar",
		length: 255,
	})
	description: string;

	@OneToMany(
		() => BundleDetail,
		(bundleDetail) => bundleDetail.bundle,
	)
	bundleDetails: Relation<BundleDetail[]>;
}
