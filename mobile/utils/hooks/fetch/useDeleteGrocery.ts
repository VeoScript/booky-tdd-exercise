import { useMutation } from '@tanstack/react-query';
import { Groceries } from './useGetGroceries';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

type Payload = {
  id: string;
};

export type MutationParams = {
  mutate: (payload: Payload) => void;
  mutateAsync: (payload: Payload) => Promise<Groceries>;
  isPending: boolean;
  isError: boolean;
};

export const deleteGrocery = async (payload: Payload): Promise<Groceries> => {
  const { id } = payload;

  const url = `${API_URL}/v1/items/${id}/delete`;

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete grocery list');
  }

  return response.json();
};

export const useDeleteGrocery = (): MutationParams => {
  const { mutate, mutateAsync, isPending, isError } = useMutation({
    mutationFn: deleteGrocery,
    mutationKey: ['deleteGrocery'],
  });

  return { mutate, mutateAsync, isPending, isError };
};
