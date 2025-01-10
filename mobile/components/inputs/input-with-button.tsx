import tw from '@/styles/tailwind';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  TextInputProps,
  TouchableOpacityProps,
} from 'react-native';

interface InputWithButtonProps {
  inputProps?: TextInputProps;
  buttonProps?: TouchableOpacityProps;
  buttonLabel?: string;
  isError?: boolean;
}

function InputWithButton(props: InputWithButtonProps) {
  const { inputProps, buttonProps, buttonLabel, isError } = props;

  return (
    <View
      style={tw.style(
        isError ? 'border-default-red' : 'border-default-orange',
        'flex-row items-center w-full overflow-hidden rounded-xl border'
      )}
    >
      <TextInput {...inputProps} style={tw`flex-1 px-3`} />
      <TouchableOpacity {...buttonProps} style={tw`w-[5rem] p-3 bg-default-orange`}>
        <Text style={tw`font-varela-round text-center text-white`}>{buttonLabel ?? 'Label'}</Text>
      </TouchableOpacity>
    </View>
  );
}

export default InputWithButton;
