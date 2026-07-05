function getOmdbApiKey() {
  const value = process.env.OMDB_API_KEY;

  if (!value) {
    return null;
  }

  if (!value.startsWith("http")) {
    return value;
  }

  try {
    return new URL(value).searchParams.get("apikey");
  } catch {
    return value;
  }
}

export async function getMovie(title: string) {
  const apiKey = getOmdbApiKey();

  if (!apiKey) {
    return {
      title,
      year: null,
      plot: "OMDB_API_KEY is not configured.",
      rating: null,
      poster: null,
    };
  }

  const response = await fetch(
    `http://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${encodeURIComponent(apiKey)}`,
  );

  if (!response.ok) {
    return {
      title,
      year: null,
      plot: "Movie information could not be loaded.",
      rating: null,
      poster: null,
    };
  }

  const data = await response.json();

  if (data.Response === "False") {
    return {
      title,
      year: null,
      plot: data.Error ?? "Movie was not found.",
      rating: null,
      poster: null,
    };
  }

  return {
    title: data.Title ?? title,
    year: data.Year ?? null,
    plot: data.Plot ?? null,
    rating: data.imdbRating ?? null,
    poster: data.Poster && data.Poster !== "N/A" ? data.Poster : null,
  };
}
