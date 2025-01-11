import tw from '@/styles/tailwind';
import { Modal, View, Button, Text, TouchableOpacity } from 'react-native';

interface Props {
  itemName?: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

function DeleteModal(props: Props) {
  const { itemName, isOpen, onClose, onSubmit } = props;

  return (
    <Modal visible={isOpen} transparent={true} animationType="fade" onRequestClose={onClose}>
      <View style={tw`flex-1 items-center justify-center px-3 bg-black/50`}>
        <View style={tw`w-full items-center p-10 gap-y-5 rounded-xl bg-white`}>
          <Text style={tw`font-varela-round font-bold text-xl`}>Delete Confirmation</Text>
          <Text style={tw`font-varela-round text-sm`}>
            Are you sure you want to delete {itemName ? `"${itemName}"` : 'this item'}?
          </Text>
          <View style={tw`flex-row row items-center gap-x-3`}>
            <TouchableOpacity style={tw`flex-1 p-3 rounded-xl bg-default-gray`} onPress={onClose}>
              <Text style={tw`font-varela-round text-sm text-center text-neutral-500`}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={tw`flex-1 p-3 rounded-xl bg-default-red`} onPress={onSubmit}>
              <Text style={tw`font-varela-round text-sm text-center text-white`}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default DeleteModal;
