import { Film } from "lucide-react";

type MovieCardProps = {
  output: unknown;
};

export default function MovieCard({ output }: MovieCardProps) {
  const movie = output as {
    title?: string;
    year?: string | null;
    plot?: string | null;
    rating?: string | null;
  };

  return (
    <div className="mt-3 rounded-lg border border-rose-200 bg-rose-50 p-3 text-rose-950">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <Film className="h-4 w-4" />
        {movie.title ?? "Movie"}
      </div>
      <div className="mt-2 flex flex-wrap gap-2 text-xs text-rose-800">
        {movie.year ? <span>{movie.year}</span> : null}
        {movie.rating ? <span>IMDb {movie.rating}</span> : null}
      </div>
      <p className="mt-2 text-sm">{movie.plot ?? "No movie details available."}</p>
    </div>
  );
}
