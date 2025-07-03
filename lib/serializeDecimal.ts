import { Decimal } from "@prisma/client/runtime/library";

export function serializeDecimal<T>(obj: T): T {
  return JSON.parse(
    JSON.stringify(obj, (_key, value) => {
      if (value instanceof Decimal) {
        return Number(value);
      }
      return value;
    })
  );
}
