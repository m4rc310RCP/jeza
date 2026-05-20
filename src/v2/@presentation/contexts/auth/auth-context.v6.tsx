import {
	createContext,
	type FC,
	type PropsWithChildren,
	useEffect,
	useMemo,
	useState
} from "react";

// import { useLayoutStore } from "@jeza-v2/core/data/zustand/zustand-storage.v1";
import {
	createUpdateValue
} from "@jeza-v2/core/utils/general.v1";
import { useLayoutStore } from "@jeza-v2/core/data/zustand/zustand-storage.v1";
import { usePersistentScheduler } from "@jeza-v2/core/schedules/schedule-control-time-context.v1";
import { apiMP } from "@jeza-v2/core/index";
import { sanitizeDocument } from "@jeza-v2/core/utils/documents.v1";
import { getTokenExpiration } from "@jeza-v2/core/utils/general.v1";
import { isApiError } from "@jeza-v2/core/services/http/typed-fetch.v2";
import { ws, createSiginoutChannel } from "@jeza-v2/core/services/ws/geza-ws.v1";




// --------------------------------------------------------
// Types
// --------------------------------------------------------

interface IMAuthValues {
	oc_autenticado: IAwaitValue<IUserAuth>;
  nr_cpfcnpj: string | null;
  st_screen: TScreen;

  fn_login: (auth: IUserAuth) => void;
  fn_logout: () => void;
  fn_refresh: () => void;
}

// --------------------------------------------------------
// Default
// --------------------------------------------------------

const defaultValue: IMAuthValues = {
  // oc_autenticado: {
  //   loading: true,
  // },
} as IMAuthValues;

// --------------------------------------------------------
// Context
// --------------------------------------------------------

const MAuthContext = createContext<IMAuthValues>(defaultValue);

// --------------------------------------------------------
// Provider
// --------------------------------------------------------

const MAuthProvider: FC<PropsWithChildren> = ({ children }) => {
	const [value, setValue] = useState<IMAuthValues>(defaultValue);
	const update = useMemo(() => createUpdateValue(setValue), []);
	// //--------------------------------------------------------

	// const token = useLayoutStore(s => s.token);
	const setToken = useLayoutStore(s => s.setToken);
	// const refreshTokenRef = useRef(false);


	const setScreen = useLayoutStore(s => s.setScreen);
	const setDateExpiration = useLayoutStore(s => s.setDateExpiration);
	const dateExpiration = useLayoutStore(s => s.dateExpiration);
	const user = useLayoutStore(s => s.user);
	const setUser = useLayoutStore(s => s.setUser);
	const cpfCnpj = useLayoutStore(s => s.cpfCnpj);
	const setCpfCnpj = useLayoutStore(s => s.setCpfCnpj);


	useEffect(()=>{
		if (cpfCnpj){
			const channel = createSiginoutChannel(cpfCnpj);
			ws.on(channel, ({ds_motivo})=> {
				console.log(ds_motivo);
			});
		}
	}, [cpfCnpj])

	useEffect(()=>{
		if (user){
			const cc = sanitizeDocument(user.nr_cpfcnpj);
			setCpfCnpj(cc);
			setScreen('home');
		}else {
			setScreen('signin');
		}
	}, [user, setScreen, setCpfCnpj]);

	usePersistentScheduler({
		nextDate: dateExpiration,
		onRun() {
			const run = async () => {
				// if (loginRef.current) return;
				try {
					const res = await apiMP.post('/geza/refresh', undefined, 'include');
					const t = res.ds_token;
					setToken(t);
					setDateExpiration(getTokenExpiration(t));
					const user_ = await apiMP.post('/geza/user');
					setUser(user_);
				} catch (error) {
					if (isApiError(error) && error.cd_erro === 401){
						setUser(null);
						setToken(null);
						setDateExpiration(null);
					}
				}
			}
			run();
		},
	});

	useEffect(()=>{
		update('fn_login', async ({ nr_cpfcnpj, vl_senha })=>{
			try {
				update('oc_autenticado', { loading: true });
				const cc = sanitizeDocument(nr_cpfcnpj);
				const resp = await apiMP.post('/geza/signin', {
					nr_cpfcnpj:cc, vl_senha
				}, 'include');
				
				const t = resp.ds_token;
				setToken(t);
				setDateExpiration(getTokenExpiration(t));
				const user = await apiMP.post('/geza/user');
				setUser(user);
			} catch (error) {
				update('oc_autenticado', { loading: false, error: isApiError(error) ? error.ds_mensagem : error});
			}
		});

		update('fn_logout', async () => {
			setUser(null);
			setToken(null);
			setDateExpiration(null);
		});

	}, [update, setDateExpiration, setToken, setUser]);

	//--------------------------------------------------------
  return (
    <MAuthContext.Provider value={value}>{children}</MAuthContext.Provider>
  );
};

// --------------------------------------------------------
// Exports
// --------------------------------------------------------

export { MAuthContext, MAuthProvider };
