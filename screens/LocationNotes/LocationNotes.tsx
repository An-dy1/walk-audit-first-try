import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Modal,
  TextInput,
  Button,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from 'react-native';

import { LocationNotesProps } from './LocationNotesProps';

export const LocationNotes: React.FC<LocationNotesProps> = ({
  notes,
  onNotesChange,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleTextChange = (text: string) => {
    onNotesChange(text);
  };

  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        Keyboard.dismiss();
      }
    );

    return () => {
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <View>
      <Modal visible={modalVisible} animationType='slide'>
        <View style={{ flex: 1 }}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  multiline
                  value={notes ? notes : ''}
                  onChangeText={handleTextChange}
                  placeholder='type here...'
                  placeholderTextColor='darkblue'
                  returnKeyType='done'
                  onSubmitEditing={Keyboard.dismiss}
                />
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
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

const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  textInput: {
    backgroundColor: 'white',
    color: 'darkblue',
    fontSize: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'darkblue',
    borderRadius: 5,
    alignSelf: 'center',
    width: '80%',
  },
});
