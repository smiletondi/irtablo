import produce from "immer";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import { toast } from "react-hot-toast";
import { useMutation, useQueryClient } from "react-query";
import { UseQueryResult, useQuery } from "react-query";

import Button from "@components/Button";
import Layout from "@components/Layout";
import { Dialog, Transition } from "@headlessui/react";
import { sendPostReq, sendReq } from "@utils/network";
import { DetailledGame, Playplayer } from "@utils/types";

interface NewRoundModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  players?: Playplayer[];
}

interface IPlayerPointsInput {
  id: string;
  points: number;
}

export async function getServerSideProps(context: any) {
  const gameId = context?.params?.id;
  const { data: gameData } = await sendReq(`/games/${gameId}`);

  return { props: { gameData } };
}

const NewRoundModal: React.FC<NewRoundModalProps> = ({
  isOpen,
  setIsOpen,
  players,
}) => {
  const initialPlayerPointsInput = players?.map((player) => ({
    id: player?.id,
    points: 0,
  }));
  const [playerPointsInput, setPlayerPointsInput] = useState(
    initialPlayerPointsInput
  );
  const router = useRouter();
  const { id: gameId } = router.query;
  const queryClient = useQueryClient();
  const launchNewRoundMutation = useMutation(
    (variables: any) => {
      return sendPostReq("/addround", variables);
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries(`/games/${gameId}`);
        setPlayerPointsInput(initialPlayerPointsInput);
      },
    }
  );
  const handlePointInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const playerId = e?.target?.getAttribute("playerid");
    const newPoints = parseInt(e?.target?.value || "0", 10);
    setPlayerPointsInput(
      produce((draft: any) => {
        draft.find(
          (elem: IPlayerPointsInput) => elem?.id === playerId
        ).points = newPoints;
      })
    );
  };
  const closeModal = () => {
    setIsOpen(false);
  };
  const saveRound = async () => {
    const input = {
      game_id: gameId,
      players: playerPointsInput,
    };
    const stringifiedInput = JSON.stringify(input);
    await launchNewRoundMutation
      .mutateAsync(stringifiedInput)
      .then(() => {
        closeModal();
      })
      .catch((data) => toast.error(`Erreur ${JSON.stringify(data)}`));
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={closeModal}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            leave="ease-in duration-200"
            leaveFrom="opacity-50"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-sm p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-kabul rounded-3xl">
              <Dialog.Title
                as="h3"
                className="text-3.3xl text-center font-bold mb-8 leading-6 "
              >
                Nouvelle partie
              </Dialog.Title>
              <div className="flex flex-col items-center space-y-2">
                {players?.map((player) => {
                  const inputValue = `${
                    playerPointsInput?.find((elem) => elem?.id === player?.id)
                      ?.points
                  }`.replace(/^0+/, "");
                  return (
                    <div
                      className="w-full px-4 py-2 rounded-lg flex items-center justify-between bg-waxFlower text-cocoaBrown"
                      {...{ key: player?.id }}
                    >
                      <h4 className="text-lg font-bold">{player?.name}</h4>
                      <input
                        className="block w-1/3 bg-blackWhite border-none rounded-lg p-2 text-cocoaBrown focus:outline-none"
                        {...{
                          type: "number",
                          placeholder: "0",
                          playerid: player?.id,
                          onChange: handlePointInput,
                          value: inputValue,
                        }}
                      />
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex justify-end items-end space-x-4">
                <Button {...{ onClick: closeModal }}>Annuler</Button>
                <Button {...{ onClick: saveRound, color: "secondary" }}>
                  Enregistrer
                </Button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

const Game: NextPage<any> = (props) => {
  const [openModal, setOpenModal] = useState(false);
  const router = useRouter();
  const { id: gameId } = router.query;
  const { data: gameData }: UseQueryResult<DetailledGame, any> = useQuery(
    `/games/${gameId}`,
    {
      initialData: props?.gameData,
      onError: (data) => toast.error(`Erreur ${JSON.stringify(data)}`),
    }
  );

  const addNewRoundHandler = () => {
    setOpenModal(true);
  };
  return (
    <Layout>
      <NewRoundModal
        {...{
          isOpen: openModal,
          setIsOpen: setOpenModal,
          players: gameData?.playingPlayers,
        }}
      />
      <div className="w-full flex flex-col text-left space-y-5">
        <div className="w-full flex justify-between">
          <h2 className="text-2.1xl">En cours de jeu</h2>
          <Button {...{ onClick: addNewRoundHandler }}>+</Button>
        </div>
        <div className="w-full py-5 px-2 rounded-lg bg-waxFlower text-cocoaBrown">
          <table className="w-full bg-blackWhite rounded-lg">
            <thead className="bg-waxFlower opacity-80">
              <tr className="font-bold text-xs uppercase tracking-wider">
                <th scope="col" className="p-3">
                  #
                </th>
                <th scope="col" className="p-3">
                  Nom
                </th>
                <th scope="col" className="p-3 text-right">
                  Points
                </th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-waxFlower divide-opacity-80">
              {!gameData?.playingPlayers ? (
                <tr>
                  <td className="p-3 whitespace-nowrap" {...{ colSpan: 3 }}>
                    Aucun joueur pour le moment
                  </td>
                </tr>
              ) : (
                gameData?.playingPlayers?.map((player, ind) => (
                  <tr className="whitespace-nowrap" {...{ key: player?.id }}>
                    <td className="p-3">{ind + 1}</td>
                    <td className="p-3">{player?.name}</td>
                    <td className="p-3 text-right">{player?.points}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="w-full flex flex-col text-left space-y-5">
        <h2 className="text-2.1xl">Hors jeu</h2>
        <div className="w-full py-5 px-2 rounded-lg bg-cocoaBrown text-blackWhite">
          <table className="w-full bg-woodyBrown rounded-lg">
            <thead className="bg-cocoaBrown opacity-70">
              <tr className="font-bold text-xs uppercase tracking-wider">
                <th scope="col" className="p-3">
                  #
                </th>
                <th scope="col" className="p-3">
                  Nom
                </th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-cocoaBrown divide-opacity-80">
              {!gameData?.outOfGamePlayers?.length ? (
                <tr>
                  <td className="p-3 whitespace-nowrap" {...{ colSpan: 2 }}>
                    Aucun joueur pour le moment
                  </td>
                </tr>
              ) : (
                gameData?.outOfGamePlayers?.map((player, ind) => (
                  <tr className="whitespace-nowrap" {...{ key: player?.id }}>
                    <td className="p-3">{ind + 1}</td>
                    <td className="p-3">{player?.name}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Game;
