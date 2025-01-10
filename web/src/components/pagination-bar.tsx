import clsx from 'clsx';

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function PaginationBar(props: Props) {
  const { currentPage, totalPages, onPageChange } = props;

  const getPages = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="mt-4 flex items-center justify-center space-x-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={clsx(
          'rounded-md px-3 py-1 disabled:opacity-30',
          currentPage === 1
            ? 'cursor-not-allowed bg-gray-300'
            : 'bg-default-orange text-white hover:opacity-50'
        )}
      >
        Previous
      </button>

      {getPages().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={clsx(
            'rounded-md px-3 py-1 disabled:opacity-30',
            page === currentPage
              ? 'bg-default-orange text-white'
              : 'bg-default-gray hover:opacity-50'
          )}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={clsx(
          'rounded-md px-3 py-1 disabled:opacity-30',
          currentPage === totalPages
            ? 'cursor-not-allowed bg-gray-300'
            : 'bg-default-orange text-white hover:opacity-50'
        )}
      >
        Next
      </button>
    </div>
  );
}

export default PaginationBar;
