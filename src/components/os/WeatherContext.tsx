import { createContext, useContext } from "react";
import type { WeatherMode } from "@/components/effects/Precipitation";

export const WeatherContext = createContext<{
  weather: WeatherMode;
  setWeather: (m: WeatherMode) => void;
}>({ weather: "clear", setWeather: () => {} });

export const useWeather = () => useContext(WeatherContext);
