import React from "react";

type InputCanEditType = {
  label: string;
  icon: React.ReactNode;
  text: string;
  canEdit: boolean;
};

const InputCanEdit = ({ label, icon, text, canEdit }: InputCanEditType) => {
  return (
    <div className="flex flex-col gap-1 text-pse-gray">
      <label className="text-pse-black-light">{label}</label>
      <div
        className={`${
          !canEdit && "cursor-not-allowed"
        } flex bg-pse-gray/30 p-2 rounded-md`}
      >
        {icon}
        <input
          value={text}
          disabled={true}
          className={`${
            !canEdit && "cursor-not-allowed"
          } outline-none bg-transparent w-auto`}
        />
        {canEdit && (
          <button className=" ml-auto text-pse-green-second">Thay đổi</button>
        )}
      </div>
    </div>
  );
};

export default InputCanEdit;
