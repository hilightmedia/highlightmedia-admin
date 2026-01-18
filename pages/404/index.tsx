import EmptyState from "@/src/components/common/emptyState";
import SiteLayout from "@/src/components/layout/siteLayout";

export default function PageNotFound() {
  return (
    <SiteLayout>
      <div className="w-full h-[calc(100%-200px)]  flex flex-col items-center justify-center overflow-hidden">
        <EmptyState image="/404.svg" message="Page not found" />
      </div>
    </SiteLayout>
  );
}
