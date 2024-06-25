import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	type Relation,
} from "typeorm";
import Bundle from "./bundle.entity";

@Entity({
	name: "reviews",
})
export default class Review {
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
		foreignKeyConstraintName: "review_bundle_foreign",
		referencedColumnName: "id",
	})
	bundle: Relation<Bundle>;

	@Column({
		name: "rating",
		type: "int",
	})
	rating: number;
}
