import clsx from 'clsx';

import { useTabStore } from '../utils/stores/useTabStore';

function Header() {
  const { activeTab, setActiveTab } = useTabStore();

  const handleChangeTab = () => {
    const scrollableContainer = document.getElementById('app-container');

    if (scrollableContainer) {
      scrollableContainer.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (activeTab === 'to-buy') {
      setActiveTab('bought');
    } else if (activeTab === 'bought') {
      setActiveTab('to-buy');
    }
  };

  return (
    <div className="sticky top-0 z-10 flex w-full flex-col items-center gap-y-5 bg-white pt-5">
      <h1 className="text-xl font-bold text-default-orange">Grocery List</h1>
      <div className="flex w-1/2 flex-row items-center justify-center">
        <button
          type="button"
          aria-label="To Buy Tab"
          className={clsx(
            activeTab === 'to-buy' &&
              'border-default-orange text-default-orange',
            'upercase w-full border-b-2 pb-2'
          )}
          onClick={handleChangeTab}
        >
          To Buy
        </button>
        <button
          type="button"
          aria-label="Bought Tab"
          className={clsx(
            activeTab === 'bought' &&
              'border-default-orange text-default-orange',
            'upercase w-full border-b-2 pb-2'
          )}
          onClick={handleChangeTab}
        >
          Bought
        </button>
      </div>
    </div>
  );
}

export default Header;
