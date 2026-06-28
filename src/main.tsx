import { createRoot } from "react-dom/client";
import "leaflet/dist/leaflet.css";
import "@jeza-v2/presentation/jeza/layout/styles/main/main-style.v1.css";
import { MSwitchContainer, MAppProvider, MTabProvider, } from "@jeza-v2/presentation/jeza";

createRoot(document.getElementById("root")!).render(
	<MTabProvider>
		<MAppProvider>
			<div className="flex w-screen h-screen bg-main">
				<MSwitchContainer />
			</div>
		</MAppProvider>
	</MTabProvider>
);
