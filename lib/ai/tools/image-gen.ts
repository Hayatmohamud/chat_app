export async function generateImage(prompt: string) {
  try {
    const encoded = encodeURIComponent(prompt);
    const seed = Math.abs(
      Array.from(prompt).reduce(
        (sum, char) => (sum * 31 + char.charCodeAt(0)) | 0,
        7,
      ),
    );
    const imageUrl = `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=1024&model=flux&enhance=true&nologo=true&seed=${seed}`;

    const response = await fetch(imageUrl, { method: "GET" });

    if (!response.ok) {
      return {
        success: false,
        error: "Image generation failed.",
        prompt,
      };
    }

    return {
      success: true,
      imageUrl,
      prompt,
    };
  } catch {
    return {
      success: false,
      error: "Image generation failed.",
      prompt,
    };
  }
}
