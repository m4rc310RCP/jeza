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

  // interface IAwaitValue<T> {
  //   loading: boolean;
  //   error?: string | null;
  //   value?: T | null;
  // }

  interface IAwaitValue<T, E = TypedFetchError> {
    loading: boolean;
    error?: E | null;
    value?: T | null;
  }

  type TTabView = "dashboard" | "map" | "editor" | "none" | "payments" | "deliveries";

  type TTab = {
    id: string;
    title: string;
    icon?:  TTabView;
    pinned?: boolean;
    view: TTabView;
    props?: Record<string, unknown>;
		loading?:boolean;
  };

  interface ISideControl {
    isOpen: boolean;
    width: number;
    max: number;
  }

  // ---------------------------- //
  interface IUserApp {
    numberPlate: string;
    usename: string;
    name: string;
    token?: string;
  }
  interface IUserAuth extends IUser {
    vl_senha: string;
    in_cpf: boolean;
    in_versenha: boolean;
    in_docvalido: boolean;
    in_gravar: boolean;
  }

  interface IUser {
    nr_cpfcnpj: string;
    ds_email: string;
    nm_cliente: string;
    in_bloqueado: boolean;
  }

	interface IUserBalance {
		qt_entregas: number;
		vl_saldo: number;
	}

  // ---------------------------- //
	interface ILayoutPreferences {
		tabs:{
			dashboard:{
				showBalance: boolean;
			}
		}
	}
  // ---------------------------- //
  interface IApiResponse<T = unknown> {
    in_sucesso: boolean;
    cd_erro?: number;
    ds_mensagem?: string;
    data?: T;
  }

  interface IApiError<T = unknown> {
    in_sucesso: boolean;
    cd_erro: number;
    ds_mensagem: string;
    data?: T;
  }
  // ---------------------------- //
  type TScreen = "startup" | "signin" | "home";
  // ---------------------------- //
  interface IScreenData {
    app: {
      title: string;
    };

    startup: {
      loading: true;
      message: string;
    };
  }

  // HTTP
  type TMethod = "GET" | "POST" | "PUT" | "DELETE";
  // type TRequestCredentials = RequestCredentials;

  interface IRouteRef<M extends TMethod, Req = unknown, Res = unknown> {
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

    "/jeza/login": IRouteRef<
      "POST",
      { nr_cpfcnpj: string; vl_senha: string },
      { ds_token: string; tp_token: "Bearer" }
    >;

    "/jeza/refresh": IRouteRef<
      "POST",
      undefined,
      { ds_token: string; tp_token: "Bearer" }
    >;

    "/geza/test": IRouteRef<"POST", undefined, { in_valido: boolean }>;

    "/jeza/user": IRouteRef<"POST", undefined, IUserAuth>;
    "/jeza/user/refresh/balances": IRouteRef<"POST", undefined, IUserBalance>;
    // "/mp/pix": IRouteRef<"POST", IPayPix["request"], IPayPix["response"]>;
  }

  type KeysByMethod<M extends TMethod> = {
    [K in keyof IApiRoutes]: IApiRoutes[K]["method"] extends M ? K : never;
  }[keyof IApiRoutes];

  type CredentialOf<K extends keyof IApiRoutes> = IApiRoutes[K]["credentials"];

  type RequestOf<K extends keyof IApiRoutes> = IApiRoutes[K]["request"];

  type ResponseOf<K extends keyof IApiRoutes> = IApiRoutes[K]["response"];

  //------------
  interface JwtPayload {
    exp: number;
    iat?: number;
    [key: string]: unknown;
  }
  //------------
  interface IWsUserChannels {
    handleSignoutResponse: {
      ds_motivo: string;
    };

    // statusResponse: {};

		wsBalanceChannels: {
			"jeza:balance_brodcast": {
				ds_maessage: string
			}
		}
		& { [key: `jeza:user_balances_${string}`]: IUserBalance }
		;

    wsAuthChannels: {
      "jeza:log": { ds_log: string };
    } 
		& {
      [
        key: `jeza:siginout_${string}`
      ]: IWsUserChannels["handleSignoutResponse"];
    } 
		& { [key: `jeza:status_${string}`]: IWsUserChannels["statusResponse"] }
  }
  //------------
}
