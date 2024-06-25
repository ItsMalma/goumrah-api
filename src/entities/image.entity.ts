import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity({
	name: "images",
})
@Unique("image_src_unique", ["src"])
export default class Image {
	@PrimaryGeneratedColumn("identity", {
		name: "id",
		generatedIdentity: "ALWAYS",
		type: "bigint",
	})
	id: number;

	@Column({
		name: "src",
		type: "varchar",
		length: 32,
	})
	src: string;

	@Column({
		name: "alt",
		type: "varchar",
		length: 255,
		nullable: true,
	})
	alt: string | null;
}
