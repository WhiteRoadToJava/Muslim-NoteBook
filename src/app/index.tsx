import React, { useState }from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ZikrList from '../components/ZikrList';
import MainZikr from '../components/MainZikr';

export default function HomeScreen() {
  const [visibleList, setVisibleList] = useState(false);
  return (
    <View>
      {/* <ZikrList visibleList={visibleList} setVisibleList={setVisibleList}/> */}
      <MainZikr />
    </View>

  );
}