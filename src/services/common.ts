import type { StatusCode } from "hono/utils/http-status";
import { type Insertable, type Selectable, type Updateable } from "kysely";

export interface ResponsePayload<Data, Err = unknown> {
  data: Data | null;
  error: Err | null;
}

export interface IService<Input, Output, Id = number> {
  create(input: Input): Promise<[ResponsePayload<Output>, StatusCode]>;
  read(): Promise<[ResponsePayload<Output[]>, StatusCode]>;
  readOne(id: Id): Promise<[ResponsePayload<Output>, StatusCode]>;
  update(id: Id, input: Input): Promise<[ResponsePayload<Output>, StatusCode]>;
  delete(id: Id): Promise<[ResponsePayload<Output>, StatusCode]>;
}

export interface IMapper<
  Input,
  Output,
  Table,
  Select = Selectable<Table>,
  Insert = Insertable<Table>,
  Update = Updateable<Table>
> {
  mapToInsert(input: Input): Promise<Insert>;
  mapToUpdate(input: Input): Promise<Update>;
  mapToOutput(table: Select): Promise<Output>;
}

export interface IServiceWithMapper<Input, Output, Table, Id = number>
  extends IService<Input, Output, Id>,
    IMapper<Input, Output, Table> {}
