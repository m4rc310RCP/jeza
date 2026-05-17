import { useLayoutStore } from "@jeza-v2/core/data/zustand/zustand-storage.v1";

import { TypedFetchError } from "./type-fetch-error.v1";

type RefreshListener = () => void | Promise<void>;

export const isApiError = (error: unknown): error is TypedFetchError => {
  return error instanceof TypedFetchError;
};

export class TypedFetch {
  private baseURL: string;

  private refreshListener?: RefreshListener;

  constructor(baseURL: string) {
    this.baseURL = baseURL.trim().replace(/\/+$/, "");
  }

  // ------------------------------------

  onRefresh(listener: RefreshListener) {
    this.refreshListener = listener;
  }

  // ------------------------------------

  private normalizePath(path: string) {
    return path.trim().replace(/^\/+/, "").replace(/\/+$/, "");
  }

  // ------------------------------------

  private getHeaders(token?: string): HeadersInit {
    const state = useLayoutStore.getState();

    const authToken = token ?? state.token;

    return {
      "Content-Type": "application/json",

      ...(authToken && {
        Authorization: `Bearer ${authToken}`,
      }),
    };
  }

  // ------------------------------------

  private async parseResponse<T>(res: Response): Promise<IApiResponse<T>> {
    try {
      const json = (await res.json()) as IApiResponse<T>;

      return json;
    } catch {
      throw new TypedFetchError({
        cd_erro: res.status,

        ds_mensagem: "Resposta inválida do servidor",
      });
    }
  }

  // ------------------------------------

  private validateResponse<T>(res: Response, response: IApiResponse<T>): T {
    if (!res.ok) {
      throw new TypedFetchError({
        cd_erro: response.cd_erro ?? res.status,

        ds_mensagem: response.ds_mensagem ?? res.statusText,

        data: response.data,
      });
    }

    if (!response.in_sucesso) {
      throw new TypedFetchError({
        cd_erro: response.cd_erro ?? res.status,

        ds_mensagem: response.ds_mensagem ?? "Erro na requisição",

        data: response.data,
      });
    }

    if (response.data === undefined) {
      throw new TypedFetchError({
        cd_erro: res.status,

        ds_mensagem: "Payload não encontrado",
      });
    }

    return response.data;
  }

  // ------------------------------------

  private async request<TResponse>(
    url: string,
    options: RequestInit,
    retry = true,
  ): Promise<TResponse> {
    const res = await fetch(url, options);

    // refresh token
    if (res.status === 401 && retry) {
      await this.refreshListener?.();

      return this.request<TResponse>(url, options, false);
    }

    const response = await this.parseResponse<TResponse>(res);

    return this.validateResponse(res, response);
  }

  // ------------------------------------

  async get<K extends KeysByMethod<"GET">>(
    route: K,
    params?: RequestOf<K>,
    credentials: RequestCredentials = "same-origin",
    token?: string,
  ): Promise<ResponseOf<K>> {
    const path = this.normalizePath(String(route));

    const url = new URL(`${this.baseURL}/${path}`);

    Object.entries(params ?? {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });

    return this.request<ResponseOf<K>>(url.toString(), {
      method: "GET",

      credentials,

      headers: this.getHeaders(token),
    });
  }

  // ------------------------------------

  async post<K extends KeysByMethod<"POST">>(
    route: K,
    params?: RequestOf<K>,
    credentials: RequestCredentials = "same-origin",
    token?: string,
  ): Promise<ResponseOf<K>> {
    const path = this.normalizePath(String(route));

    const url = `${this.baseURL}/${path}`;

    return this.request<ResponseOf<K>>(url, {
      method: "POST",

      credentials,

      headers: this.getHeaders(token),

      body: JSON.stringify(params ?? {}),
    });
  }

  // ------------------------------------

  async put<K extends KeysByMethod<"PUT">>(
    route: K,
    params?: RequestOf<K>,
    credentials: RequestCredentials = "same-origin",
    token?: string,
  ): Promise<ResponseOf<K>> {
    const path = this.normalizePath(String(route));

    const url = `${this.baseURL}/${path}`;

    return this.request<ResponseOf<K>>(url, {
      method: "PUT",

      credentials,

      headers: this.getHeaders(token),

      body: JSON.stringify(params ?? {}),
    });
  }

  // ------------------------------------

  async delete<K extends KeysByMethod<"DELETE">>(
    route: K,
    params?: RequestOf<K>,
    credentials: RequestCredentials = "same-origin",
    token?: string,
  ): Promise<ResponseOf<K>> {
    const path = this.normalizePath(String(route));

    const url = `${this.baseURL}/${path}`;

    return this.request<ResponseOf<K>>(url, {
      method: "DELETE",

      credentials,

      headers: this.getHeaders(token),

      body: JSON.stringify(params ?? {}),
    });
  }
}
