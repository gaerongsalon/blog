import * as React from "react";

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
    <div className={className}>
      <label>
        {label}
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
      </label>
    </div>
  );
}
