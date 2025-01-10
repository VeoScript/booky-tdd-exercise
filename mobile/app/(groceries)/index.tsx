import MainLayout from '@/layouts/main-layout';
import ToBuyTab from '@/components/tabs/to-buy-tab';
import BoughtTab from '@/components/tabs/bought-tab';

import { useFiltersState } from '@/utils/stores/useFiltersStore';
import { useGetGroceries } from '@/utils/hooks/fetch/useGetGroceries';

export default function Groceries() {
  const { filters } = useFiltersState();

  const { type, page, limit } = filters;

  const {
    data: groceries,
    isLoading,
    refetch,
  } = useGetGroceries({
    page,
    type,
    limit,
  });

  return (
    <MainLayout>
      {type === 'to-buy' && (
        <ToBuyTab data={groceries} isLoadingGroceries={isLoading} refetchGrocery={refetch} />
      )}
      {type === 'bought' && (
        <BoughtTab data={groceries} isLoadingGroceries={isLoading} refetchGrocery={refetch} />
      )}
    </MainLayout>
  );
}
