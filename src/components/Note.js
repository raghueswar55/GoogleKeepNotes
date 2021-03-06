import React, { useState, useEffect } from "react";
import { View, TextInput, Dimensions, Keyboard, StyleSheet } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import Icon from "react-native-vector-icons/EvilIcons";
import { addNotes, updateNotes } from "../service/notesServices";

export default function Note(props) {
  const [note, setNote] = useState(props.note);
  const [keyBordHeight, setKeyBordHeight] = useState(0);
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  const onKeyboardDidShow = (e) => {
    setKeyBordHeight(e.endCoordinates.height);
  };

  const onKeyboardDidHide = () => {
    setKeyBordHeight(0);
  };

  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", onKeyboardDidShow);
    Keyboard.addListener("keyboardDidHide", onKeyboardDidHide);
    return () => {
      Keyboard.removeListener("keyboardDidShow", onKeyboardDidShow);
      Keyboard.removeListener("keyboardDidHide", onKeyboardDidHide);
    };
  }, []);

  useEffect(() => setNote(props.note), [props.note]);

  const reset = () => {
    props.close();
    setNote({ ...note, title: "", description: "" });
  };

  const saveNote = () => {
    if (props.note) {
      let formData = new FormData();
      formData.append("noteId", note.id);
      formData.append("title", note.title);
      formData.append("description", note.description);
      updateNotes(formData, props.token).then((response) => {
        if (response.status === 200) { 
          reset();
          props.updateNotes();
        }
      });
      return;
    }
    if (note && note.title && note.description) {
      let formData = new FormData();
      formData.append("title", note.title);
      formData.append("description", note.description);
      addNotes(formData, props.token)
        .then((response) => {
          if (response.status === 200) { 
            reset();
            props.addNote(response.data.status.details)
          }
        })
        .catch((error) => console.log(error));
    } else props.close();
  };

  const style = StyleSheet.create({
    header: {
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: "white",
      height: 60,
      width: "100%",
      flexDirection: "row",
      elevation: 5,
    },
    content: {
      height: keyBordHeight !== 0? screenHeight * 0.9 - keyBordHeight : screenHeight * 0.95,
      width: screenWidth,
      padding: 15,
    },
    container: {
      height: "100%",
      width: "100%",
    },
    title: {
      height: screenHeight*0.1, 
      textAlignVertical: 'top', 
      fontSize: 30,
    },
    note: {
      height: (keyBordHeight!==0)?(screenHeight*0.78)-keyBordHeight:screenHeight*0.85, 
      textAlignVertical: 'top', 
      fontSize: 18,
      fontSize: 18, 
      fontSize: 18,
      paddingBottom: 20,
    },
    RBSheetContainer: {
      backgroundColor: "#ffffff",
      width: "100%",
      height: "100%",
      alignSelf: "center",
      justifyContent: "space-evenly",
    },
  });

  return (
    <RBSheet
      ref={props.noteSheet}
      closeOnPressMask={true}
      customStyles={{
        wrapper: { backgroundColor: "transparent" },
        container: style.RBSheetContainer,
      }}
    >
      <View style={style.container}>
        <View style={style.header}>
          <Icon name="chevron-left" size={50} onPress={saveNote}></Icon>
        </View>
        <View style={style.content}>
          <TextInput
            autoFocus
            style={style.title}
            onChangeText={(text) => setNote({ ...note, title: text })}
            value={note ? note.title : ""}
            placeholder="Title"
          />
          <TextInput
            placeholder="Note"
            multiline={true}
            allowFontScaling={false}
            onChangeText={(text) => setNote({ ...note, description: text })}
            style={style.note}
            value={note ? note.description : ""}
          />
        </View>
      </View>
    </RBSheet>
  );
}
