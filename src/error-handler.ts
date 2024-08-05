import type { ErrorHandler } from "hono";
import { HTTPException } from "hono/http-exception";

const errorHandler: ErrorHandler = (err, c) => {
  if (err instanceof HTTPException) {
    return c.json(
      {
        data: null,
        error: err.message,
      },
      err.status
    );
  } else {
    return c.json(
      {
        data: null,
        error: "Terjadi kesalahan",
      },
      500
    );
  }
};

export default errorHandler;
