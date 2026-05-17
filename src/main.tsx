import { createRoot } from "react-dom/client";
import "leaflet/dist/leaflet.css";
import "@jeza-v2/presentation/layouts/styles/main.css";
import { MMainProvider, MAuthProvider } from "@jeza-v2/presentation/contexts";
import { MMainContainer, MSwithScreen } from "@jeza-v2/presentation/layouts";

createRoot(document.getElementById("root")!).render(
  <MMainProvider>
    <MAuthProvider>
      <MMainContainer>
        <MSwithScreen />
      </MMainContainer>
    </MAuthProvider>
  </MMainProvider>,
);
