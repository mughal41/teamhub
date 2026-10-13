import * as React from "react";
import { X, Calendar } from "lucide-react";

export interface CustomDateRangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (start: string, end: string) => void;
  initialStart?: string;
  initialEnd?: string;
}

export function CustomDateRangeModal({
  isOpen,
  onClose,
  onApply,
  initialStart = "2035-06-01",
  initialEnd = "2035-06-30",
}: CustomDateRangeModalProps) {
  const [start, setStart] = React.useState(initialStart);
  const [end, setEnd] = React.useState(initialEnd);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setStart(initialStart);
      setEnd(initialEnd);
      setError(null);
    }
  }, [isOpen, initialStart, initialEnd]);

  if (!isOpen) return null;

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (new Date(end) < new Date(start)) {
      setError("End date cannot precede start date.");
      return;
    }
    onApply(start, end);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-3 backdrop-blur-[2px] animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl w-full max-w-sm border border-slate-100 shadow-2xl overflow-hidden p-5 animate-in zoom-in-95 duration-200 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#EBECEB] mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-[#35BFA3]" />
            <h3 className="text-[15px] font-bold text-[#203430]">Custom Date Range</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-[#63716E] hover:bg-[#F7F7F7] cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleApply} className="space-y-3.5">
          {error && (
            <p className="text-[11px] text-[#E63D4B] font-semibold">{error}</p>
          )}

          <div>
            <label className="text-[11px] font-bold text-[#63716E] uppercase tracking-wider block mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={start}
              onChange={(e) => {
                setStart(e.target.value);
                if (error) setError(null);
              }}
              className="w-full text-[12px] font-semibold text-[#203430] bg-[#F7F7F7] border border-[#EBECEB] rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#35BFA3]"
              required
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#63716E] uppercase tracking-wider block mb-1">
              End Date
            </label>
            <input
              type="date"
              value={end}
              min={start}
              onChange={(e) => {
                setEnd(e.target.value);
                if (error) setError(null);
              }}
              className="w-full text-[12px] font-semibold text-[#203430] bg-[#F7F7F7] border border-[#EBECEB] rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#35BFA3]"
              required
            />
          </div>

          <div className="pt-3 border-t border-[#EBECEB] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 border border-[#EBECEB] bg-white hover:bg-slate-50 text-[#63716E] font-semibold text-[11px] rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#35BFA3] hover:bg-[#2ea88f] text-white font-bold text-[11px] rounded-lg cursor-pointer transition-colors"
            >
              Apply Range
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
