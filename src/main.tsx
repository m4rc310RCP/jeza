import { createRoot } from "react-dom/client";
import "leaflet/dist/leaflet.css";
import "@jeza-v2/presentation/layouts/styles/main.css";
import { MMainProvider } from "@jeza-v2/presentation/contexts";
import { MMainScreen, MMainContainer } from "@jeza-v2/presentation/layouts";

createRoot(document.getElementById("root")!).render(
  <MMainProvider>
    <MMainContainer>
      <MMainScreen />
    </MMainContainer>
  </MMainProvider>,
);
