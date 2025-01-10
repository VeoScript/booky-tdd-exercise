import { useMutation } from '@tanstack/react-query';
import { Groceries } from './useGetGroceries';

const API_URL = import.meta.env.VITE_API_URL;

type Payload = {
  id: string;
};

export type MutationParams = {
  mutate: (payload: Payload) => void;
  mutateAsync: (payload: Payload) => Promise<Groceries>;
  isPending: boolean;
  isError: boolean;
};

export const restore = async (payload: Payload): Promise<Groceries> => {
  const { id } = payload;

  const url = `${API_URL}/v1/items/${id}/restore`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to restore grocery list');
  }

  return response.json();
};

export const useRestore = (): MutationParams => {
  const { mutate, mutateAsync, isPending, isError } = useMutation({
    mutationFn: restore,
    mutationKey: ['restore'],
  });

  return { mutate, mutateAsync, isPending, isError };
};
