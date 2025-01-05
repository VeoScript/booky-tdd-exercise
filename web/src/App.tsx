import { Helmet } from 'react-helmet-async';

import Header from './components/header';
import ToBuyTab from './components/tabs/to-buy-tab';
import BoughtTab from './components/tabs/bought-tab';

import { useTabStore } from './utils/stores/useTabStore';
import { useGetGroceries } from './utils/hooks/useGetGroceries';

function App() {
  const { activeTab } = useTabStore();

  const {
    data: groceries,
    isLoading,
    refetch,
  } = useGetGroceries({
    type: activeTab,
  });

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
            <ToBuyTab data={groceries} isLoadingGroceries={isLoading} refetchGrocery={refetch} />
          )}
          {activeTab === 'bought' && (
            <BoughtTab data={groceries} isLoadingGroceries={isLoading} refetchGrocery={refetch} />
          )}
        </div>
      </main>
    </>
  );
}

export default App;
