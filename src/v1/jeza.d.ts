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
	
	type TTabView =
		| "dashboard"
		| "map"
		| "editor"
		| "none"
		| "payments";
	
	type TTab = {
		id: string;
		title: string;
		icon?: "home" | "code";
		pinned?: boolean;
		view: TTabView;
		props?: Record<string, unknown>;
	};

}
