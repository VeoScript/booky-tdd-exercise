import { Helmet } from 'react-helmet-async';

import Header from './components/header';
import ToBuyTab from './components/tabs/to-buy-tab';
import BoughtTab from './components/tabs/bought-tab';
import PaginationBar from './components/pagination-bar';

import { useTabStore } from './utils/stores/useTabStore';
import { useGetGroceries } from './utils/hooks/fetch/useGetGroceries';
import { useQueryParams } from './utils/hooks/useQueryParams';
import { toTop } from './utils/functions/scrollTo';

export type FilterParams = {
  page?: string;
};

function App() {
  const { activeTab } = useTabStore();

  const { params, updateParams } = useQueryParams<FilterParams>();

  const { page: currentPage } = params;

  const {
    data: groceries,
    isLoading,
    refetch,
  } = useGetGroceries({
    page: Number(currentPage),
    type: activeTab,
  });

  const groceriesCount = Number(groceries?.metadata?.total_count);
  const groceriesCurrentPage = Number(groceries?.metadata?.page);
  const groceriesMaxPage = Number(groceries?.metadata?.max_page);

  const handleChangePage = (page: number) => {
    toTop('app-container');

    updateParams({
      page: String(page),
    });
  };

  return (
    <>
      <Helmet>
        <title>Booky TDD Exercise</title>
      </Helmet>
      <main className="flex h-screen w-full flex-col items-center bg-white font-varela md:bg-neutral-100">
        <div
          id="app-container"
          className="relative my-0 h-full w-full max-w-xl overflow-y-auto rounded-none border-0 bg-white md:my-10 md:rounded-xl md:border-2 md:border-default-gray"
        >
          <Header />
          {activeTab === 'to-buy' && (
            <ToBuyTab
              data={groceries}
              groceriesCount={groceriesCount}
              isLoadingGroceries={isLoading}
              refetchGrocery={refetch}
            />
          )}
          {activeTab === 'bought' && (
            <BoughtTab
              data={groceries}
              groceriesCount={groceriesCount}
              isLoadingGroceries={isLoading}
              refetchGrocery={refetch}
            />
          )}
          {!isLoading && groceriesCount !== 0 && (
            <div className="pb-5">
              <PaginationBar
                currentPage={groceriesCurrentPage}
                totalPages={groceriesMaxPage}
                onPageChange={handleChangePage}
              />
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default App;
