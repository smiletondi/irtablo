import NImage from "next/image";
import React, { useState } from "react";

import Modal from "@components/Modal";

import { IProps } from "./types";

const cardTable = "/card-table.png";

const CTA: React.FC<IProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => {
    setIsOpen(true);
  };
  return (
    <div className="w-full flex flex-col items-center space-y-4">
      <div className="w-full">
        <NImage
          {...{
            src: cardTable,
            alt: "table",
            className: "rounded-lg",
            width: 272,
            height: 168,
            layout: "responsive",
          }}
        />
      </div>
      <button
        {...{
          className:
            "bg-waxFlower shadow-3xl text-cocoaBrown flex mx-auto p-2 text-3.3xl w-48 rounded-2xl border-0 focus:outline-none",
          onClick: openModal,
        }}
      >
        Nouveau jeu
      </button>
      <Modal
        {...{
          isOpen,
          setIsOpen,
        }}
      />
    </div>
  );
};

export default CTA;
