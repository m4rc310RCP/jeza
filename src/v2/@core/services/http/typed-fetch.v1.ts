export class TypedFetch {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async parseJson(res: Response) {
    try {
      return await res.json();
    } catch {
      return null;
    }
  }

  async get<K extends KeysByMethod<"GET">>(
    route: K,
    params: RequestOf<K>,

  ): Promise<ResponseOf<K>> {
    const path = String(route).trim().replace(/^\/+/, "").replace(/\/+$/, "");

    const url = new URL(`${this.baseURL}/${path}`);
    Object.entries(params).forEach(([k, v]) =>
      url.searchParams.append(k, String(v)),
    );

    const res = await fetch(url.toString());

    const data = await this.parseJson(res);

    if (!res.ok) {
      throw new Error(data?.message || res.statusText || "Erro GET");
    }

    return data;
  }

  async post<K extends KeysByMethod<"POST">>(
    route: K,
		params: RequestOf<K>,
		credentials: RequestCredentials = "same-origin"
  ): Promise<ResponseOf<K>> {
    const path = String(route).trim().replace(/^\/+/, "").replace(/\/+$/, "");
    const url = `${this.baseURL}/${path}`;
    const res = await fetch(url, {
      method: "POST",
			credentials,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...params,
      }),
    });

    const data = await this.parseJson(res);

    if (!res.ok) {
      throw {
        status: res.status,
        code: data?.cd_status ?? res.status,
        message:
          data?.ds_erro ?? data?.message ?? res.statusText ?? "Erro POST",
        data,
      };
    }

    return data;
  }
}
