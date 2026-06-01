import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// encode/decode ---------------------
const encode = (value: unknown) => {
	return btoa(encodeURIComponent(JSON.stringify(value)));
};

const decode = <T>(value: string): T => {
	return JSON.parse(decodeURIComponent(atob(value)));
};
// --------------------- encode/decode 

export interface ILayoutStore {
	// ------------------------
	token:string|null;
	setToken: (token: ILayoutStore['token']) => void;
	// ------------------------
	appState: 'ON-LINE'|'SIGNIN'|'SCREENSHOT';
	setAppState: (appState:ILayoutStore['appState']) => void;
	// ------------------------
	authStatus: 'REGISTERED'|'UNREGISTERED'|'AUTHORIZED' | 'UNAUTHORIZED' | 'TOKEN_EXPIRED';
	setAuthStatus: (authStatus:ILayoutStore['authStatus']) => void;
	// ------------------------
	registerId: string|null;
	setRegisterId: (registered:ILayoutStore['registerId']) => void;
	// ------------------------
	setAppTitle: (title: string) => void;
	// ------------------------
}

export const useStoreV1 = create<ILayoutStore>()(
	persist((set)=>({
		token: null,
		setToken(token) {
			set({token});
		},
		appState: 'SCREENSHOT',
		setAppState(appState) {
			set({appState});
		},
		registerId: null,
		setRegisterId(registerId) {
			set({registerId});
		},
		setAppTitle(title) {
			document.title = title;
		},
		authStatus: 'UNREGISTERED',
		setAuthStatus(authStatus) {
			set({authStatus});
		},
	}), {
		name: '_jeza_v1_hash_',
		storage: createJSONStorage(()=>({
			getItem(name) {
				const value = localStorage.getItem(name);
          if (!value) return null;
          return decode(value);
			},
			setItem(name, value) {
          localStorage.setItem(name, encode(value));
        },

			removeItem(name) {
				localStorage.removeItem(name);
			},
		}))
	})
);