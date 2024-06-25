import {
	Column,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	type Relation,
	Unique,
} from "typeorm";
import BundleDetail from "./bundleDetail.entity";

@Entity({
	name: "embarkations",
})
@Unique("embarkation_name_unique", ["name"])
export default class Embarkation {
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
		() => BundleDetail,
		(bundleDetail) => bundleDetail.embarkation,
	)
	bundleDetails: Relation<BundleDetail[]>;
}
