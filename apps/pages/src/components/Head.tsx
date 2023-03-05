import * as React from "react";

import Helmet from "react-helmet";
import { Link } from "react-router-dom";
import Logo from "@blog/config/logo.png";
import NavigationButtons from "./NavigationButtons";
import hasWritePermission from "../apis/credential/hasWritePermission";
import metadata from "@blog/config/lib/metadata";
import scroll from "../utils/scroll";
import styled from "styled-components";

const HeadDiv = styled.div`
  width: 100vw;
  text-align: center;
`;

const NavigationsDiv = styled(NavigationButtons)`
  margin: 1vh 4vw;
  text-align: left;
`;

const PageLine = styled.hr`
  margin: 0;
  border: 0;
  border-bottom: 1px solid #eeeeee;
`;

const LogoImage = styled.img`
  margin: 2vh 0;
`;

const LazyLogInOutButton = React.lazy(() => import("./LogInOutButton"));

export default function Head() {
  return (
    <HeadDiv className="Head">
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>
      <NavigationsDiv>
        <Link to="/" onClick={() => scroll({ key: "articles" }).reset()}>
          HOME
        </Link>
        <div>
          {hasWritePermission() ? (
            <>
              <Link to="/article/new">NEW</Link>
              {" / "}
            </>
          ) : null}
          <React.Suspense fallback={<div></div>}>
            <LazyLogInOutButton />
          </React.Suspense>
        </div>
      </NavigationsDiv>
      <PageLine />
      <Link to="/" onClick={() => scroll({ key: "articles" }).reset()}>
        <LogoImage src={Logo} alt="Logo" height={150} width={150} />
      </Link>
      <PageLine />
    </HeadDiv>
  );
}
