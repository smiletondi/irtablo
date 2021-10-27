import type { NextPage } from "next";

import { IProps } from "./types";

const Button: React.FC<IProps> = ({
  children,
  color = "primary",
  lg,
  ...restProps
}) => {
  // const id = title?.replace("/W+/g", "")?.toLowerCase();
  const colorIsPrimary = color === "primary";
  return (
    <button
      {...{
        ...restProps,
        type: "button",
        className: `inline-flex justify-center ${
          !!lg ? "px-6 py-2 text-2.1xl" : "px-3 py-1 h-9/12 text-xl"
        } font-medium border border-white rounded-2xl ${
          colorIsPrimary
            ? "bg-azureWeb text-woodyBrown"
            : "bg-waxFlower text-cocoaBrown"
        } hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 + ${
          !restProps?.className ? "" : restProps?.className
        }`,
      }}
    >
      {children}
    </button>
  );
};
export default Button;
