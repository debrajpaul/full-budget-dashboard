type TopbarProps = {
  title: string;
};


export default function Topbar({ title }: TopbarProps) {
  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-white">
      <div>
        <h2 className="text-primary text-2xl font-semibold mb-1">{title}</h2>
        <p className="text-sm text-gray-500">{today}</p>
      </div>
      <div className="flex items-center space-x-4">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
          U
        </div>
      </div>
    </header>
  );
}
