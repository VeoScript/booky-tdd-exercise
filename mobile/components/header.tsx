import tw from '@/styles/tailwind';
import { useFiltersState } from '@/utils/stores/useFiltersStore';
import { Text, TouchableOpacity, View } from 'react-native';

function Header() {
  const { filters, setFilters } = useFiltersState();

  const { type: activeTab } = filters;

  const handleChangeTab = () => {
    if (activeTab === 'to-buy') {
      setFilters({
        type: 'bought',
      });
    } else if (activeTab === 'bought') {
      setFilters({
        type: 'to-buy',
      });
    }
  };

  return (
    <View style={tw`flex-col items-center w-full px-5 gap-y-5`}>
      <Text style={tw`font-varela-round font-bold text-xl text-default-orange`}>Grocery List</Text>
      <View style={tw`flex-row items-center justify-center w-full gap-x-3`}>
        <TouchableOpacity
          activeOpacity={0.5}
          style={tw.style(
            'flex-1 pb-3 border-b-2 border-default-gray',
            activeTab === 'to-buy' && 'border-default-orange'
          )}
          onPress={handleChangeTab}
        >
          <Text
            style={tw.style(
              'font-varela-round text-center text-black',
              activeTab === 'to-buy' && 'text-default-orange'
            )}
          >
            To Buy
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          style={tw.style(
            'flex-1 pb-3 border-b-2 border-default-gray',
            activeTab === 'bought' && 'border-default-orange'
          )}
          onPress={handleChangeTab}
        >
          <Text
            style={tw.style(
              'font-varela-round text-center text-black',
              activeTab === 'bought' && 'text-default-orange'
            )}
          >
            Bought
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default Header;
