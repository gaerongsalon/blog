import * as React from "react";

import Logo from "../logo.png";

export default function Head() {
  return (
    <div className="Head">
      <div className="NavigationShortcuts">
        <a href="/">Home</a>
      </div>
      <hr />
      <img src={Logo} alt="Logo" />
      <hr />
    </div>
  );
}
