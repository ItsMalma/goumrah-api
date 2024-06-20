export default interface CRUDService<
	Input,
	Output,
	Param,
	InputUpdate = Input,
> {
	create(input: Input): Promise<Output>;
	getAll(): Promise<Output[]>;
	getById(param: Param, throwIfNotFound?: boolean): Promise<Output | null>;
	update(
		param: Param,
		input: InputUpdate,
		throwIfNotFound?: boolean,
	): Promise<Output>;
	delete(param: Param, throwIfNotFound?: boolean): Promise<Output>;
}
