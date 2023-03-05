import styled from "styled-components";

export const LabelInputDiv = styled.div`
  margin-bottom: 1rem;
`;

export const StyledLabel = styled.label`
  font-weight: bold;
  text-transform: uppercase;
`;

const StyledInput = styled.input`
  width: calc(100% - 16px);
  display: block;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  padding: 6px;
  border: 1px solid #dddddd;
`;

const StyledTextarea = styled.textarea`
  width: calc(100% - 16px);
  display: block;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  padding: 6px;
  border: 1px solid #dddddd;
`;

export default function LabelInput({
  label,
  initialValue,
  setValue,
  type,
}: {
  label: string;
  initialValue: string;
  setValue: (newValue: string) => void;
  type: "text" | "textarea" | "date";
}) {
  return (
    <LabelInputDiv>
      <StyledLabel>{label}</StyledLabel>
      {type === "textarea" ? (
        <StyledTextarea
          defaultValue={initialValue}
          onChange={(e) => setValue(e.target.value)}
          rows={4}
          cols={80}
        ></StyledTextarea>
      ) : (
        <StyledInput
          type={type}
          defaultValue={initialValue}
          onChange={(e) => setValue(e.target.value)}
        />
      )}
    </LabelInputDiv>
  );
}
