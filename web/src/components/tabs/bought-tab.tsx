import NoResults from '../no-results';

import { DeleteIcon, RedoIcon } from '../icons';

import LoadingSpinner from '../loading-spinner';

import { GroceriesResponse } from '../../utils/hooks/useGetGroceries';
import { useRestore } from '../../utils/hooks/useRestore';
import { useState } from 'react';

interface Props {
  data: GroceriesResponse | undefined;
  isLoadingGroceries: boolean;
  refetchGrocery: () => void;
}

function BoughtTab(props: Props) {
  const { data, isLoadingGroceries, refetchGrocery } = props;

  const groceries = data?.results;
  const groceriesCount = data?.metadata?.total_count;

  const [loadingID, setLoadingID] = useState('');

  const { mutateAsync: restoreGroceryItemMutation, isPending: isRestoring } =
    useRestore();

  const handleRestore = async (id: string) => {
    try {
      setLoadingID(id);

      await restoreGroceryItemMutation({
        id,
      });

      refetchGrocery();
      setLoadingID('');
    } catch (error) {
      console.error('CREATE_GROCERY_ERROR', error);
    }
  };

  const isLoadingAll = isRestoring;

  return (
    <div className="flex h-full w-full flex-col gap-y-10 p-3">
      {isLoadingGroceries && (
        <div className="flex w-full flex-col items-center justify-center">
          <h2 className="text-2xl font-bold text-default-orange/50">
            Loading...
          </h2>
        </div>
      )}
      {!isLoadingGroceries && groceries && (
        <>
          {groceries.length === 0 && <NoResults title="Nothing here yet..." />}
          {groceries.length > 0 && (
            <div className="flex w-full flex-col gap-y-3">
              <h3 className="text-default-gray">{groceriesCount} items</h3>
              {groceries.map(({ ID, Name }) => (
                <div
                  key={ID}
                  className="flex w-full flex-row items-center justify-between gap-x-3 rounded-xl border p-3 hover:border-default-orange"
                >
                  <span>{Name}</span>
                  <span className="flex flex-row items-center gap-x-3">
                    {isLoadingAll && loadingID === ID && (
                      <LoadingSpinner className="h-5 w-5" />
                    )}
                    {loadingID !== ID && (
                      <>
                        <button
                          type="button"
                          aria-label="Restore button"
                          onClick={() => handleRestore(ID)}
                        >
                          <RedoIcon className="h-6 w-6 text-default-gray hover:text-green-500 hover:opacity-50" />
                        </button>
                        <button
                          disabled={isRestoring}
                          type="button"
                          aria-label="Delete button"
                        >
                          <DeleteIcon className="h-5 w-5 text-default-gray hover:text-default-red hover:opacity-50" />
                        </button>
                      </>
                    )}
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default BoughtTab;
