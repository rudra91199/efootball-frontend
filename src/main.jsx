import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import Router from "./Router/Router"
import InAppBrowserWarning from "./Layouts/InAppBrowserWarning"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <InAppBrowserWarning>
      <Router />
    </InAppBrowserWarning>
  </React.StrictMode>
)
