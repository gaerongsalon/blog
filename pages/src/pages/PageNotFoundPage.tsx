import * as React from "react";

import { Link } from "react-router-dom";
import NavigationButtons from "../components/NavigationButtons";

export default function PageNotFoundPage() {
  return (
    <div>
      <h1>Page not found :(</h1>
      <NavigationButtons>
        <Link to="/">HOME</Link>
      </NavigationButtons>
    </div>
  );
}
