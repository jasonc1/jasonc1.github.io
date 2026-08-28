import "./index.scss";
import App from "./App";

import { createRoot } from "react-dom/client";

// The site used HashRouter until this change, so URLs shared before it look like
// /#/rosetta. Rewrite those to real paths before the router mounts so old links —
// including /#/resume — keep working. Plain in-page anchors such as #portfolio do
// not start with "#/" and are deliberately left alone.
const legacyHash = window.location.hash;
if (legacyHash.startsWith("#/")) {
  window.history.replaceState(null, "", legacyHash.slice(1));
}

const container = document.getElementById("root");
const root = createRoot(container!); // createRoot(container!) if you use TypeScript
root.render(<App />);
