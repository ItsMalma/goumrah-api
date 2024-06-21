import { input, select } from "@inquirer/prompts";
import { Prisma } from "@prisma/client";
import path from "node:path";
import ts from "typescript";
import { camelCaseFromPascal, pascalCase } from "../src/utils/string.util.js";

const printer = ts.createPrinter({
	newLine: ts.NewLineKind.LineFeed,
});

select({
	message: "Pilih model",
	choices: Object.values(Prisma.ModelName).map((model) => {
		return {
			name: camelCaseFromPascal(model),
			value: camelCaseFromPascal(model),
		};
	}),
}).then((modelName) => {
	input({
		message: "Nama resource",
	}).then((resourceName) => {
		input({
			message: "Controller path",
		}).then((controllerPath) => {
			const resourceNamePascalCase = pascalCase(resourceName);

			// create schema
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
import type CRUDService from "./crud.service";

export default class ${resourceNamePascalCase}Service
	implements CRUDService<${resourceNamePascalCase}Input, ${resourceNamePascalCase}Output, ${resourceNamePascalCase}Param>
{
	private constructor() {}

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

	async getById(
		param: ${resourceNamePascalCase}Param,
		throwIfNotFound?: boolean,
	): Promise<${resourceNamePascalCase}Output | null> {
		const ${resourceName} = await db.${modelName}.findUnique({
			where: param,
		});
		if (!${resourceName} && throwIfNotFound)
			throw new HTTPException(404, { message: "Data tidak ditemukan" });

		return ${resourceName};
	}

	async update(
		param: ${resourceNamePascalCase}Param,
		input: ${resourceNamePascalCase}Input,
		throwIfNotFound?: boolean,
	): Promise<${resourceNamePascalCase}Output> {
		const ${resourceName} = await db.${modelName}.update({
			where: param,
			data: input,
		});
		if (!${resourceName} && throwIfNotFound)
			throw new HTTPException(404, { message: "Data tidak ditemukan" });

		return ${resourceName};
	}

	async delete(
		param: ${resourceNamePascalCase}Param,
		throwIfNotFound?: boolean,
	): Promise<${resourceNamePascalCase}Output> {
		const ${resourceName} = await db.${modelName}.delete({
			where: param,
		});
		if (!${resourceName} && throwIfNotFound)
			throw new HTTPException(404, { message: "Data tidak ditemukan" });

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

		const output = await ${resourceNamePascalCase}Service.instance.getById(param, true);

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
				input,
				true,
			);

			return c.json(output);
		},
	)
	.delete("/:id", validate("param", ${resourceName}ParamSchema), async (c) => {
		const param = c.req.valid("param");

		const output = await ${resourceNamePascalCase}Service.instance.delete(param, true);

		return c.json(output);
	});

export default ${resourceName}Controller;`,
			);
		});
	});
});
