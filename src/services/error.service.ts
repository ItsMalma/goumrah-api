import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import type { HTTPResponseError } from "hono/types";
import type { StatusCode } from "hono/utils/http-status";

export default class ErrorService {
	private constructor() {}

	async handle(
		err: Error | HTTPResponseError,
	): Promise<[string, StatusCode, false] | [object, StatusCode, true]> {
		if (err instanceof PrismaClientKnownRequestError) {
			if (err.code === "P2025") {
				return ["Data tidak ditemukan", 404, false];
			}
		}

		if ("getResponse" in err) {
			const response = err.getResponse();
			console.log(response);
			return [await response.text(), response.status as StatusCode, false];
		}

		console.error(err);

		return ["Internal Server Error", 500, false];
	}

	private static _instance: ErrorService;
	static get instance(): ErrorService {
		if (!ErrorService._instance) {
			ErrorService._instance = new ErrorService();
		}
		return ErrorService._instance;
	}
}
