import { SmilePlus } from "lucide-react";

type JokeCardProps = {
  output: unknown;
};

export default function JokeCard({ output }: JokeCardProps) {
  const joke = output as {
    setup?: string;
    punchline?: string;
  };

  return (
    <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-950">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <SmilePlus className="h-4 w-4" />
        Joke
      </div>
      <p className="mt-2 text-sm">{joke.setup ?? "Here is a joke."}</p>
      {joke.punchline ? (
        <p className="mt-1 text-sm font-semibold">{joke.punchline}</p>
      ) : null}
    </div>
  );
}
