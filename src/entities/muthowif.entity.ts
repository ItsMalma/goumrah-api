import {
	Column,
	Entity,
	JoinColumn,
	OneToOne,
	PrimaryGeneratedColumn,
	type Relation,
	Unique,
} from "typeorm";
import Image from "./image.entity";

@Entity({
	name: "muthowif",
})
@Unique("muthowif_name_unique", ["name"])
export default class Muthowif {
	@PrimaryGeneratedColumn("identity", {
		name: "id",
		generatedIdentity: "ALWAYS",
		type: "bigint",
	})
	id: number;

	@OneToOne(() => Image, { onDelete: "RESTRICT" })
	@JoinColumn({
		name: "thumbnail",
		foreignKeyConstraintName: "muthowif_thumbnail_foreign",
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
		name: "bio",
		type: "varchar",
		length: 128,
	})
	bio: string;

	@Column({
		name: "detail",
		type: "varchar",
		length: 255,
	})
	detail: string;
}
