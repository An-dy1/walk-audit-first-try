import { Text, View } from '../../components/Themed';
import { Modal, TextInput, Button, Platform, Keyboard } from 'react-native';
import { useState } from 'react';
import { KeyboardAvoidingView } from 'react-native';

import { LocationNotesProps } from './LocationNotesProps';

export const LocationNotes: React.FC<LocationNotesProps> = ({
  notes,
  onNotesChange,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const handleTextInputTap = () => {
    console.log('handling tap');
    if (keyboardVisible) {
      console.log('Keyboard is visible, dismissing it...');
      Keyboard.dismiss();
      setKeyboardVisible(false);
    } else {
      console.log('Keyboard is not visible, showing it...');
      setKeyboardVisible(true);
    }
  };

  const handleTextChange = (text: string) => {
    setKeyboardVisible(true);
    onNotesChange(text);
  };

  return (
    <View>
      <Modal visible={modalVisible} animationType='slide'>
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{ flex: 1 }}
              //   keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
              <TextInput
                style={{
                  flex: 1,
                  color: 'white',
                  fontSize: 20,
                  marginTop: 100,
                  padding: 50,
                  borderWidth: 1,
                }}
                multiline
                value={notes ? notes : ''}
                onChangeText={onNotesChange}
                onFocus={handleTextInputTap}
              />
            </KeyboardAvoidingView>
          </View>
          <View>
            <Button title='Close' onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
      <View>
        <Button title='Add Notes' onPress={() => setModalVisible(true)} />
      </View>
    </View>
  );
};
