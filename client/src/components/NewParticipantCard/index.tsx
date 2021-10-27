import NImage from "next/image";

import { IProps } from "./types";

const cancelIconSrc = "/cancelIcon.svg";

const NewParticipantCard: React.FC<IProps> = ({
  name = "filana",
  handleRemove,
  ...restProps
}) => {
  return (
    <div className="flex items-center justify-between max-w-5 bg-cinderella text-woodyBrown font-semibold text-xs rounded-lg">
      <span className="mx-2 ">{name}</span>
      <span
        className="bg-waxFlower w-5 rounded-lg cursor-pointer"
        {...{ onClick: () => handleRemove(name) }}
      >
        <NImage
          {...{
            src: cancelIconSrc,
            alt: "cancel icon",
            width: 16,
            height: 16,
            layout: "responsive",
          }}
        />
      </span>
    </div>
  );
};
export default NewParticipantCard;
