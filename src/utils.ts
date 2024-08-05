import { intlFormatDistance } from "date-fns";
import {} from "date-fns/locale";

export function average(numbers: number[]): number {
  return numbers.reduce((a, b) => a + b, 0) / numbers.length;
}

export function duration(start: Date, end: Date): string {
  return intlFormatDistance(start, end, {
    numeric: "always",
  });
}
