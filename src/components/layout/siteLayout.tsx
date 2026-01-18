import SiteNav from "./siteNav";
import TopNav from "./topNav";

const SiteLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-screen flex overflow-x-hidden overflow-y-auto">
      <SiteNav />
      <main className="w-full xl:w-[calc(100%-280px)] xl:ml-[280px] h-full">
        <TopNav />
        {children}
      </main>
    </div>
  );
};

export default SiteLayout;
