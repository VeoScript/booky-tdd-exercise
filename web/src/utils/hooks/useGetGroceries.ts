import {
  QueryObserverResult,
  RefetchOptions,
  useQuery,
} from '@tanstack/react-query';
import { Tabs } from '../stores/useTabStore';

const API_URL = import.meta.env.VITE_API_URL;

type Params = {
  type: Tabs;
  page?: number;
  limit?: number;
};

export type Groceries = {
  ID: string;
  Name: string;
  CreatedAt: string;
  DeletedAt: string;
  BoughtAt: string;
  UpdatedAt: string;
};

export type GroceriesResponse = {
  results: Groceries[];
  metadata: {
    page: number;
    results_per_page: number;
    total_count: number;
  };
};

type QueryParams = {
  data: GroceriesResponse | undefined;
  isLoading: boolean;
  error: unknown;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<Response, Error>>;
};

async function getGroceries(params: Params) {
  const { type, page = 1, limit } = params;

  const response = await fetch(
    `${API_URL}/v1/items?type=${type}&page=${page}&limit=${limit}`
  );

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
}

export const useGetGroceries = (params: Params): QueryParams => {
  const { data, isLoading, error, refetch } = useQuery({
    queryFn: () => getGroceries(params),
    queryKey: ['groceries', params],
    enabled: !!params.type,
  });

  return {
    data,
    isLoading,
    error,
    refetch,
  };
};
