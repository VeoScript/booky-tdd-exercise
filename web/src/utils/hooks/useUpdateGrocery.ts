import { useMutation } from '@tanstack/react-query';
import { Groceries } from './useGetGroceries';

const API_URL = import.meta.env.VITE_API_URL;

type Payload = {
  id: string;
  name: string;
};

export type MutationParams = {
  mutate: (payload: Payload) => void;
  mutateAsync: (payload: Payload) => Promise<Groceries>;
  isPending: boolean;
  isError: boolean;
};

export const updateGrocery = async (payload: Payload): Promise<Groceries> => {
  const { id, name } = payload;

  const url = `${API_URL}/v1/items/${id}`;

  const response = await fetch(url, {
    method: 'PATCH',
    body: JSON.stringify({
      name,
    }),
    headers: {
      'Content-type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to update grocery list');
  }

  return response.json();
};

export const useUpdateGrocery = (): MutationParams => {
  const { mutate, mutateAsync, isPending, isError } = useMutation({
    mutationFn: updateGrocery,
    mutationKey: ['updateGrocery'],
  });

  return { mutate, mutateAsync, isPending, isError };
};
