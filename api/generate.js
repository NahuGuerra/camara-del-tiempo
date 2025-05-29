export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      console.error("❌ Prompt no recibido");
      return res.status(400).json({ error: "Falta el prompt" });
    }

    console.log("✅ Prompt recibido:", prompt);

    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        prompt,
        n: 1,
        size: "1024x1024",
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error("❌ Error desde OpenAI:", data.error.message);
      return res.status(500).json({ error: data.error.message });
    }

    console.log("✅ Imagen generada:", data.data[0].url);
    return res.status(200).json({ image_url: data.data[0].url });

  } catch (err) {
    console.error("❌ Error inesperado:", err);
    return res.status(500).json({ error: "Error interno al generar la imagen" });
  }
}
