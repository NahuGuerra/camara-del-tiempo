import { useState } from "react";
import axios from "axios";

export default function App() {
  const [imageFile, setImageFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [location, setLocation] = useState(null);
  const [year, setYear] = useState(0);
  const [resultImage, setResultImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setPreviewURL(URL.createObjectURL(file));
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      });
    } else {
      alert("La geolocalización no está disponible");
    }
  };

  const generateImage = async () => {
    if (!location || !year) {
      alert("Falta la ubicación o el año");
      return;
    }

    setLoading(true);
    setResultImage(null);

    const prompt = `Paisaje en las coordenadas (${location.latitude}, ${location.longitude}) hace ${year} años. Vegetación y fauna correspondiente a la época. Sin elementos modernos.`;

    try {
      const response = await axios.post("/api/generate", {
        prompt,
      });
      setResultImage(response.data.image_url);
    } catch (error) {
      console.error(error);
      alert("Error al generar la imagen");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-4">Cámara del Tiempo</h1>

      <input type="file" accept="image/*" onChange={handleImageUpload} className="mb-4" />
      {previewURL && <img src={previewURL} alt="preview" className="w-64 mb-4" />}

      <button onClick={getLocation} className="bg-blue-500 px-4 py-2 rounded mb-4">Obtener ubicación</button>

      {location && (
        <div className="mb-4">
          Ubicación: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
        </div>
      )}

      <input
        type="number"
        placeholder="¿Cuántos años atrás querés ver?"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        className="text-black p-2 mb-4 w-full max-w-sm"
      />

      <button onClick={generateImage} className="bg-green-500 px-4 py-2 rounded">
        Generar imagen del pasado
      </button>

      {loading && <p className="mt-4">Generando imagen...</p>}
      {resultImage && (
        <div className="mt-6">
          <h2 className="text-xl mb-2">Resultado</h2>
          <img src={resultImage} alt="Resultado IA" className="w-full max-w-md" />
        </div>
      )}
    </div>
  );
}
