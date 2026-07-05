export async function webSearch(query: string) {
  try {
    const response = await fetch(
      `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      },
    );

    const html = await response.text();

    const results: Array<{ title: string; snippet: string; url: string }> = [];
    const resultRegex =
      /<a[^>]*class="result__a"[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?<a[^>]*class="result__snippet"[^>]*>([\s\S]*?)<\/a>/gi;

    let match;
    while ((match = resultRegex.exec(html)) !== null && results.length < 5) {
      const url = match[1];
      const title = match[2].replace(/<[^>]+>/g, "").trim();
      const snippet = match[3].replace(/<[^>]+>/g, "").trim();
      if (title && snippet) {
        results.push({ title, snippet, url });
      }
    }

    if (results.length === 0) {
      const simpleRegex = /<a[^>]*class="result__a"[^>]*>([\s\S]*?)<\/a>/gi;
      while (
        (match = simpleRegex.exec(html)) !== null &&
        results.length < 5
      ) {
        const title = match[1].replace(/<[^>]+>/g, "").trim();
        if (title) {
          results.push({ title, snippet: "", url: "" });
        }
      }
    }

    return {
      query,
      results,
      resultCount: results.length,
    };
  } catch {
    return {
      query,
      results: [],
      resultCount: 0,
      error: "Search failed. Please try again.",
    };
  }
}
