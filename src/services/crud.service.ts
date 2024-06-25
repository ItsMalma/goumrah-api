import { HTTPException } from "hono/http-exception";
import type {
	DeepPartial,
	EntityTarget,
	FindOneOptions,
	FindOptionsRelationByString,
	FindOptionsRelations,
	ObjectLiteral,
	Repository,
} from "typeorm";
import dataSource from "../data-source";

export default abstract class CRUDService<
	Entity extends ObjectLiteral,
	Input,
	Output,
	Param,
> {
	protected repository: Repository<Entity>;
	protected relations:
		| FindOptionsRelations<Entity>
		| FindOptionsRelationByString;

	public constructor(
		entity: EntityTarget<Entity>,
		private entityName: string,
		relations?: FindOptionsRelations<Entity> | FindOptionsRelationByString,
	) {
		this.repository = dataSource.getRepository(entity);

		this.relations =
			relations ??
			this.repository.metadata.relations.map((relation) => {
				return relation.propertyName;
			});
	}

	protected abstract mapCreate(
		input: Input,
	): DeepPartial<Entity> | Promise<DeepPartial<Entity>>;
	protected abstract mapUpdate(
		old: Entity,
		input: Input,
	): DeepPartial<Entity> | Promise<DeepPartial<Entity>>;
	protected abstract mapParam(
		param: Param,
	): FindOneOptions<Entity> | Promise<FindOneOptions<Entity>>;
	protected abstract mapOutput(entity: Entity): Output | Promise<Output>;

	public async create(input: Input): Promise<Output> {
		const entity = await this.repository.save(await this.mapCreate(input));
		return this.mapOutput(entity);
	}

	public async getAll(): Promise<Output[]> {
		const entities = await this.repository.find({
			relations: this.relations,
		});
		return Promise.all(entities.map(this.mapOutput.bind(this)));
	}

	public async get(param: Param): Promise<Output> {
		const options = await this.mapParam(param);

		const entity = await this.repository.findOne({
			relations: this.relations,
			...options,
		});
		if (!entity) {
			throw new HTTPException(404, {
				message: `${this.entityName} tidak ditemukan`,
			});
		}

		return this.mapOutput(entity);
	}

	public async update(param: Param, input: Input): Promise<Output> {
		const options = await this.mapParam(param);

		const oldEntity = await this.repository.findOne({
			relations: this.relations,
			...options,
		});
		if (!oldEntity) {
			throw new HTTPException(404, {
				message: `${this.entityName} tidak ditemukan`,
			});
		}

		const newEntity = await this.mapUpdate(oldEntity, input);
		const entity = await this.repository.save(newEntity);

		return await this.mapOutput(entity);
	}

	public async delete(param: Param): Promise<Output> {
		const options = await this.mapParam(param);

		const entity = await this.repository.findOne({
			relations: this.relations,
			...options,
		});
		if (!entity) {
			throw new HTTPException(404, {
				message: `${this.entityName} tidak ditemukan`,
			});
		}

		await this.repository.remove(entity);
		return this.mapOutput(entity);
	}

	public async getDefault(param: Param): Promise<Output | null> {
		try {
			return await this.get(param);
		} catch {
			return null;
		}
	}

	public async updateDefault(
		param: Param,
		input: Input,
	): Promise<Output | null> {
		try {
			return await this.update(param, input);
		} catch {
			return null;
		}
	}

	public async deleteDefault(param: Param): Promise<Output | null> {
		try {
			return await this.delete(param);
		} catch {
			return null;
		}
	}

	public async createMany(inputs: Input[]): Promise<Output[]> {
		const promises = inputs.map((input) => this.create(input));
		const results = await Promise.all(promises);

		return results;
	}

	public async getMany(params: Param[]): Promise<Output[]> {
		const result: Output[] = [];
		for (const param of params) {
			const data = await this.get(param);
			result.push(data);
		}
		return result;
	}
}
