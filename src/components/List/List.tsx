import { List, ListItemButton, ListItemText } from "@mui/material";
import { FC } from "react";

const JurisdictionList: FC = () => {
  return (
    <List>
    <ListItemButton component="a" href="#simple-list">
      <ListItemText primary="Spam" />
    </ListItemButton>
    <ListItemButton component="a" href="#simple-list">
      <ListItemText primary="Test" />
    </ListItemButton>
    <ListItemButton component="a" href="#simple-list">
      <ListItemText primary="Papa" />
    </ListItemButton>
    </List>
  );
};


export default JurisdictionList;