import { QueryObserverResult, RefetchOptions, useQuery } from '@tanstack/react-query';
import { Tabs } from '../../stores/useTabStore';

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
    max_page: number;
    page: number;
    results_per_page: number;
    total_count: number;
  };
};

type QueryParams = {
  data: GroceriesResponse | undefined;
  isLoading: boolean;
  error: unknown;
  refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<Response, Error>>;
};

async function getGroceries(params: Params) {
  const { type, page = 1, limit = 20 } = params;

  const response = await fetch(
    `${API_URL}/v1/items?type=${type}&page=${page}&limit=${limit}&is_deleted=false`
  );

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
}

export const useGetGroceries = (params: Params): QueryParams => {
  const { type, page, limit } = params;

  const { data, isLoading, error, refetch } = useQuery({
    queryFn: () => getGroceries(params),
    queryKey: ['groceries', type, page, limit],
    enabled: !!params.type,
    gcTime: 0,
  });

  return {
    data,
    isLoading,
    error,
    refetch,
  };
};
