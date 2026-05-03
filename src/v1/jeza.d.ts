export {};
declare global {
  interface ILayoutProps {
    asideProps: {
      leftWith: number;
      rigthWith: number;
      maxLeftWith: number;
      maxRigthWith: number;
      asideLOpen: boolean;
      asideROpen: boolean;
    };
  }

  interface ILocation {
    latitude: number;
    longitude: number;
  }

  interface IAwaitValue<T> {
    loading: boolean;
    error?: string | null;
    value?: T | null;
  }

  type TTabView = "dashboard" | "map" | "editor" | "none" | "payments";

  type TTab = {
    id: string;
    title: string;
    icon?: "home" | "code";
    pinned?: boolean;
    view: TTabView;
    props?: Record<string, unknown>;
  };

  // HTTP
  type TMethod = "GET" | "POST";

  interface IRouteRef<M extends TMethod, Req = {}, Res = {}> {
    method: M;
    request: Req;
    response: Res;
  }

  interface IApiRoutes {
    "/api/local": IRouteRef<
      "POST",
      { nm_local: string },
      { id_local: string; nm_local: string }[]
    >;
    // "/mp/pix": IRouteRef<"POST", IPayPix["request"], IPayPix["response"]>;
  }

  type KeysByMethod<M extends TMethod> = {
    [K in keyof IApiRoutes]: IApiRoutes[K]["method"] extends M ? K : never;
  }[keyof IApiRoutes];

  type RequestOf<K extends keyof IApiRoutes> = IApiRoutes[K]["request"];

  type ResponseOf<K extends keyof IApiRoutes> = IApiRoutes[K]["response"];
}
