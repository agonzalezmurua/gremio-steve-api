import { HttpService, Injectable } from "@nestjs/common";
import { encode } from "querystring";

import { Beatmapset } from "./types";
import { ClientCredentialsGrantResponse } from "./types/ClientCredentialsGrantResponse";

@Injectable()
export class OsuService {
  constructor(private http: HttpService) {
    this.setAuthorizationHeaderInterceptor();
    this.setExpiredTokenInterceptor();
  }

  private headerInterceptor: number;
  private accessToken: string;

  /**
   * Does the Grant Code authentication token retrieval from the osu service
   */
  private async fetchBearerToken(): Promise<string> {
    const response = await this.http
      .post<ClientCredentialsGrantResponse>(
        "/oauth/token",
        encode({
          client_id: process.env.OSU_CLIENT_ID,
          client_secret: process.env.OSU_CLIENT_SECRET,
          grant_type: "client_credentials",
          scope: "public",
        })
      )
      .toPromise();

    return response.data.access_token;
  }

  /**
   * Sets an interceptor for osu axios client instance that maps the
   * Authorization header to every request
   *
   * @param authorization Authorization token
   * @returns Interceptor's id
   */
  private setAuthorizationHeaderInterceptor(): number {
    return this.http.axiosRef.interceptors.request.use((config) => {
      config.headers = {
        common: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      };
      return config;
    });
  }

  /**
   * Sets a respone interceptor that evaluates when the given token has expired
   * and retrieves a new interceptor / token
   */
  private async setExpiredTokenInterceptor(): Promise<void> {
    this.headerInterceptor = this.http.axiosRef.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response.status === 401) {
          if (this.headerInterceptor !== null) {
            this.http.axiosRef.interceptors.request.eject(
              this.headerInterceptor
            );
          }

          return this.fetchBearerToken().then((accessToken) => {
            this.accessToken = accessToken;
            const authorization = `Bearer ${accessToken}`;

            error.config.headers.Authorization = authorization;

            return this.http.axiosRef.request(error.config);
          });
        }
        return Promise.reject(error);
      }
    );
  }

  public determineIdFromLink(url: string): number {
    const [, id] = url.match(
      new RegExp(/https:\/\/osu\.ppy\.sh\/beatmapsets\/(\d+)/)
    );

    return Number(id);
  }

  public async findBeatmapsetById(id: number): Promise<Beatmapset> {
    const { data } = await this.http
      .get<Beatmapset>(`/api/v2/beatmapsets/${id}`)
      .toPromise();

    return data;
  }
}
