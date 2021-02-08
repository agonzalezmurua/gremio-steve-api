import { SchemaDefinitionProperty } from "mongoose";

declare module Utils {
  type SchemaFields<T> = Record<keyof T, SchemaDefinitionProperty<undefined>>;
}
