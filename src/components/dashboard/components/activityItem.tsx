

export default function ActivityItem({ text, time }: { text: string; time: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-black/10 bg-white p-3">
      {/* <div className="h-9 w-9 rounded-full border border-orange-500/15 bg-[#ffe4cf]" /> */}
      <div className="flex flex-1 flex-col">
        <div className="text-[13px] font-semibold text-black/80">{text}</div>
        <div className="text-xs font-semibold text-black/40">{time}</div>
      </div>
    </div>
  );
}