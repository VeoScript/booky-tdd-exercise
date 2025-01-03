import { Helmet } from 'react-helmet-async';

import Header from './components/header';
import ToBuyTab from './components/tabs/to-buy-tab';
import BoughtTab from './components/tabs/bought-tab';

import { useTabStore, Tabs } from './utils/stores/useTabStore';

function App() {
  const { activeTab } = useTabStore();

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
          {activeTab === Tabs.TO_BUY && <ToBuyTab />}
          {activeTab === Tabs.BOUGHT && <BoughtTab />}
        </div>
      </main>
    </>
  );
}

export default App;
