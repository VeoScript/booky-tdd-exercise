import tw from '@/styles/tailwind';
import { Text, TouchableOpacity, View } from 'react-native';

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

  const isDisabledPrevious = currentPage === 1;
  const isDisabledNext = currentPage === totalPages;

  return (
    <View style={tw`mt-4 w-full flex-row items-center justify-center gap-x-2`}>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => onPageChange(currentPage - 1)}
        disabled={isDisabledPrevious}
        style={tw.style(
          'w-[5rem] rounded-md p-3',
          isDisabledPrevious ? 'opacity-50 bg-default-gray' : 'bg-default-orange text-white'
        )}
      >
        <Text style={tw`font-varela-round text-center text-white`}>Previous</Text>
      </TouchableOpacity>

      {getPages().map((page) => (
        <TouchableOpacity
          key={page}
          activeOpacity={0.5}
          onPress={() => onPageChange(page)}
          style={tw.style(
            'flex-row items-center justify-center rounded-full w-[2.5rem] h-[2.5rem]',
            page === currentPage ? 'bg-default-orange text-white' : 'bg-default-gray'
          )}
        >
          <Text style={tw`font-varela-round text-center text-white`}>{page}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => onPageChange(currentPage + 1)}
        disabled={isDisabledNext}
        style={tw.style(
          'w-[5rem] rounded-md p-3',
          isDisabledNext ? 'opacity-50 bg-default-gray' : 'bg-default-orange text-white'
        )}
      >
        <Text style={tw`font-varela-round text-center text-white`}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

export default PaginationBar;
