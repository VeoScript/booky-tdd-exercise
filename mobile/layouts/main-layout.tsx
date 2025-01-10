import tw from '@/styles/tailwind';
import { ReactNode } from 'react';
import { SafeAreaView, View } from 'react-native';

interface Props {
  children: ReactNode;
}

function MainLayout(props: Props) {
  const { children } = props;

  return <SafeAreaView style={tw`flex-1 bg-white`}>{children}</SafeAreaView>;
}

export default MainLayout;
