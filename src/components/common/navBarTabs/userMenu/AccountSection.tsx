import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Menu,
  MenuItem,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Logout from "@mui/icons-material/Logout";
import Settings from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";
import { useAppSelector, useAppDispatch } from "../../../../app/hooks";
import { logoutUser } from "../../../../features/auth/authThunks";
import { useState } from "react";

const AccountSection = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleLogout = () => {
    dispatch(logoutUser()).then(() => {
      const redirectUri = encodeURIComponent(window.location.origin);
      window.location.href = `http://authcenter.madhusudan.space:5000/auth?redirect=${redirectUri}`;
    });
  };

  const firstLetter = user?.name?.charAt(0).toUpperCase() || "?";

  if (isMobile) {
    // Small screen → Accordion inside Drawer
    return (
      <Accordion sx={{ mt: "auto", boxShadow: "none" }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar sx={{ width: 32, height: 32 }}>{firstLetter}</Avatar>
            <Typography variant="subtitle1">{user?.name || "Guest"}</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <List dense>
            <ListItemButton>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItemButton>
            <ListItemButton>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>
            <Divider sx={{ my: 1 }} />
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </List>
        </AccordionDetails>
      </Accordion>
    );
  }

  // Large screen → Dropdown menu
  return (
    <Box>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
        <Avatar sx={{ width: 32, height: 32 }}>{firstLetter}</Avatar>
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
        <MenuItem>
          <PersonIcon fontSize="small" style={{ marginRight: 8 }} />
          Profile
        </MenuItem>
        <MenuItem>
          <Settings fontSize="small" style={{ marginRight: 8 }} />
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <Logout fontSize="small" style={{ marginRight: 8 }} />
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default AccountSection;
