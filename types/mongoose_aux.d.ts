import { SchemaDefinitionProperty } from "mongoose";

declare namespace Utils {
  type SchemaFields<T> = Record<keyof T, SchemaDefinitionProperty<undefined>>;
}
