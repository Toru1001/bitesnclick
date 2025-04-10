import React from "react";

interface FilterButtonsProps {
  text: string;
  onClick: () => void | Promise<void>;
  isActive: boolean;
}

const FilterButtons: React.FC<FilterButtonsProps> = ({
  text,
  onClick,
  isActive,
}) => {
  return (
    <button
      className={`border-2 border-[#E19517] w-fit rounded-sm py-1 px-4 cursor-pointer font-medium 
        ${isActive ? "text-amber-50 bg-[#E19517]" : "text-[#E19517]"}`}
      onClick={onClick}
    >
      <span className="text-xs md:text-sm">{text}</span>
    </button>
  );
};

export default FilterButtons;