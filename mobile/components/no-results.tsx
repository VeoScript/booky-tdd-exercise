import tw from '@/styles/tailwind';
import { Image, View, Text } from 'react-native';

interface NoResultsProps {
  title?: string;
}

function NoResults(props: NoResultsProps) {
  const { title } = props;

  return (
    <View style={tw`flex w-full flex-col items-center gap-y-5`}>
      <Image
        source={require('../assets/images/no-result.png')}
        style={tw`object-cover w-[10rem] h-[10rem]`}
        resizeMode="contain"
      />
      <Text style={tw`text-neutral-800`}>{title ?? 'No results'}</Text>
    </View>
  );
}

export default NoResults;
