import { useMutation } from '@tanstack/react-query';
import { Groceries } from './useGetGroceries';

const API_URL = import.meta.env.VITE_API_URL;

type Payload = {
  name: string;
};

export type MutationParams = {
  mutate: (payload: Payload) => void;
  mutateAsync: (payload: Payload) => Promise<Groceries>;
  isPending: boolean;
  isError: boolean;
};

export const createGrocery = async (payload: Payload): Promise<Groceries> => {
  const url = `${API_URL}/v1/items`;

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to create grocery list');
  }

  return response.json();
};

export const useCreateGrocery = (): MutationParams => {
  const { mutate, mutateAsync, isPending, isError } = useMutation({
    mutationFn: createGrocery,
    mutationKey: ['createGrocery'],
  });

  return { mutate, mutateAsync, isPending, isError };
};
