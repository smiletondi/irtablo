import React from "react";
import { UseQueryResult, useQuery } from "react-query";

import RecentGame from "@components/RecentGame";
import { Games } from "@utils/types";

import { IProps } from "./types";

const RecentGamesList: React.FC<IProps> = () => {
  const { data }: UseQueryResult<Games, any> = useQuery("/games");
  const gamesData = data?.games;

  return (
    <div className="w-full text-left flex flex-col space-y-6">
      <h1 className="text-2.1xl">Recents jeux</h1>
      <div className="w-full flex flex-col space-y-3">
        {!gamesData?.length ? (
          <h1>Aucun jeu disponible</h1>
        ) : (
          gamesData?.map((elem) => (
            <RecentGame {...{ key: elem?.id, ...elem }} />
          ))
        )}
      </div>
    </div>
  );
};

export default RecentGamesList;
