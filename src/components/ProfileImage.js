import React from "react";
import { Avatar } from "react-native-elements";

export default function ProfileImage(props) {
  const avatarProps = {
    size: props.size,
    rounded: true,
    overlayContainerStyle: { backgroundColor: "blue" },
    activeOpacity: 0.6,
  };
  if (props.profileImageUri) avatarProps.source = { uri: process.env.API_BASE_URL+props.profileImageUri };
  else avatarProps.title = props.title;

  return (
    <>
      <Avatar {...avatarProps} onPress={props.onPress} />
    </>
  );
}
