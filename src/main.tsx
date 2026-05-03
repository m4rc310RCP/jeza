import { createRoot } from "react-dom/client";
import "@presentation/styles/main.css";
import "leaflet/dist/leaflet.css";
import { MainContainer } from "@jeza/containers";
import { MMainScreen } from "@jeza/screens";
import { MainProvider } from "@jeza/contexts";

createRoot(document.getElementById("root")!).render(
  <MainProvider>
    <MainContainer>
      <MMainScreen />
    </MainContainer>
  </MainProvider>,
);
