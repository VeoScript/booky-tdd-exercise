interface Props {
  itemName?: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

function DeleteModal(props: Props) {
  const { itemName, isOpen, onClose, onSubmit } = props;

  const handleConfirmDelete = () => {
    onSubmit();
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
            <p className="mt-4 text-center">Are you sure you want to delete this item?:</p>
            <p className="mt-4 text-center font-bold">{itemName}</p>

            <div className="mt-6 flex justify-center space-x-3 font-bold">
              <button
                onClick={handleConfirmDelete}
                className="w-[10rem] rounded-xl bg-red-600 px-4 py-2 text-white hover:opacity-50"
              >
                Yes, delete
              </button>
              <button
                onClick={onClose}
                className="w-[10rem] rounded-xl bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
              >
                No
              </button>
            </div>

            {/* Close Button (X Icon) */}
            <button
              onClick={onClose}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              <span className="sr-only">Close</span>
              &times;
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default DeleteModal;
