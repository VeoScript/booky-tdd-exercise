import { useState } from 'react';

import InputWithButton from '../inputs/input-with-button';
import NoResults from '../no-results';
import { CheckIcon, DeleteIcon, EditIcon } from '../icons';

import { groceries as initialGroceries } from '../../mocks/groceries';

function ToBuyTab() {
  const [groceries, setGroceries] = useState(initialGroceries);
  const [editStates, setEditStates] = useState<Record<string, boolean>>({});

  const handleEditToggle = (id: string) => {
    setEditStates((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleNameChange = (id: string, newName: string) => {
    setGroceries((prev) =>
      prev.map((item) => (item.id === id ? { ...item, name: newName } : item))
    );
    handleEditToggle(id);
  };

  return (
    <div className="flex h-full w-full flex-col gap-y-10 p-3">
      <InputWithButton
        inputProps={{
          type: 'text',
          placeholder: 'Type something...',
        }}
        buttonProps={{
          type: 'button',
          'aria-label': 'Add grocery item',
        }}
        buttonLabel="Add"
      />
      <div className="flex w-full flex-col gap-y-3">
        {!groceries.length && <NoResults title="Nothing here yet..." />}
        {groceries.length > 0 && (
          <div className="flex w-full flex-col gap-y-3">
            <h3 className="text-default-gray">{groceries.length} items</h3>
            {groceries.map(({ id, name }) => (
              <div
                key={id}
                className="flex w-full flex-row items-center justify-between rounded-xl border p-3 hover:border-default-orange"
              >
                {editStates[id] ? (
                  <input
                    type="text"
                    className="flex-grow border px-2 py-1"
                    defaultValue={name}
                    onBlur={(e) => handleNameChange(id, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleNameChange(
                          id,
                          (e.target as HTMLInputElement).value
                        );
                      }
                    }}
                  />
                ) : (
                  <span>{name}</span>
                )}
                <span className="flex flex-row items-center gap-x-3">
                  <button type="button" aria-label="Done button">
                    <CheckIcon className="h-5 w-5 text-default-gray hover:text-default-orange hover:opacity-50" />
                  </button>
                  <button
                    type="button"
                    aria-label="Edit button"
                    onClick={() => handleEditToggle(id)}
                  >
                    <EditIcon className="h-5 w-5 text-default-gray hover:text-blue-600 hover:opacity-50" />
                  </button>
                  <button type="button" aria-label="Delete button">
                    <DeleteIcon className="h-5 w-5 text-default-gray hover:text-default-red hover:opacity-50" />
                  </button>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ToBuyTab;
