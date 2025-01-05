import { useState } from 'react';

import { CheckIcon, ClearIcon, DeleteIcon, EditIcon } from '../icons';

import LoadingSpinner from '../loading-spinner';
import InputWithButton from '../inputs/input-with-button';
import NoResults from '../no-results';

import { GroceriesResponse } from '../../utils/hooks/useGetGroceries';
import { useCreateGrocery } from '../../utils/hooks/useCreateGrocery';
import { useUpdateGrocery } from '../../utils/hooks/useUpdateGrocery';
import { useUpdateToBuy } from '../../utils/hooks/useUpdateToBuy';
import { useDeleteGrocery } from '../../utils/hooks/useDeleteGrocery';

interface Props {
  data: GroceriesResponse | undefined;
  isLoadingGroceries: boolean;
  refetchGrocery: () => void;
}

function ToBuyTab(props: Props) {
  const { data, isLoadingGroceries, refetchGrocery } = props;

  const groceries = data?.results;
  const groceriesCount = data?.metadata?.total_count;

  const [groceryName, setGroceryName] = useState('');
  const [loadingID, setLoadingID] = useState<string | null>('');
  const [editingID, setEditingID] = useState<string | null>(null);
  const [editedName, setEditedName] = useState('');

  const { mutateAsync: createGroceryMutation, isPending: isCreatingGrocery } =
    useCreateGrocery();
  const { mutateAsync: updateGroceryMutation, isPending: isUpdatingGrocery } =
    useUpdateGrocery();
  const { mutateAsync: updateToBuyMutation, isPending: isUpdatingToBuy } =
    useUpdateToBuy();
  const { mutateAsync: deleteGroceryMutation, isPending: isDeletingGrocery } =
    useDeleteGrocery();

  const handleEditClick = (id: string, name: string) => {
    setEditingID(id);
    setEditedName(name);
  };

  const handleSave = async (id: string) => {
    try {
      setLoadingID(id);

      await updateGroceryMutation({
        id,
        name: editedName,
      });

      setEditingID(null);
      setLoadingID(null);
      refetchGrocery();
    } catch (error) {
      console.error('UPDATE_GROCERY_ERROR', error);
    }
  };

  const handleCancel = () => {
    setEditingID(null);
    setEditedName('');
  };

  const handleCreateGrocery = async () => {
    try {
      await createGroceryMutation({
        name: groceryName,
      });

      setGroceryName('');
      refetchGrocery();
    } catch (error) {
      console.error('CREATE_GROCERY_ERROR', error);
    }
  };

  const handleUpdateToBuy = async (id: string) => {
    try {
      setLoadingID(id);

      await updateToBuyMutation({
        id,
      });

      setLoadingID(null);
      refetchGrocery();
    } catch (error) {
      console.error('CREATE_GROCERY_ERROR', error);
    }
  };

  const handleDeleteGrocery = async (id: string) => {
    try {
      setLoadingID(id);

      await deleteGroceryMutation({
        id,
      });

      setLoadingID(null);
      refetchGrocery();
    } catch (error) {
      console.error('CREATE_GROCERY_ERROR', error);
    }
  };

  const isLoadingAll =
    isCreatingGrocery ||
    isUpdatingGrocery ||
    isUpdatingToBuy ||
    isDeletingGrocery;
  const buttonLabel = isCreatingGrocery ? 'Adding...' : 'Add';

  return (
    <div className="flex w-full flex-col gap-y-10 p-3">
      <InputWithButton
        inputProps={{
          type: 'text',
          placeholder: 'Type something...',
          value: groceryName,
          onChange: (e) => setGroceryName(e.target.value),
        }}
        buttonProps={{
          type: 'button',
          'aria-label': 'Add grocery item',
          onClick: handleCreateGrocery,
        }}
        buttonLabel={buttonLabel}
      />
      <div className="flex w-full flex-col gap-y-3">
        {isLoadingGroceries && (
          <div className="flex w-full flex-col items-center justify-center">
            <h2 className="text-2xl font-bold text-default-orange/50">
              Loading...
            </h2>
          </div>
        )}
        {!isLoadingGroceries && groceries && (
          <>
            {groceries.length === 0 && (
              <NoResults title="Nothing here yet..." />
            )}
            {groceries.length > 0 && (
              <div className="flex w-full flex-col gap-y-3">
                <h3 className="text-default-gray">{groceriesCount} items</h3>
                {groceries.map(({ ID, Name }) => (
                  <div
                    key={ID}
                    className="flex w-full flex-row items-center justify-between gap-x-3 rounded-xl border p-3 hover:border-default-orange"
                  >
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
                    <span className="flex flex-row items-center gap-x-3">
                      {isLoadingAll && loadingID === ID && (
                        <LoadingSpinner className="h-5 w-5" />
                      )}
                      {loadingID !== ID && (
                        <>
                          {editingID === ID && (
                            <>
                              <button
                                disabled={isUpdatingGrocery}
                                type="button"
                                aria-label="Save button"
                                onClick={() => handleSave(ID)}
                              >
                                <CheckIcon className="h-5 w-5 text-default-gray hover:text-green-600 hover:opacity-50" />
                              </button>
                              <button
                                disabled={isUpdatingGrocery}
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
                                onClick={() => handleUpdateToBuy(ID)}
                              >
                                <CheckIcon className="h-5 w-5 text-default-gray hover:text-default-orange hover:opacity-50" />
                              </button>
                              <button
                                disabled={isUpdatingToBuy}
                                type="button"
                                aria-label="Edit grocery list button"
                                onClick={() => handleEditClick(ID, Name)}
                              >
                                <EditIcon className="h-5 w-5 text-default-gray hover:text-blue-600 hover:opacity-50" />
                              </button>
                              <button
                                disabled={isDeletingGrocery}
                                type="button"
                                aria-label="Delete button"
                                onClick={() => handleDeleteGrocery(ID)}
                              >
                                <DeleteIcon className="h-5 w-5 text-default-gray hover:text-default-red hover:opacity-50" />
                              </button>
                            </>
                          )}
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
  );
}

export default ToBuyTab;
