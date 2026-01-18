"use client";

import { menu } from "@/src/lib/constant";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

const SiteNav = () => {
  const router = useRouter();
  const pathname = router.pathname;
  const [openLogs, setOpenLogs] = useState(false);

  // Auto open Play Logs when user is inside /play-logs/*
  useEffect(() => {
    if (pathname.startsWith("/play-logs")) {
      setOpenLogs(true);
    }
  }, [pathname]);

  return (
    <aside className="w-[280px] bottom-0 top-0 fixed z-50 p-6 hidden xl:flex flex-col gap-6 shadow-custom-dark bg-white">
      {/* LOGO */}
      <span className="w-full inline-flex items-center gap-2">
        <Image
          alt="logo"
          width={500}
          height={500}
          className="w-[40px]"
          src="/logo.svg"
        />
        <h1 className="text-2xl font-bold bg-gold-orange-text bg-clip-text text-transparent">
          Hilight Media
        </h1>
        {/* <PanelLeftClose /> */}
      </span>   
      <nav className="flex flex-col gap-3">
        <p className="text-sm text-gray-500 font-medium">Menu</p>
        {menu.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.path || pathname.startsWith(item.path + "/");

          // ✅ Accordion item
          if (item.children) {
            return (
              <div key={item.name} className="flex flex-col gap-2">
                {/* Accordion Header */}
                <button
                  onClick={() => setOpenLogs((prev) => !prev)}
                  className={`flex items-center justify-between w-full px-3 py-2 rounded-lg transition ${
                    isActive
                      ? "bg-[#EA6535] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon size={20} color={isActive ? "#fff" : "#000000"}/>
                    <span className="font-medium">{item.name}</span>
                  </span>

                  <ChevronDown
                    size={18}
                    className={`transition-transform ${
                      openLogs ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>

                {/* Accordion Children */}
                {openLogs && (
                  <div className="ml-8 flex flex-col gap-2 border-l border-gray-200 pl-4">
                    {item.children.map((child) => {
                      const childActive = pathname === child.path;

                      return (
                        <Link
                          href={child.path}
                          key={child.name}
                          className={`text-sm font-medium transition ${
                            childActive
                              ? "text-[#EA6535]"
                              : "text-gray-600 hover:text-gray-900"
                          }`}
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

          // ✅ Normal menu item
          return (
            <Link
              href={item.path}
              key={item.name}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                isActive
                  ? "bg-[#EA6535] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon size={20} color={isActive ? "#fff" : "#000000"}/>
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default SiteNav;
