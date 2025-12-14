import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  useMediaQuery,
  Drawer,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { tabsData } from "./TabsData.ts";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import styles from "./navBarTabs.module.scss";
import AppTitle from "./components/appTitle/AppTitle.tsx";
import AccountSection from "./userMenu/AccountSection.tsx";

const NavsBarTabs = () => {
  const location = useLocation();
  const currentPath = location.pathname === "/" ? "/stream" : location.pathname;

  const [openDrawer, setOpenDrawer] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleDrawerToggle = () => setOpenDrawer((o) => !o);

  const renderDrawer = () => (
    <>
      <IconButton
        edge="end"
        color="inherit"
        onClick={handleDrawerToggle}
        aria-label="menu"
      >
        <MenuIcon />
      </IconButton>
      <Drawer anchor="right" open={openDrawer} onClose={handleDrawerToggle}>
        <Box
          className={styles.drawer}
          role="presentation"
          onClick={handleDrawerToggle} 
        >
          {tabsData.map((tab) => {
            const isActive = currentPath.startsWith(tab.path);
            return (
              <Link
                key={tab.key}
                to={tab.path}
                className={`${styles["drawer-link"]} ${
                  isActive ? styles.active : ""
                }`}
              >
                {tab.label}
              </Link>
            );
          })}

          <Box
            className={styles["drawer-admin-button"]}
            onClick={(e) => e.stopPropagation()} // ✅ Only AccountSection clicks won't close drawer
          >
            <AccountSection />
          </Box>
        </Box>
      </Drawer>
    </>
  );

  const renderTabs = () => (
    <Box className={styles["navbar-tabs"]}>
      {tabsData.map((tab) => {
        const isActive = currentPath.startsWith(tab.path);
        return (
          <Link
            key={tab.key}
            to={tab.path}
            className={`${styles["tab-link"]} ${isActive ? styles.active : ""}`}
          >
            {tab.label}
          </Link>
        );
      })}
      <AccountSection />
    </Box>
  );

  return (
    <Box>
      <AppBar position="static" className={styles.appbar}>
        <Toolbar className={styles.toolbar}>
          <AppTitle />
          {isMobile ? renderDrawer() : renderTabs()}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default NavsBarTabs;
