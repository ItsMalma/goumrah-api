import { confirm, input, select } from "@inquirer/prompts";
import { Prisma } from "@prisma/client";
import path from "node:path";
import {
	camelCaseFromPascal,
	pascalCase,
	pascalCaseToTitle,
} from "../src/utils/string.util.js";

async function main() {
	const modelName = await select({
		message: "Pilih model",
		choices: Object.values(Prisma.ModelName).map((model) => {
			return {
				name: camelCaseFromPascal(model),
				value: camelCaseFromPascal(model),
			};
		}),
	});

	const resourceName = await input({
		message: "Nama resource",
	});
	const resourceNamePascalCase = pascalCase(resourceName);
	const resourceNameTitle = pascalCaseToTitle(resourceName);

	const controllerPath = await input({
		message: "Controller path",
	});

	// create schema
	let confirmed = await confirm({ message: "Buat schema?" });
	if (!confirmed) return;

	const schemaFilePath = path.join(
		__dirname,
		"..",
		"src",
		"schemas",
		`${resourceName}.schema.ts`,
	);
	const schemaFile = Bun.file(schemaFilePath);
	Bun.write(
		schemaFile,
		`import {
	check,
	number,
	object,
	pipe,
	transform,
	unknown,
	type InferOutput,
} from "valibot";
import { isNumeric } from "validator";

export const ${resourceName}InputSchema = object({}, "Harus berupa object");
export type ${resourceNamePascalCase}Input = InferOutput<typeof ${resourceName}InputSchema>;

export const ${resourceName}OutputSchema = object({
	id: number(),
});
export type ${resourceNamePascalCase}Output = InferOutput<typeof ${resourceName}OutputSchema>;

export const ${resourceName}ParamSchema = object({
	id: pipe(
		unknown(),
		check(isNumeric, "Harus berupa angka"),
		transform(Number),
	),
});
export type ${resourceNamePascalCase}Param = InferOutput<typeof ${resourceName}ParamSchema>;`,
	);

	// create service
	confirmed = await confirm({ message: "Buat service?" });
	if (!confirmed) return;

	const serviceFilePath = path.join(
		__dirname,
		"..",
		"src",
		"services",
		`${resourceName}.service.ts`,
	);
	const serviceFile = Bun.file(serviceFilePath);
	Bun.write(
		serviceFile,
		`import { HTTPException } from "hono/http-exception";
import db from "../db";
import type {
	${resourceNamePascalCase}Input,
	${resourceNamePascalCase}Output,
	${resourceNamePascalCase}Param,
} from "../schemas/${resourceName}.schema";
import CRUDService from "./crud.service";

export default class ${resourceNamePascalCase}Service extends CRUDService<
	${resourceNamePascalCase}Input,
	${resourceNamePascalCase}Output,
	${resourceNamePascalCase}Param
> {
	private constructor() {
  	super()
	}

	async create(input: ${resourceNamePascalCase}Input): Promise<${resourceNamePascalCase}Output> {
		const ${resourceName} = await db.${modelName}.create({
			data: input,
		});

		return ${resourceName};
	}

	async getAll(): Promise<${resourceNamePascalCase}Output[]> {
		const ${controllerPath} = await db.${modelName}.findMany();

		return ${controllerPath};
	}

	async get(
		param: ${resourceNamePascalCase}Param
	): Promise<${resourceNamePascalCase}Output> {
		const ${resourceName} = await db.${modelName}.findUnique({
			where: param,
		});
		if (!${resourceName})
			throw new HTTPException(404, { message: "${resourceNameTitle} tidak ditemukan" });

		return ${resourceName};
	}

	async update(
		param: ${resourceNamePascalCase}Param,
		input: ${resourceNamePascalCase}Input
	): Promise<${resourceNamePascalCase}Output> {
		const ${resourceName} = await db.${modelName}.update({
			where: param,
			data: input,
		});
		if (!${resourceName})
			throw new HTTPException(404, { message: "${resourceNameTitle} tidak ditemukan" });

		return ${resourceName};
	}

	async delete(
		param: ${resourceNamePascalCase}Param
	): Promise<${resourceNamePascalCase}Output> {
		const ${resourceName} = await db.${modelName}.delete({
			where: param,
		});
		if (!${resourceName})
			throw new HTTPException(404, { message: "${resourceNameTitle} tidak ditemukan" });

		return ${resourceName};
	}

	private static _instance: ${resourceNamePascalCase}Service | null = null;
	static get instance(): ${resourceNamePascalCase}Service {
		if (!${resourceNamePascalCase}Service._instance)
			${resourceNamePascalCase}Service._instance = new ${resourceNamePascalCase}Service();
		return ${resourceNamePascalCase}Service._instance;
	}
}`,
	);

	// create controller
	confirmed = await confirm({ message: "Buat controller?" });
	if (!confirmed) return;

	const controllerFilePath = path.join(
		__dirname,
		"..",
		"src",
		"controllers",
		`${resourceName}.controller.ts`,
	);
	const controllerFile = Bun.file(controllerFilePath);
	Bun.write(
		controllerFile,
		`import { Hono } from "hono";
import { validate } from "../middlewares/validate.middleware";
import {
	${resourceName}InputSchema,
	${resourceName}ParamSchema,
} from "../schemas/${resourceName}.schema";
import ${resourceNamePascalCase}Service from "../services/${resourceName}.service";

const ${resourceName}Controller = new Hono()
	.basePath("/${controllerPath}")
	.post("", validate("json", ${resourceName}InputSchema), async (c) => {
		const input = c.req.valid("json");

		const output = await ${resourceNamePascalCase}Service.instance.create(input);

		return c.json(output, 201);
	})
	.get("", async (c) => {
		const output = await ${resourceNamePascalCase}Service.instance.getAll();

		return c.json(output);
	})
	.get("/:id", validate("param", ${resourceName}ParamSchema), async (c) => {
		const param = c.req.valid("param");

		const output = await ${resourceNamePascalCase}Service.instance.getById(param);

		return c.json(output);
	})
	.put(
		"/:id",
		validate("param", ${resourceName}ParamSchema),
		validate("json", ${resourceName}InputSchema),
		async (c) => {
			const param = c.req.valid("param");
			const input = c.req.valid("json");

			const output = await ${resourceNamePascalCase}Service.instance.update(
				param,
				input
			);

			return c.json(output);
		},
	)
	.delete("/:id", validate("param", ${resourceName}ParamSchema), async (c) => {
		const param = c.req.valid("param");

		const output = await ${resourceNamePascalCase}Service.instance.delete(param);

		return c.json(output);
	});

export default ${resourceName}Controller;`,
	);
}

main();
