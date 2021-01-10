import * as React from "react";

import { Link } from "react-router-dom";
import NavigationButtons from "./NavigationButtons";

export default function PageNotFound() {
  return (
    <div>
      <h1>Page not found :(</h1>
      <NavigationButtons>
        <Link to="/">HOME</Link>
      </NavigationButtons>
    </div>
  );
}
