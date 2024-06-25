import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	type Relation,
} from "typeorm";
import Agenda from "./agenda.entity";
import BundleDetail from "./bundleDetail.entity";

@Entity({
	name: "schedules",
})
export default class Schedule {
	@PrimaryGeneratedColumn("identity", {
		name: "id",
		generatedIdentity: "ALWAYS",
		type: "bigint",
	})
	id: number;

	@ManyToOne(
		() => BundleDetail,
		(bundleDetail) => bundleDetail.schedules,
	)
	@JoinColumn({
		name: "bundle_detail_id",
		foreignKeyConstraintName: "schedule_bundle_detail_foreign",
		referencedColumnName: "id",
	})
	bundleDetail: Relation<BundleDetail>;

	@Column({
		name: "name",
		type: "varchar",
		length: 128,
	})
	name: string;

	@Column({
		name: "date",
		type: "date",
	})
	date: Date;

	@OneToOne(
		() => Schedule,
		(schedule) => schedule.prev,
		{ nullable: true },
	)
	@JoinColumn({
		name: "next_id",
		foreignKeyConstraintName: "schedule_next_foreign",
		referencedColumnName: "id",
	})
	next: Schedule | null;

	@OneToOne(
		() => Schedule,
		(schedule) => schedule.next,
		{ nullable: true },
	)
	prev: Schedule | null;

	@OneToMany(
		() => Agenda,
		(agenda) => agenda.schedule,
	)
	agendas: Agenda[];
}
