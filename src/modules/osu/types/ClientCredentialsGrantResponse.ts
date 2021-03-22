export type ClientCredentialsGrantResponse = {
  /** The type of token, this should always be Bearer. */
  token_type: string;

  /** The number of seconds the token will be valid for. */
  expires_in: number;

  /** The access token. */
  access_token: string;
};
