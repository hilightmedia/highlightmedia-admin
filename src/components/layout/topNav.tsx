import { topMenu } from "@/src/lib/constant";
import { Bell, ChevronDown } from "lucide-react";

const TopNav = () => {
  return (
    <nav className="w-full h-16 bg-white shadow-custom-dark px-6">
      <div className="flex items-center justify-end h-full w-full max-w-[1200px] mx-auto gap-6">
        {topMenu.map((item) => {
          return (
            <button key={item.name} className="hidden xl:inline-block ml-6 cursor-pointer">
              {item.name}
            </button>
          );
        })}
        <Bell size={20} className="cursor-pointer" />

        <div className="inline-flex items-center gap-2 cursor-pointer font-medium">
          <span className=" bg-[#8F8F8F] w-6 h-6 flex items-center text-white justify-center rounded-full">
            H
          </span>
          <span className="hidden xl:inline-block">Highlight Media</span>
          <ChevronDown className="hidden xl:inline-block" size={18} />
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
