import { SquarePen, GripVertical } from "lucide-react";

interface Props {
  reorderMode: boolean;
  setReorderMode: React.Dispatch<React.SetStateAction<boolean>>;
  setCheckedItems: React.Dispatch<React.SetStateAction<number[]>>;
}

const ToggleMode = (props: Props) => {
  const { reorderMode, setReorderMode, setCheckedItems } = props;

  return (
      <div
        className="relative inline-flex items-center rounded-md border border-black/10 bg-[#FFE8DF] p-1"
        role="tablist"
        aria-label="Table mode toggle"
      >
        <span
          className={`absolute top-1 bottom-1 w-[44px] rounded-md bg-[#EA6535] transition-transform duration-200 ease-out ${
            reorderMode ? "translate-x-[44px]" : "translate-x-0"
          }`}
          aria-hidden="true"
        />

        <button
          type="button"
          onClick={() => setReorderMode(false)}
          className={`relative z-10 flex h-9 w-[44px] items-center justify-center rounded-md transition-colors duration-200 ${
            !reorderMode ? "text-white" : "text-[#EA6535]"
          }`}
          aria-pressed={!reorderMode}
          title="Select mode"
        >
          <SquarePen size={18} />
        </button>

        <button
          type="button"
          onClick={() => {
            setCheckedItems([]);
            setReorderMode(true);
          }}
          className={`relative z-10 flex h-9 w-[44px] items-center justify-center rounded-md transition-colors duration-200 ${
            reorderMode ? "text-white" : "text-[#EA6535]"
          }`}
          aria-pressed={reorderMode}
          title="Reorder mode"
        >
          <GripVertical size={18} />
        </button>
      </div>
  );
};

export default ToggleMode;