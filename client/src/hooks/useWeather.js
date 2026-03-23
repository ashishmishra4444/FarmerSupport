import { useQuery } from "@tanstack/react-query";
import { weatherApi } from "../services/api";

export const useWeather = (coords) =>
  useQuery({
    queryKey: ["weather-alerts", coords],
    queryFn: () => weatherApi.alerts(coords),
    enabled: Boolean(coords?.lat && coords?.lng),
    refetchInterval: 1000 * 60 * 15
  });
