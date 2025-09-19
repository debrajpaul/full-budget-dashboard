export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="flex items-center justify-between p-4">
        <form className="w-full max-w-md">
          <label htmlFor="global-search" className="sr-only">
            Search
          </label>
          <input
            id="global-search"
            type="search"
            placeholder="Search..."
            className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </form>
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Import
          </button>
          <button
            type="button"
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Export
          </button>
        </div>
      </div>
    </header>
  );
}
