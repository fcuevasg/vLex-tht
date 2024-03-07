import React from "react";
import logo from "./logo.svg";
import "./App.scss";
import JurisdictionList from "./components/List/List";

function App() {
  return (
    <div className="h-screen flex items-start justify-center text-center bg-background">
      <JurisdictionList></JurisdictionList>
    </div>
  );
}

export default App;
