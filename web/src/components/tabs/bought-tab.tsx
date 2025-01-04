import NoResults from '../no-results';
import { DeleteIcon, RedoIcon } from '../icons';

import { GroceriesResponse } from '../../utils/hooks/useGetGroceries';

interface Props {
  data: GroceriesResponse | undefined;
  isLoadingGroceries: boolean;
  refetchGrocery: () => void;
}

function BoughtTab(props: Props) {
  const { data, isLoadingGroceries } = props;

  const groceries = data?.results;
  const groceriesCount = data?.metadata?.total_count;

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
                    <button type="button" aria-label="Done button">
                      <RedoIcon className="h-6 w-6 text-default-gray hover:text-green-500 hover:opacity-50" />
                    </button>
                    <button type="button" aria-label="Delete button">
                      <DeleteIcon className="h-5 w-5 text-default-gray hover:text-default-red hover:opacity-50" />
                    </button>
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
