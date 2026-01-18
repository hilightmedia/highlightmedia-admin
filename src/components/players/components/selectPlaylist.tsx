import { Dispatch, SetStateAction } from "react";
import Select from "../../common/select";
import axiosInstance from "@/src/helpers/axios";
import { useQuery } from "@tanstack/react-query";
import { isEmpty } from "lodash";

interface SelectPlaylistProps {
  selected: number;
  setSelected: Dispatch<SetStateAction<number | null>>;
}

const SelectPlaylist = (props: SelectPlaylistProps) => {
  const { selected, setSelected } = props;
  const { data: playlist } = useQuery({
    queryKey: ["playlist"],
    queryFn: () =>
      axiosInstance.get("/playlist/list").then((res) => res.data.playlist),
  });
  const options = !isEmpty(playlist)
    ? playlist?.map((item: { id: number; name: string }) => ({
        label: item.name,
        value: item.id,
      }))
    : [];
  return (
    <Select
      options={options}
      value={selected}
      onChange={(value:any) => setSelected(value)}
      className="px-5 py-0.5"
      iconClassName="w-3 right-3"
    />
  );
};

export default SelectPlaylist;
