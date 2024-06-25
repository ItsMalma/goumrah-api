import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToOne,
	PrimaryGeneratedColumn,
	type Relation,
} from "typeorm";
import Schedule from "./schedule.schema";

@Entity({
	name: "agendas",
})
export default class Agenda {
	@PrimaryGeneratedColumn("identity", {
		name: "id",
		generatedIdentity: "ALWAYS",
		type: "bigint",
	})
	id: number;

	@ManyToOne(
		() => Schedule,
		(schedule) => schedule.agendas,
	)
	@JoinColumn({
		name: "schedule_id",
		foreignKeyConstraintName: "agenda_schedule_foreign",
		referencedColumnName: "id",
	})
	schedule: Relation<Schedule>;

	@Column({
		name: "date_time",
		type: "timestamptz",
	})
	dateTime: Date;

	@Column({
		name: "description",
		type: "varchar",
		length: 255,
	})
	description: string;

	@OneToOne(
		() => Agenda,
		(agenda) => agenda.prev,
		{ nullable: true },
	)
	@JoinColumn({
		name: "next_id",
		foreignKeyConstraintName: "agenda_next_foreign",
		referencedColumnName: "id",
	})
	next: Relation<Agenda> | null;

	@OneToOne(
		() => Agenda,
		(agenda) => agenda.next,
		{ nullable: true },
	)
	prev: Relation<Agenda> | null;
}
