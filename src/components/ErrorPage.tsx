export default function ErrorPage({ title, message }: { title?: string; message?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-6">
      <div className="max-w-lg w-full bg-white dark:bg-zinc-900 rounded-2xl shadow p-8 text-center">
        <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
          <span className="text-red-600 text-2xl">!</span>
        </div>
        <h1 className="text-2xl font-semibold mb-2">{title ?? 'Server Unavailable'}</h1>
        <p className="text-zinc-600 dark:text-zinc-300 mb-6">
          {message ?? 'We could not connect to the API. Please try again later.'}
        </p>
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="rounded-xl border px-4 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800"
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  );
}

