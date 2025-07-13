import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  useMediaQuery,
  Drawer
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { tabsData } from "./TabsData.ts";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import styles from "./navBarTabs.module.css";
import AppTitle from "./components/appTitle/AppTitle.tsx";
import LoginButton from "./components/loginButton/LoginButton.tsx";
import LoginDialog from "../auth/LoginDialog.tsx"; 

const NavsBarTabs = () => {
  const location = useLocation();
  const currentPath = location.pathname === "/" ? "/stream" : location.pathname;

  const underlineRef = useRef<HTMLSpanElement>(null);
  const tabsRef = useRef<{ [key: string]: HTMLAnchorElement | null }>({});
  const [underlineStyle, setUnderlineStyle] = useState<React.CSSProperties>({});
  const [openDrawer, setOpenDrawer] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  useEffect(() => {
    const activeTab = tabsRef.current[currentPath];
    if (activeTab) {
      const { offsetLeft, offsetWidth } = activeTab;
      setUnderlineStyle({ left: offsetLeft, width: offsetWidth });
    }
  }, [currentPath]);

  const handleDrawerToggle = () => setOpenDrawer((o) => !o);

  const handleLoginClick = () => {
    if (isLoggedIn) {
      // Logout
      setIsLoggedIn(false);
      // Clear storage/cookies if needed
    } else {
      // Open login dialog
      setShowLoginDialog(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowLoginDialog(false);
  };

  const handleDialogClose = () => {
    setShowLoginDialog(false);
  };

  const renderDrawer = () => (
    <>
      <IconButton edge="end" color="inherit" onClick={handleDrawerToggle} aria-label="menu">
        <MenuIcon />
      </IconButton>
      <Drawer anchor="right" open={openDrawer} onClose={handleDrawerToggle}>
        <Box className={styles.drawer} role="presentation" onClick={handleDrawerToggle}>
          {tabsData.map((tab) => {
            const isActive = currentPath.startsWith(tab.path);
            return (
              <Link
                key={tab.key}
                to={tab.path}
                ref={(el) => {
                  tabsRef.current[tab.path] = el;
                }}
                className={`${styles["drawer-link"]} ${isActive ? styles.active : ""}`}
              >
                {tab.label}
                {isActive && <span className={styles["drawer-underline"]} />}
              </Link>
            );
          })}
          <Box className={styles["drawer-admin-button"]}>
            <LoginButton onClick={handleLoginClick} isLoggedIn={isLoggedIn} />
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
            ref={(el) => {
              tabsRef.current[tab.path] = el;
            }}
            className={`${styles["tab-link"]} ${isActive ? styles.active : ""}`}
          >
            {tab.label}
          </Link>
        );
      })}
      <span ref={underlineRef} className={styles["tab-underline"]} style={underlineStyle} />
      <LoginButton onClick={handleLoginClick} isLoggedIn={isLoggedIn} />
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

      {/* Login Dialog */}
      {showLoginDialog && (
        <LoginDialog
          open={showLoginDialog}
          onClose={handleDialogClose}
          onSuccess={handleLoginSuccess}
        />
      )}
    </Box>
  );
};

export default NavsBarTabs;