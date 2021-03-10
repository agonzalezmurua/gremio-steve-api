import { ObjectId, SchemaDefinitionProperty } from "mongoose";

declare namespace Utils {
  type SchemaFields<T> = Record<keyof T, SchemaDefinitionProperty<undefined>>;
  type ReferencedDocument<T> = string | ObjectId | T;
}
