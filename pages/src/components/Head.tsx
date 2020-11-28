import * as React from "react";

import { Link } from "react-router-dom";
import LogInOutButton from "./LogInOutButton";
import Logo from "../logo.png";

export default function Head() {
  return (
    <div className="Head">
      <div className="NavigationShortcuts">
        <Link to="/">Home</Link>
        <LogInOutButton />
      </div>
      <hr />
      <Link to="/">
        <img src={Logo} alt="Logo" />
      </Link>
      <hr />
    </div>
  );
}
