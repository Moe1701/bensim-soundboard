interface TalkbackButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export function TalkbackButton({ label, isActive, onClick }: TalkbackButtonProps) {
  return (
    <button 
      onClick={onClick}
      className={`min-h-16 rounded-xl font-bold text-lg transition-all ${
        isActive 
          ? 'bg-indigo-50 text-indigo-700 border-2 border-indigo-200' 
          : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border-2 border-transparent'
      }`}
    >
      {label}
    </button>
  );
}