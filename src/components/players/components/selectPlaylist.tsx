"use client";

import Select from "../../common/select";

type Option = { label: string; value: number };

interface SelectPlaylistProps {
  options: Option[];
  value: number | "";
  onChange: (value: number) => void;
}

const SelectPlaylist = ({ options, value, onChange }: SelectPlaylistProps) => {
  return (
    <Select
      options={options}
      value={value}
      onChange={(val: any) => onChange(Number(val))}
      className="px-5 py-0.5"
      iconClassName="w-3 right-3"
    />
  );
};

export default SelectPlaylist;
