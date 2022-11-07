import React from "react"
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./components/app";

const container = document.getElementById("root");
const rootElm = createRoot(container!);
rootElm.render(   
    <BrowserRouter>
       <React.StrictMode>
           <App />
       </React.StrictMode> 
    </BrowserRouter> 
);

