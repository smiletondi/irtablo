import produce from "immer";
import NImage from "next/image";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useMutation, useQueryClient } from "react-query";

import Button from "@components/Button";
import Input from "@components/Input";
import NewParticipantCard from "@components/NewParticipantCard";
import { Dialog, Transition } from "@headlessui/react";
import { sendPostReq } from "@utils/network";

import { IProps } from "./types";

const addIconSrc = "/addIcon.svg";
const gameUrlLink = "/game";

const Modal: React.FC<IProps> = ({ isOpen, setIsOpen }) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const launchNewGameMutation = useMutation(
    (variables: any) => {
      return sendPostReq("/addgame", variables);
    },
    {
      onSuccess: (data) => {
        queryClient.refetchQueries("/games");
      },
    }
  );
  const initialFOrmData = {
    title: "",
    max_points: 100,
    participant: "",
    players: [],
  };
  const [formData, setFormData] = useState(initialFOrmData);

  const closeModal = () => {
    setIsOpen(false);
  };
  const launchGame = async () => {
    const { participant, ...newGameInput } = formData;
    const stringifiedInput = JSON.stringify(newGameInput);
    const data = await launchNewGameMutation
      .mutateAsync(stringifiedInput)
      .then(({ data }) => {
        router.push(`${gameUrlLink}/${data?.id}`);
        setFormData(initialFOrmData);
        closeModal();
      })
      .catch((data) => toast.error(`Erreur ${JSON.stringify(data)}`));
  };
  const handleTitleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(
      produce((draft: any) => {
        draft.title = e?.target?.value;
      })
    );
  };
  const handleCapInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(
      produce((draft: any) => {
        draft.max_points = +e?.target?.value;
      })
    );
  };
  const handleParticipantInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(
      produce((draft: any) => {
        draft.participant = e?.target?.value;
      })
    );
  };
  const addNewPlayerHandler = () => {
    if (!formData?.participant) return;
    setFormData(
      produce((draft: any) => {
        draft.players.push(draft?.participant);
        draft.participant = "";
      })
    );
  };
  const removePlayerHandler = (player: string) => {
    if (!player || !formData?.players.find((elem: string) => elem === player))
      return;
    setFormData(
      produce((draft: any) => {
        draft.players = draft?.players?.filter(
          (elem: string) => elem !== player
        );
      })
    );
  };
  const handleParticipantInputKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e?.key === "Enter") {
      addNewPlayerHandler();
    }
  };

  useEffect(() => {
    router.prefetch(gameUrlLink);
  }, []);

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
                className="text-3.3xl text-center font-bold mb-7 leading-6 "
              >
                Nouveau jeu
              </Dialog.Title>
              <div className="mt-2 flex flex-col space-y-4 mb-2">
                <Input
                  {...{
                    title: "Titre",
                    inputProps: {
                      onChange: handleTitleInput,
                      value: formData?.title,
                    },
                  }}
                />
                <Input
                  {...{
                    title: "Cap",
                    placeholder: "Max",
                    type: "number",
                    inputProps: {
                      onChange: handleCapInput,
                      value: formData?.max_points,
                    },
                  }}
                />
                <div className="w-full flex items-end">
                  <div className="flex-1">
                    <Input
                      {...{
                        title: "Participant",
                        placeholder: "Nom du participant",
                        inputProps: {
                          onChange: handleParticipantInput,
                          value: formData?.participant,
                          onKeyPress: handleParticipantInputKeyPress,
                        },
                      }}
                    />
                  </div>
                  <button
                    className="w-10 h-10 rounded-full border bg-white hover:bg-pizazz ml-3"
                    {...{ onClick: addNewPlayerHandler }}
                  >
                    <NImage
                      {...{
                        src: addIconSrc,
                        alt: "add",
                        className: "rounded-full border-white",
                        width: 20,
                        height: 20,
                        layout: "responsive",
                      }}
                    />
                  </button>
                </div>
                <div className="container flex space-x-2 space-y-2 flex-wrap">
                  {formData?.players?.map((elem, ind) => (
                    <NewParticipantCard
                      {...{
                        key: ind,
                        name: elem,
                        handleRemove: removePlayerHandler,
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-4 flex justify-end items-end space-x-4">
                <Button {...{ onClick: closeModal }}>Annuler</Button>
                <Button lg {...{ onClick: launchGame, color: "secondary" }}>
                  Lancer
                </Button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
