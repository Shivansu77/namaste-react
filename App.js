import React from "react";
import ReactDOM from "react-dom/client";

const heading=React.createElement("h1",{id:"heading"},"Namaste React 🚀");
const root=ReactDOM.createRoot(document.getElementById("root"));
const jsxHeading= (<h1 id="heading" tabIndex="0" className="heading">
    Namaste React2 🚀</h1>)
root.render(jsxHeading);
//jsx