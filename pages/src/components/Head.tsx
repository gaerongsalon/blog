import * as React from "react";

import { Link } from "react-router-dom";
import LogInOutButton from "./LogInOutButton";
import Logo from "../logo.png";
import NavigationButtons from "./NavigationButtons";
import hasWritePermission from "../apis/credential/hasWritePermission";
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

export default function Head() {
  return (
    <HeadDiv className="Head">
      <NavigationsDiv>
        <Link to="/">HOME</Link>
        <div>
          {hasWritePermission() ? (
            <>
              <Link to="/article/new">NEW</Link>
              {" / "}
            </>
          ) : null}
          <LogInOutButton />
        </div>
      </NavigationsDiv>
      <PageLine />
      <Link to="/">
        <LogoImage src={Logo} alt="Logo" />
      </Link>
      <PageLine />
    </HeadDiv>
  );
}
