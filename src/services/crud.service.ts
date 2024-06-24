export default abstract class CRUDService<
	Input,
	Output,
	Param,
	InputUpdate = Input,
> {
	public abstract create(input: Input): Promise<Output>;
	public abstract getAll(): Promise<Output[]>;
	public abstract get(param: Param): Promise<Output>;
	public abstract update(param: Param, input: InputUpdate): Promise<Output>;
	public abstract delete(param: Param): Promise<Output>;

	public async getDefault(param: Param): Promise<Output | null> {
		try {
			return await this.get(param);
		} catch {
			return null;
		}
	}

	public async updateDefault(
		param: Param,
		input: InputUpdate,
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
