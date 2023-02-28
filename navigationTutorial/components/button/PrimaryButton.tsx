import React from 'react';
import {ActivityIndicator, Text, TouchableOpacity, TouchableOpacityProps, ViewStyle} from 'react-native';
import { styles, screenWidth } from '../../constants/Styles';
import Colors from '../../constants/Colors';

interface PrimaryButtonProps {
  text: string;
  loading?: boolean;
  style?: ViewStyle
}

const PrimaryButton = (props: PrimaryButtonProps & TouchableOpacityProps) => {
  const { text, style, loading = false } = props;
  return (
    <TouchableOpacity
      {...props}
      style={{
        backgroundColor: Colors.primary.text,
        width: screenWidth / 1.2,
        maxWidth: 600,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        height: 50,
        flexDirection: 'row',
        // ...style
      }}
    >
      {loading && <ActivityIndicator color={'white'} size={30} style={{ position: 'relative', marginRight: 10 }} />}
      <Text
        style={{
          color: 'white',
          textAlign: 'center',
          fontSize: 18,
          fontFamily: 'nunito-bold',
          marginRight: loading ? 40 : 0,
        }}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

export default PrimaryButton;