import { useState } from 'react';
import { toast } from 'sonner';
import clsx from 'clsx';

import { DeleteIcon, RedoIcon } from '../icons';

import LoadingSpinner from '../loading-spinner';
import ListSkeleton from '../skeletons/list-skeleton';
import NoResults from '../no-results';
import DeleteModal from '../../components/modals/delete-modal';

import { SelectedGroceryItem } from './to-buy-tab';
import { GroceriesResponse } from '../../utils/hooks/fetch/useGetGroceries';

import { useDeleteModalState } from '../../utils/stores/useModalStore';
import { useRestore } from '../../utils/hooks/fetch/useRestore';
import { useDeleteGrocery } from '../../utils/hooks/fetch/useDeleteGrocery';

interface Props {
  data: GroceriesResponse | undefined;
  groceriesCount: number;
  isLoadingGroceries: boolean;
  refetchGrocery: () => void;
}

function BoughtTab(props: Props) {
  const { data, groceriesCount, isLoadingGroceries, refetchGrocery } = props;

  const groceries = data?.results;

  const [selectedItem, setSelectedItem] = useState<SelectedGroceryItem>(null);

  const { isOpen: isOpenDeleteModal, onToggle: onToggleDeleteModal } = useDeleteModalState();

  const {
    mutateAsync: restoreGroceryItemMutation,
    isPending: isRestoring,
    isError: isErrorRestoring,
  } = useRestore();

  const {
    mutateAsync: deleteGroceryMutation,
    isPending: isDeletingGrocery,
    isError: isErrorDeletingGrocery,
  } = useDeleteGrocery();

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
      toast.error(`Error while restoring ${selectedItem?.Name} (${error})`);
      console.error('RESTORE_GROCERY_ERROR', error);
    }
  };

  const handleDeleteGrocery = async (id: string) => {
    try {
      onToggleDeleteModal(false);

      await deleteGroceryMutation({
        id,
      });

      refetchGrocery();
      onResetDefault();
    } catch (error) {
      toast.error(`Error while deleting ${selectedItem?.Name} (${error})`);
      console.error('DELETE_GROCERY_ERROR', error);
    }
  };

  const isLoadingAll = isRestoring || isDeletingGrocery;
  const isErrorAll = isErrorRestoring || isErrorDeletingGrocery;

  return (
    <>
      <div className="flex w-full flex-col gap-y-10 p-3">
        {isLoadingGroceries && <ListSkeleton />}
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
                      isErrorAll &&
                        selectedItem?.ID === ID &&
                        'border-red-500 focus-within:border-red-500 hover:border-red-500',
                      'flex w-full flex-row items-center justify-between gap-x-3 rounded-xl border-2 p-3 focus-within:border-default-orange hover:border-default-orange'
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
