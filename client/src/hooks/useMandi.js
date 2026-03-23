import { useQuery } from "@tanstack/react-query";
import { mandiApi } from "../services/api";

export const useMandi = () =>
  useQuery({
    queryKey: ["mandi-prices"],
    queryFn: mandiApi.list,
    refetchInterval: 1000 * 60 * 30
  });
