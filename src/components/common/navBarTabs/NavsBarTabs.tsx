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
import { useEffect, useRef, useState } from "react";
import styles from "./navBarTabs.module.css";
import AppTitle from "./components/appTitle/AppTitle.tsx";
import AccountSection from "./userMenu/AccountSection.tsx";

const NavsBarTabs = () => {
  const location = useLocation();
  const currentPath = location.pathname === "/" ? "/stream" : location.pathname;

  const underlineRef = useRef<HTMLSpanElement>(null);
  const tabsRef = useRef<{ [key: string]: HTMLAnchorElement | null }>({});
  const [underlineStyle, setUnderlineStyle] = useState<React.CSSProperties>({});
  const [openDrawer, setOpenDrawer] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const activeTab = tabsRef.current[currentPath];
    if (activeTab) {
      const { offsetLeft, offsetWidth } = activeTab;
      setUnderlineStyle({ left: offsetLeft, width: offsetWidth });
    }
  }, [currentPath]);

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
          onClick={handleDrawerToggle} // ✅ Now normal clicks close drawer
        >
          {tabsData.map((tab) => {
            const isActive = currentPath.startsWith(tab.path);
            return (
              <Link
                key={tab.key}
                to={tab.path}
                ref={(el) => {
                  tabsRef.current[tab.path] = el;
                }}
                className={`${styles["drawer-link"]} ${
                  isActive ? styles.active : ""
                }`}
              >
                {tab.label}
                {isActive && <span className={styles["drawer-underline"]} />}
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
            ref={(el) => {
              tabsRef.current[tab.path] = el;
            }}
            className={`${styles["tab-link"]} ${isActive ? styles.active : ""}`}
          >
            {tab.label}
          </Link>
        );
      })}
      <span
        ref={underlineRef}
        className={styles["tab-underline"]}
        style={underlineStyle}
      />
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
