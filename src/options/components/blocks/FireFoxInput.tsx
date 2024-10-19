import React, { useState, useEffect } from "react";

type Props = {
  placeholder?: string;
  type?: string;
  defaultValue: string;
  onSaveButtonClick: (value: string) => void;
};
export const Input = (props: Props) => {
  const { placeholder = "", type = "text", defaultValue, onSaveButtonClick } = props;
  const [value, setValue] = useState<string>(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  return (
    <div>
      <input value={value} onChange={(e) => setValue(e.target.value)} placeholder={placeholder} type={type} />
      <button onClick={() => onSaveButtonClick(value)}>保存</button>
    </div>
  );
};
