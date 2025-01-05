import { useState } from 'react';
import clsx from 'clsx';

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

  const onResetDefault = () => {
    setSelectedItem(null);
    onToggleDeleteModal(false);
  };

  const handleRestore = async (id: string) => {
    try {
      await restoreGroceryItemMutation({
        id,
      });

      refetchGrocery();
      onResetDefault();
    } catch (error) {
      console.error('RESTORE_GROCERY_ERROR', error);
    }
  };

  const handleDeleteGrocery = async (id: string) => {
    try {
      await deleteGroceryMutation({
        id,
      });

      refetchGrocery();
      onResetDefault();
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
        {groceriesCount === 0 && (
          <div className="mt-10">
            <NoResults title="Nothing here yet..." />
          </div>
        )}
        {!isLoadingGroceries && groceries && (
          <>
            {groceries.length > 0 && (
              <div className="flex w-full flex-col gap-y-3">
                <h3 className="text-default-gray">{groceriesCount} items</h3>
                {groceries.map(({ ID, Name }) => (
                  <div
                    key={ID}
                    className={clsx(
                      isLoadingAll && selectedItem?.ID === ID && 'bg-neutral-100 text-neutral-400',
                      'flex w-full flex-row items-center justify-between gap-x-3 rounded-xl border p-3 hover:border-default-orange'
                    )}
                  >
                    <div className="flex gap-x-3">
                      {isLoadingAll && selectedItem?.ID === ID && (
                        <LoadingSpinner className="h-5 w-5" />
                      )}
                      <span>{Name}</span>
                    </div>
                    <span className="flex flex-row items-center gap-x-3">
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
        onClose={onResetDefault}
        onSubmit={() => handleDeleteGrocery(String(selectedItem?.ID))}
      />
    </>
  );
}

export default BoughtTab;
