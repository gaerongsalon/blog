import * as React from "react";

import ClappingIcon from "../assets/clapping.svg";
import styled from "styled-components";

const ArticleCounterDiv = styled.div`
  margin-top: 2rem;
  font-size: 0.95rem;
  color: #333333;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
`;
const CounterIcon = styled.img`
  width: 40px;
  height: 40px;
`;
const CounterSpan = styled.span`
  display: inline-block;
  font-weight: 400;
  letter-spacing: -0.8px;
  margin-right: 6px;
  margin-bottom: 4px;
`;

export default function ArticleCounter({ hits }: { hits: number }) {
  return (
    <ArticleCounterDiv>
      <CounterSpan>{hits} hits.</CounterSpan>
      <CounterIcon src={ClappingIcon} alt="Clapping" />
    </ArticleCounterDiv>
  );
}
