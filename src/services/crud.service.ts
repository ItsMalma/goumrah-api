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
}
