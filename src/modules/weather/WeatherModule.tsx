import { useState } from "react";
import { RestAdapter } from "@/core/adapters/rest";

type WeatherQuery = { latitude: string; longitude: string };
type WeatherResult = {
  current_weather?: { temperature: number; windspeed: number };
};

const weatherApi = new RestAdapter<WeatherQuery, WeatherResult>(
  "open-meteo",
  (query) =>
    `https://api.open-meteo.com/v1/forecast?latitude=${query.latitude}&longitude=${query.longitude}&current_weather=true`,
);

export function WeatherModule() {
  const [label, setLabel] = useState("Noch nicht geladen");

  return (
    <div className="stack">
      <p className="hint">Beispiel für ein Modul mit eigener REST-Schnittstelle.</p>
      <button
        type="button"
        className="touch-btn"
        onClick={async () => {
          const result = await weatherApi.query({
            latitude: "52.52",
            longitude: "13.405",
          });
          const weather = result.current_weather;
          setLabel(
            weather
              ? `${weather.temperature} °C · Wind ${weather.windspeed} km/h`
              : "Keine Wetterdaten",
          );
        }}
      >
        Berlin laden
      </button>
      <p>{label}</p>
    </div>
  );
}
