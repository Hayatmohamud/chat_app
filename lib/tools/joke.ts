export async function getJoke() {
  try {
    const response = await fetch(
      "https://official-joke-api.appspot.com/random_joke",
    );

    if (!response.ok) {
      throw new Error("Joke request failed");
    }

    return response.json();
  } catch {
    return {
      setup: "Why did the developer write tests?",
      punchline: "Because hope is not a strategy.",
    };
  }
}
