import tw from '@/styles/tailwind';
import { useState } from 'react';
import {
  ActivityIndicator,
  TextInput,
  ToastAndroid,
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from 'react-native';

import Feather from '@expo/vector-icons/Feather';

import Header from '../header';
import NoResults from '../no-results';
import ListSkeleton from '../skeletons/list-skeleton';
import PaginationBar from '../pagination-bar';

import { useDeleteModalState } from '@/utils/stores/useModalStore';
import { useFiltersState } from '@/utils/stores/useFiltersStore';

import { Groceries, GroceriesResponse } from '@/utils/hooks/fetch/useGetGroceries';
import { useRestore } from '@/utils/hooks/fetch/useRestore';
import { useDeleteGrocery } from '@/utils/hooks/fetch/useDeleteGrocery';

interface Props {
  data: GroceriesResponse | undefined;
  isLoadingGroceries: boolean;
  refetchGrocery: () => void;
}

export type SelectedGroceryItem = {
  ID: string;
  Name: string;
} | null;

type GroceryFormValues = {
  name: string;
};

function BoughtTab(props: Props) {
  const { data, isLoadingGroceries, refetchGrocery } = props;

  const groceries = data?.results;
  const groceriesCount = Number(data?.metadata?.total_count);
  const groceriesCurrentPage = Number(data?.metadata?.page);
  const groceriesMaxPage = Number(data?.metadata?.max_page);

  const [selectedItem, setSelectedItem] = useState<SelectedGroceryItem>(null);
  const [focusId, setFocusId] = useState('');

  const { filters, setFilters } = useFiltersState();
  const { isOpen: isOpenDeleteModal, onToggle: onToggleDeleteModal } = useDeleteModalState();

  const { type } = filters;

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

  const handleChangePage = (page: number) => {
    setFilters({
      type,
      page,
    });
  };

  const handleRestore = async (id: string) => {
    try {
      await restoreGroceryItemMutation({
        id,
      });

      refetchGrocery();
      onResetDefault();
    } catch (error) {
      ToastAndroid.show(
        `Error while restoring ${selectedItem?.Name} (${error})`,
        ToastAndroid.LONG
      );
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
      ToastAndroid.show(`Error while deleting ${selectedItem?.Name} (${error})`, ToastAndroid.LONG);
      console.error('DELETE_GROCERY_ERROR', error);
    }
  };

  const isLoadingAll = isRestoring || isDeletingGrocery;
  const isErrorAll = isErrorRestoring || isErrorDeletingGrocery;

  const renderHeader = () => (
    <View style={tw`w-full mb-5 pt-[3rem] gap-y-5`}>
      <Header />
      {!isLoadingGroceries && groceriesCount !== 0 && (
        <Text style={tw`text-black`}>{groceriesCount} items</Text>
      )}
    </View>
  );

  const renderFooter = () => (
    <>
      {!isLoadingGroceries && groceriesCount !== 0 && (
        <View style={tw`mb-5`}>
          <PaginationBar
            currentPage={groceriesCurrentPage}
            totalPages={groceriesMaxPage}
            onPageChange={handleChangePage}
          />
        </View>
      )}
    </>
  );

  const renderEmpty = () => (
    <>
      {isLoadingGroceries && <ListSkeleton />}
      {groceriesCount === 0 && (
        <View className="mt-10">
          <NoResults title="Nothing here yet..." />
        </View>
      )}
    </>
  );

  const renderItem = ({ item }: { item: Groceries }) => {
    const { ID, Name } = item;

    return (
      <View
        style={tw.style(
          'flex-row items-center justify-between w-full mb-1 p-3 gap-x-3 rounded-xl border border-default-gray',
          focusId === ID && 'border-default-orange',
          isLoadingAll && selectedItem?.ID === ID && 'bg-neutral-100 text-neutral-400',
          isErrorAll && selectedItem?.ID === ID && 'border-red-500'
        )}
      >
        <View style={tw`flex-1 flex-row items-center gap-x-1`}>
          {isLoadingAll && selectedItem?.ID === ID && (
            <ActivityIndicator size="small" color="#222" />
          )}
          <Text style={tw`text-base`}>{Name}</Text>
        </View>
        <View style={tw`flex-row items-center gap-x-3`}>
          <TouchableOpacity
            disabled={isLoadingAll}
            onPress={() => {
              setSelectedItem({
                ID,
                Name,
              });
              handleRestore(ID);
            }}
          >
            <Feather name="refresh-cw" size={20} style={tw`text-green-500`} />
          </TouchableOpacity>
          <TouchableOpacity
            disabled={isLoadingAll}
            onPress={() => {
              setSelectedItem({ ID, Name });
              onToggleDeleteModal(true);
            }}
          >
            <Feather name="trash" size={20} style={tw`text-default-red`} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={tw`px-3`}
      data={groceries}
      renderItem={renderItem}
      keyExtractor={(item) => item.ID.toString()}
      ListHeaderComponent={renderHeader}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={renderEmpty}
    />
  );
}

export default BoughtTab;
