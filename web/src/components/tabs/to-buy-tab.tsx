import { useState } from 'react';
import { toast } from 'sonner';
import clsx from 'clsx';

import { CheckIcon, ClearIcon, DeleteIcon, EditIcon } from '../icons';

import LoadingSpinner from '../loading-spinner';
import InputWithButton from '../inputs/input-with-button';
import ListSkeleton from '../skeletons/list-skeleton';
import NoResults from '../no-results';
import DeleteModal from '../../components/modals/delete-modal';

import { useDeleteModalState } from '../../utils/stores/useModalStore';

import { GroceriesResponse } from '../../utils/hooks/fetch/useGetGroceries';
import { useCreateGrocery } from '../../utils/hooks/fetch/useCreateGrocery';
import { useUpdateGrocery } from '../../utils/hooks/fetch/useUpdateGrocery';
import { useUpdateToBuy } from '../../utils/hooks/fetch/useUpdateToBuy';
import { useDeleteGrocery } from '../../utils/hooks/fetch/useDeleteGrocery';

interface Props {
  data: GroceriesResponse | undefined;
  groceriesCount: number;
  isLoadingGroceries: boolean;
  refetchGrocery: () => void;
}

export type SelectedGroceryItem = {
  ID: string;
  Name: string;
} | null;

function ToBuyTab(props: Props) {
  const { data, groceriesCount, isLoadingGroceries, refetchGrocery } = props;

  const groceries = data?.results;

  const [groceryName, setGroceryName] = useState('');
  const [selectedItem, setSelectedItem] = useState<SelectedGroceryItem>(null);
  const [editingID, setEditingID] = useState<string | null>(null);
  const [editedName, setEditedName] = useState('');

  const { isOpen: isOpenDeleteModal, onToggle: onToggleDeleteModal } = useDeleteModalState();

  const {
    mutateAsync: createGroceryMutation,
    isPending: isCreatingGrocery,
    isError: isErrorCreatingGrocery,
  } = useCreateGrocery();
  const {
    mutateAsync: updateGroceryMutation,
    isPending: isUpdatingGrocery,
    isError: isErrorUpdatingGrocery,
  } = useUpdateGrocery();
  const {
    mutateAsync: updateToBuyMutation,
    isPending: isUpdatingToBuy,
    isError: isErrorUpdatingToBuy,
  } = useUpdateToBuy();
  const {
    mutateAsync: deleteGroceryMutation,
    isPending: isDeletingGrocery,
    isError: isErrorDeletingGrocery,
  } = useDeleteGrocery();

  const onResetDefault = () => {
    setSelectedItem(null);
    onToggleDeleteModal(false);
  };

  const handleCreateGrocery = async () => {
    try {
      await createGroceryMutation({
        name: groceryName,
      });

      setGroceryName('');
      refetchGrocery();
    } catch (error) {
      toast.error(`Error while creating grocery item (${error})`);
      console.error('CREATE_GROCERY_ERROR', error);
    }
  };

  const handleEditClick = (id: string, name: string) => {
    setEditingID(id);
    setEditedName(name);
  };

  const handleSave = async (id: string) => {
    try {
      await updateGroceryMutation({
        id,
        name: editedName,
      });

      setEditingID(null);
      onResetDefault();
      refetchGrocery();
    } catch (error) {
      toast.error(`Error while editing ${editedName} (${error})`);
      console.error('UPDATE_GROCERY_ERROR', error);
    }
  };

  const handleCancel = () => {
    setEditingID(null);
    setEditedName('');
    refetchGrocery();
  };

  const handleUpdateToBuy = async (id: string) => {
    try {
      await updateToBuyMutation({
        id,
      });

      onResetDefault();
      refetchGrocery();
    } catch (error) {
      toast.error(`Error while update to buy ${editedName} (${error})`);
      console.error('UPDATE_TO_BUY_GROCERY_ERROR', error);
    }
  };

  const handleDeleteGrocery = async (id: string) => {
    try {
      await deleteGroceryMutation({
        id,
      });

      onResetDefault();
      refetchGrocery();
    } catch (error) {
      toast.error(`Error while deleting ${editedName} (${error})`);
      console.error('DELETE_GROCERY_ERROR', error);
    }
  };

  const isLoadingAll = isUpdatingGrocery || isUpdatingToBuy || isDeletingGrocery;
  const isErrorAll = isErrorUpdatingGrocery || isErrorUpdatingToBuy || isErrorDeletingGrocery;
  const buttonLabel = isCreatingGrocery ? 'Adding...' : 'Add';

  return (
    <>
      <div className="flex w-full flex-col gap-y-10 p-3">
        <InputWithButton
          inputProps={{
            type: 'text',
            placeholder: 'Type something...',
            value: groceryName,
            onChange: (e) => setGroceryName(e.target.value),
            onKeyDown: (e) => {
              if (e.key === 'Enter') {
                handleCreateGrocery();
              }
            },
          }}
          buttonProps={{
            type: 'button',
            'aria-label': 'Add grocery item',
            onClick: handleCreateGrocery,
          }}
          isError={isErrorCreatingGrocery}
          buttonLabel={buttonLabel}
        />
        <div className="flex w-full flex-col gap-y-3">
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
                        isLoadingAll &&
                          selectedItem?.ID === ID &&
                          'bg-neutral-100 text-neutral-400',
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
                        {editingID === ID ? (
                          <input
                            disabled={isUpdatingGrocery || isUpdatingToBuy}
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            className="flex-grow outline-none disabled:bg-transparent"
                          />
                        ) : (
                          <span>{Name}</span>
                        )}
                      </div>
                      <span className="flex flex-row items-center gap-x-3">
                        {editingID === ID && (
                          <>
                            <button
                              disabled={isLoadingAll}
                              type="button"
                              aria-label="Save button"
                              onClick={() => {
                                setSelectedItem({
                                  ID,
                                  Name,
                                });
                                handleSave(ID);
                              }}
                            >
                              <CheckIcon className="h-5 w-5 text-default-gray hover:text-green-600 hover:opacity-50" />
                            </button>
                            <button
                              disabled={isLoadingAll}
                              type="button"
                              aria-label="Cancel button"
                              onClick={handleCancel}
                            >
                              <ClearIcon className="h-5 w-5 text-default-gray hover:text-default-red hover:opacity-50" />
                            </button>
                          </>
                        )}
                        {editingID !== ID && (
                          <>
                            <button
                              type="button"
                              aria-label="Update to buy button"
                              onClick={() => {
                                setSelectedItem({
                                  ID,
                                  Name,
                                });
                                handleUpdateToBuy(ID);
                              }}
                            >
                              <CheckIcon className="h-5 w-5 text-default-gray hover:text-default-orange hover:opacity-50" />
                            </button>
                            <button
                              disabled={isLoadingAll}
                              type="button"
                              aria-label="Edit grocery list button"
                              onClick={() => handleEditClick(ID, Name)}
                            >
                              <EditIcon className="h-5 w-5 text-default-gray hover:text-blue-600 hover:opacity-50" />
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

export default ToBuyTab;
