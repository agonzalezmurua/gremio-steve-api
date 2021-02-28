import { IUserDocument } from "../schemas/user";

declare namespace Steve {
  export type LoggedUserTokenPayload = Pick<
    IUserDocument,
    "id" | "osu_id" | "name" | "avatar_url"
  >;
  export type AuthenticationResponse = {
    token_type: "Bearer";
    expires_in: number;
    access_token: string;
    refresh_token?: string;
  };
}
