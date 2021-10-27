import { format } from "date-fns";
import NLink from "next/link";
/* eslint-disable react/jsx-key */
import React, { Fragment } from "react";

import { IProps } from "./types";

const RecentGame: React.FC<IProps> = (game) => {
  const players = game.players;
  const title = game.title;
  const date = format(new Date(game.created_at), "dd-MM-yyyy HH:mm");
  return (
    <NLink {...{ href: `/game/${game?.id}` }}>
      <div className="w-full flex flex-col space-y-1 cursor-pointer">
        <div className="flex items-end space-x-5">
          <h2 className="text-xl">{title}</h2>
          <h4 className="text-xs">{date}</h4>
        </div>
        <div className="container bg-woodyBrown p-3 rounded-2xl">
          <p>
            {players?.map((elem, ind, arr) => {
              // const win = elem?.win;
              const win = false;
              return (
                <Fragment {...{ key: ind }}>
                  <span {...{ className: win ? "font-bold" : "" }}>
                    {elem?.name}
                  </span>
                  {ind !== arr?.length - 1 ? ", " : "."}
                </Fragment>
              );
            })}
          </p>
        </div>
      </div>
    </NLink>
  );
};

export default RecentGame;
