import type { DeepPartial, FindOneOptions } from "typeorm";
import RoomType from "../entities/roomType.entity";
import type {
	RoomTypeInput,
	RoomTypeOutput,
	RoomTypeParam,
} from "../schemas/roomType.schema";
import CRUDService from "./crud.service";

export default class RoomTypeService extends CRUDService<
	RoomType,
	RoomTypeInput,
	RoomTypeOutput,
	RoomTypeParam
> {
	private constructor() {
		super(RoomType, "Tipe Kamar");
	}

	protected mapCreate(input: RoomTypeInput): DeepPartial<RoomType> {
		return { name: input.name };
	}

	protected mapUpdate(old: RoomType, input: RoomTypeInput): RoomType {
		old.name = input.name;
		return old;
	}

	protected mapParam(param: RoomTypeParam): FindOneOptions<RoomType> {
		return { where: { id: param.id } };
	}

	protected mapOutput(entity: RoomType): RoomTypeOutput {
		return { id: entity.id, name: entity.name };
	}

	private static _instance: RoomTypeService | null = null;
	static get instance(): RoomTypeService {
		if (!RoomTypeService._instance)
			RoomTypeService._instance = new RoomTypeService();
		return RoomTypeService._instance;
	}
}
