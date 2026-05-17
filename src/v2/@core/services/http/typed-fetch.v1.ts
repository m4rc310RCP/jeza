export class TypedFetch {
  private baseURL: string;
  private getToken?: () => string | null;
  private refreshToken?: () => Promise<void>;

  constructor(
    baseURL: string,
    getToken?: () => string | null,
    refreshToken?: () => Promise<void>,
  ) {
    this.baseURL = baseURL;
    this.getToken = getToken;
    this.refreshToken = refreshToken;
  }

  private async parseJson(res: Response) {
    try {
      return await res.json();
    } catch {
      return null;
    }
  }

  private createHeaders() {
    const token = this.getToken?.();

    return {
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
    };
  }

  async post<K extends KeysByMethod<"POST">>(
    route: K,
    params: RequestOf<K>,
    credentials: RequestCredentials = "include",
    retry = true,
  ): Promise<ResponseOf<K>> {
    const path = String(route).trim().replace(/^\/+/, "").replace(/\/+$/, "");

    const url = `${this.baseURL}/${path}`;

    const res = await fetch(url, {
      method: "POST",
      credentials,
      headers: this.createHeaders(),
      body: JSON.stringify(params),
    });

    const data = await this.parseJson(res);

    if (res.status === 401 && data?.code === "TOKEN_EXPIRED" && retry) {
      await this.refreshToken?.();

      return this.post(route, params, credentials, false);
    }

    if (!res.ok) {
      throw {
        status: res.status,
        code: data?.code ?? res.status,
        message: data?.message ?? data?.ds_erro ?? "Erro POST",
        data,
      };
    }

    return data;
  }
}
