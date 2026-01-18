import { cn } from "@/src/lib/util";

function StatusPill({ status }: { status: "Online" | "Offline" }) {
  const isOnline = status === "Online";
  return (
    <div className="inline-flex items-center gap-2">
      <span
        className={cn(
          "h-2 w-2 rounded-full",
          isOnline ? "bg-emerald-500" : "bg-red-500"
        )}
      />
      <span
        className={cn(
          "text-xs font-semibold",
          isOnline ? "text-emerald-600" : "text-red-500"
        )}
      >
        {status}
      </span>
    </div>
  );
}

export default StatusPill;