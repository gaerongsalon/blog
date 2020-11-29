import * as React from "react";

import styled from "styled-components";

const LabelInputDiv = styled.div`
  margin-bottom: 1rem;
`;

const StyledLabel = styled.label`
  font-weight: bold;
  text-transform: uppercase;
`;

export default function LabelInput({
  label,
  initialValue,
  setValue,
  textarea,
  className,
}: {
  label: string;
  initialValue: string;
  setValue: (newValue: string) => void;
  textarea?: boolean;
  className?: string;
}) {
  return (
    <LabelInputDiv className={className}>
      <StyledLabel>{label}</StyledLabel>
      {textarea ? (
        <textarea
          defaultValue={initialValue}
          onChange={(e) => setValue(e.target.value)}
          rows={4}
          cols={80}
        ></textarea>
      ) : (
        <input
          type="text"
          defaultValue={initialValue}
          onChange={(e) => setValue(e.target.value)}
        />
      )}
    </LabelInputDiv>
  );
}
