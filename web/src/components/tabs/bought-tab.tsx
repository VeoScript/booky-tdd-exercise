import { useState } from 'react';

import { DeleteIcon, RedoIcon } from '../icons';

import LoadingSpinner from '../loading-spinner';
import NoResults from '../no-results';
import DeleteModal from '../../components/modals/delete-modal';

import { SelectedGroceryItem } from './to-buy-tab';
import { GroceriesResponse } from '../../utils/hooks/useGetGroceries';

import { useDeleteModalState } from '../../utils/stores/useModalStore';
import { useRestore } from '../../utils/hooks/useRestore';
import { useDeleteGrocery } from '../../utils/hooks/useDeleteGrocery';

interface Props {
  data: GroceriesResponse | undefined;
  isLoadingGroceries: boolean;
  refetchGrocery: () => void;
}

function BoughtTab(props: Props) {
  const { data, isLoadingGroceries, refetchGrocery } = props;

  const groceries = data?.results;
  const groceriesCount = data?.metadata?.total_count;

  const [selectedItem, setSelectedItem] = useState<SelectedGroceryItem>(null);

  const { isOpen: isOpenDeleteModal, onToggle: onToggleDeleteModal } = useDeleteModalState();

  const { mutateAsync: restoreGroceryItemMutation, isPending: isRestoring } = useRestore();
  const { mutateAsync: deleteGroceryMutation, isPending: isDeletingGrocery } = useDeleteGrocery();

  const handleRestore = async (id: string) => {
    try {
      await restoreGroceryItemMutation({
        id,
      });

      refetchGrocery();
      setSelectedItem(null);
    } catch (error) {
      console.error('RESTORE_GROCERY_ERROR', error);
    }
  };

  const handleDeleteGrocery = async (id: string) => {
    try {
      await deleteGroceryMutation({
        id,
      });

      setSelectedItem(null);
      refetchGrocery();
    } catch (error) {
      console.error('DELETE_GROCERY_ERROR', error);
    }
  };

  const isLoadingAll = isRestoring || isDeletingGrocery;

  return (
    <>
      <div className="flex h-full w-full flex-col gap-y-10 p-3">
        {isLoadingGroceries && (
          <div className="flex w-full flex-col items-center justify-center">
            <h2 className="text-2xl font-bold text-default-orange/50">Loading...</h2>
          </div>
        )}
        {groceriesCount === 0 && <NoResults title="Nothing here yet..." />}
        {!isLoadingGroceries && groceries && (
          <>
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
                      {isRestoring && selectedItem?.ID === ID && (
                        <LoadingSpinner className="h-5 w-5" />
                      )}
                      {!isRestoring && (
                        <button
                          disabled={isLoadingAll}
                          type="button"
                          aria-label="Restore button"
                          onClick={() => {
                            setSelectedItem({
                              ID,
                              Name,
                            });
                            handleRestore(ID);
                          }}
                        >
                          <RedoIcon className="h-6 w-6 text-default-gray hover:text-green-500 hover:opacity-50" />
                        </button>
                      )}
                      {isDeletingGrocery && selectedItem?.ID === ID && (
                        <LoadingSpinner className="h-5 w-5" />
                      )}
                      {!isDeletingGrocery && (
                        <button
                          disabled={isLoadingAll}
                          type="button"
                          aria-label="Delete button"
                          onClick={() => {
                            setSelectedItem({
                              ID,
                              Name,
                            });
                            onToggleDeleteModal(true);
                          }}
                        >
                          <DeleteIcon className="h-5 w-5 text-default-gray hover:text-default-red hover:opacity-50" />
                        </button>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <DeleteModal
        itemName={selectedItem?.Name}
        isOpen={isOpenDeleteModal}
        onClose={() => {
          setSelectedItem(null);
          onToggleDeleteModal(false);
        }}
        onSubmit={() => handleDeleteGrocery(String(selectedItem?.ID))}
      />
    </>
  );
}

export default BoughtTab;
