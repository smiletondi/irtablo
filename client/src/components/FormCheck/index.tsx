import type { NextPage } from "next";

import { IProps } from "./types";

const FormCheck: React.FC<IProps> = ({
  title = "My checkbox",
  box = false,
  options = [],
  ...restProps
}) => {
  return (
    <div {...restProps}>
      <h4 className="font-bold text-left">{title}</h4>
      <div className="mt-2 ml-4">
        {options?.map((elem, ind) => {
          const id = title?.replace("/W+/g", "")?.toLowerCase();
          return (
            // eslint-disable-next-line react/jsx-key
            <label
              className="inline-flex items-center w-full"
              {...{ key: ind }}
            >
              <input
                // checked
                {...{
                  type: !box ? "radio" : "checkbox",
                  className: !box ? "form-radio" : "form-checkbox",
                  name: id,
                  value: id,
                  defaultChecked: true,
                }}
              />
              <span className="ml-2 capitalize text-sm">{elem}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
};
export default FormCheck;
