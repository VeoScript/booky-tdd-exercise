import tw from '@/styles/tailwind';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  ActivityIndicator,
  TextInput,
  ToastAndroid,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';

import Feather from '@expo/vector-icons/Feather';

import Header from '../header';
import NoResults from '../no-results';
import ListSkeleton from '../skeletons/list-skeleton';
import InputWithButton from '../inputs/input-with-button';
import PaginationBar from '../pagination-bar';
import DeleteModal from '../modals/delete-modal';

import { useDeleteModalState } from '@/utils/stores/useModalStore';
import { useFiltersState } from '@/utils/stores/useFiltersStore';

import { Groceries, GroceriesResponse } from '@/utils/hooks/fetch/useGetGroceries';
import { useCreateGrocery } from '@/utils/hooks/fetch/useCreateGrocery';
import { useDeleteGrocery } from '@/utils/hooks/fetch/useDeleteGrocery';
import { useUpdateGrocery } from '@/utils/hooks/fetch/useUpdateGrocery';
import { useUpdateToBuy } from '@/utils/hooks/fetch/useUpdateToBuy';

import { createGroceryItemValidation } from '@/utils/functions/validationSchema';

interface Props {
  data: GroceriesResponse | undefined;
  isLoadingGroceries: boolean;
  isRefetchingGroceries: boolean;
  refetchGrocery: () => void;
}

export type SelectedGroceryItem = {
  ID: string;
  Name: string;
} | null;

type GroceryFormValues = {
  name: string;
};

function ToBuyTab(props: Props) {
  const { data, isLoadingGroceries, isRefetchingGroceries, refetchGrocery } = props;

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

  const {
    control,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
  } = useForm<GroceryFormValues>({
    resolver: yupResolver(createGroceryItemValidation),
  });

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

  const handleCreateGrocery = async (formData: GroceryFormValues) => {
    try {
      const { name } = formData;

      await createGroceryMutation({
        name,
      });

      resetForm();
      refetchGrocery();
    } catch (error) {
      ToastAndroid.show(`Error while creating grocery item (${error})`, ToastAndroid.LONG);
      console.error('CREATE_GROCERY_ERROR', error);
    }
  };

  const handleEditClick = (ID: string, Name: string) => {
    setSelectedItem({ ID, Name });
  };

  const handleSave = async (id: string) => {
    try {
      await updateGroceryMutation({
        id,
        name: String(selectedItem?.Name),
      });

      setSelectedItem(null);
      onResetDefault();
      refetchGrocery();
    } catch (error) {
      ToastAndroid.show(`Error while editing ${selectedItem?.Name} (${error})`, ToastAndroid.LONG);
      console.error('UPDATE_GROCERY_ERROR', error);
    }
  };

  const handleCancel = () => {
    setSelectedItem(null);
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
      ToastAndroid.show(
        `Error while update to buy ${selectedItem?.Name} (${error})`,
        ToastAndroid.LONG
      );
      console.error('UPDATE_TO_BUY_GROCERY_ERROR', error);
    }
  };

  const handleDeleteGrocery = async (id: string) => {
    try {
      onToggleDeleteModal(false);

      await deleteGroceryMutation({
        id,
      });

      onResetDefault();
      refetchGrocery();
    } catch (error) {
      ToastAndroid.show(`Error while deleting ${selectedItem?.Name} (${error})`, ToastAndroid.LONG);
      console.error('DELETE_GROCERY_ERROR', error);
    }
  };

  const isLoadingAll = isUpdatingGrocery || isUpdatingToBuy || isDeletingGrocery;
  const isErrorAll = isErrorUpdatingGrocery || isErrorUpdatingToBuy || isErrorDeletingGrocery;
  const buttonLabel = isCreatingGrocery ? 'Adding...' : 'Add';

  const renderHeader = () => (
    <View style={tw`w-full mb-5 pt-[3rem] gap-y-5`}>
      <Header />
      <View style={tw`w-full gap-y-1`}>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <InputWithButton
              inputProps={{
                placeholder: 'Type something...',
                id: 'name',
                value,
                onChangeText: onChange,
              }}
              buttonProps={{
                onPress: handleSubmit(handleCreateGrocery),
              }}
              buttonLabel={buttonLabel}
              isError={!!errors?.name?.message || isErrorCreatingGrocery}
            />
          )}
        />
        {errors.name && <Text style={tw`ml-1 text-red-500`}>{errors.name.message}</Text>}
      </View>

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
          {selectedItem?.ID === ID ? (
            <TextInput
              style={tw`w-full p-0 text-base`}
              editable={!isUpdatingGrocery && !isUpdatingToBuy}
              value={selectedItem?.Name || ''}
              onChangeText={(text) => setSelectedItem({ ID, Name: text })}
              onSubmitEditing={() => handleSave(ID)}
              onFocus={() => setFocusId(ID)}
              onBlur={() => setFocusId('')}
            />
          ) : (
            <Text style={tw`text-base`}>{Name}</Text>
          )}
        </View>
        <View style={tw`flex-row items-center gap-x-3`}>
          {!isLoadingAll && selectedItem?.ID === ID && (
            <>
              <TouchableOpacity
                disabled={isLoadingAll}
                onPress={() => {
                  setSelectedItem({
                    ID,
                    Name,
                  });
                  handleSave(ID);
                }}
              >
                <Feather name="check" size={20} style={tw`text-default-orange`} />
              </TouchableOpacity>
              <TouchableOpacity disabled={isLoadingAll} onPress={handleCancel}>
                <Feather name="x" size={20} style={tw`text-default-red`} />
              </TouchableOpacity>
            </>
          )}
          {selectedItem?.ID !== ID && (
            <>
              <TouchableOpacity
                onPress={() => {
                  setSelectedItem({
                    ID,
                    Name,
                  });
                  handleUpdateToBuy(ID);
                }}
              >
                <Feather name="check" size={20} style={tw`text-default-orange`} />
              </TouchableOpacity>
              <TouchableOpacity disabled={isLoadingAll} onPress={() => handleEditClick(ID, Name)}>
                <Feather name="edit" size={20} style={tw`text-blue-500`} />
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
            </>
          )}
        </View>
      </View>
    );
  };

  return (
    <>
      <FlatList
        refreshControl={
          <RefreshControl
            colors={['#FFF']}
            tintColor="#FFF"
            title="Pull to refresh"
            titleColor="#FFF"
            progressBackgroundColor="#E46C15"
            refreshing={isRefetchingGroceries}
            onRefresh={refetchGrocery}
          />
        }
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
