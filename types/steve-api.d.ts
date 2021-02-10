import { IUserDocument } from "../schemas/user";

declare namespace Steve {
  export type LoggedUser = Pick<
    IUserDocument,
    "id" | "osu_id" | "name" | "avatar_url"
  >;
}
