import type { NextPage } from "next";

import { IProps } from "./types";

const Input: React.FC<IProps> = ({
  title = "label",
  placeholder,
  type = "text",
  onChangeHandler = () => {},
  inputProps,
  ...restProps
}) => {
  const id = title?.replace("/W+/g", "")?.toLowerCase();
  placeholder = !placeholder ? id : placeholder;
  return (
    <div {...restProps}>
      <label
        className="block font-bold text-base capitalize text-left mb-2"
        {...{ htmlFor: id }}
      >
        {title}
      </label>
      <input
        className="block w-full shadow appearance-none border rounded-lg p-2 text-woodyBrown focus:outline-none focus:shadow-outline"
        {...{ id, type, placeholder, ...inputProps }}
      />
    </div>
  );
};
export default Input;
