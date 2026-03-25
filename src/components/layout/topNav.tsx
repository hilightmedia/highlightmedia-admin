import { topMenu,menu  } from "@/src/lib/constant";
import { Bell, ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

const TopNav = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
      const [openLogs, setOpenLogs] = useState(false);

    const { pathname } = useRouter();
    useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);
    const activeClass = (active: boolean) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg transition ${
      active ? "bg-[#EA6535] text-white" : "text-gray-700 hover:bg-gray-100"
    }`;

  const childClass = (active: boolean) =>
    `text-sm font-medium transition ${
      active ? "text-[#EA6535]" : "text-gray-600 hover:text-gray-900"
    }`;
    const router = useRouter();
  return (
    <nav className="w-full h-16 bg-white shadow-custom-dark px-6 sticky top-0 z-50">
      <div className="flex items-center justify-between xl:justify-end h-full w-full max-w-7xl mx-auto gap-6">
        {topMenu.map((item) => {
          return (
            <button key={item.name} className="hidden xl:inline-block ml-6 cursor-pointer" onClick={()=>router.push(item.path)}>
              {item.name}
            </button>
          );
        })}
        <button
            className="xl:hidden inline-flex items-center justify-center"
            onClick={() => setMobileOpen((p) => !p)}
            aria-label="Open menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        <span className="flex items-center gap-6">
          <Bell size={20} className="cursor-pointer" />

        <div className="inline-flex items-center gap-2 cursor-pointer font-medium">
          <span className=" bg-[#8F8F8F] w-6 h-6 flex items-center text-white justify-center rounded-full">
            H
          </span>
          <span className="hidden xl:inline-block">Hilight Media</span>
          <ChevronDown className="hidden xl:inline-block" size={18} />
        </div>
        </span>
      </div>
      {mobileOpen && (
        <div className="xl:hidden fixed inset-0 z-50">
          <button
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          />
          <div className="absolute left-0 top-0 h-full w-[85%] max-w-[320px] bg-white shadow-xl p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">Menu</span>
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <X size={22} />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {menu.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path || pathname.startsWith(item.path + "/");

                if (item.children) {
                  return (
                    <div key={item.name} className="flex flex-col gap-2">
                      <button
                        onClick={() => setOpenLogs((p) => !p)}
                        className={`flex items-center justify-between w-full px-3 py-2 rounded-lg transition ${
                          isActive ? "bg-[#EA6535] text-white" : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <Icon size={20} color={isActive ? "#fff" : "#000000"} />
                          <span className="font-medium">{item.name}</span>
                        </span>
                        <ChevronDown
                          size={18}
                          className={`transition-transform ${openLogs ? "rotate-180" : "rotate-0"}`}
                        />
                      </button>

                      {openLogs && (
                        <div className="ml-8 flex flex-col gap-2 border-l border-gray-200 pl-4">
                          {item.children.map((child) => {
                            const childActive = pathname === child.path;
                            return (
                              <Link
                                href={child.path}
                                key={child.name}
                                className={childClass(childActive)}
                              >
                                {child.name}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link href={item.path} key={item.name} className={activeClass(isActive)}>
                    <Icon size={20} color={isActive ? "#fff" : "#000000"} />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default TopNav;
