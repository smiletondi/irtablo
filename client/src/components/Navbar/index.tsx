import NLink from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

import { IProps } from "./types";

const homePath = "/";

const Navbar: React.FC<IProps> = () => {
  const router = useRouter();
  useEffect(() => {
    router.prefetch(homePath);
  }, []);
  return (
    <header className="w-full flex items-center justify-between h-20">
      <NLink {...{ href: homePath }}>
        <h1 className="font-risque text-pizazz text-4.3xl cursor-pointer">
          irTablo
        </h1>
      </NLink>
    </header>
  );
};

export default Navbar;
