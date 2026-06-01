import { createRoot } from "react-dom/client";
import "leaflet/dist/leaflet.css";
import '@jeza-v2/presentation/jeza/layouts/styles/main.v1.css'
import { MMainContainer, MSwitchScreen } from '@jeza-v2/presentation/jeza/layouts'
import { MAuthContextProvider, MAppProvider } from '@jeza-v2/presentation/jeza/contexts'

createRoot(document.getElementById("root")!).render(
	<MAppProvider>
		<MAuthContextProvider>
			<MMainContainer>
				<MSwitchScreen />
			</MMainContainer>
		</MAuthContextProvider>
	</MAppProvider>
);
