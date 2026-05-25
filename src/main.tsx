import { createRoot } from "react-dom/client";
import "leaflet/dist/leaflet.css";
import "@jeza-v2/presentation/layouts/styles/main.css";
import {
  MMainProvider,
  MAuthProvider,
  MAppProvider,
} from "@jeza-v2/presentation/contexts";
import { MMainContainer, MSwithScreen } from "@jeza-v2/presentation/layouts";

createRoot(document.getElementById("root")!).render(
  <MMainProvider>
    <MAuthProvider>
      <MAppProvider>
        <MMainContainer>
          <MSwithScreen />
        </MMainContainer>
      </MAppProvider>
    </MAuthProvider>
  </MMainProvider>,
);
