import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Button,
  TextField,
  Box,
  Tabs,
  Tab,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { executeReCaptchaToken } from "../../../services/authService/recaptchaService";
import styles from "./loginDialog.module.css";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type OTPContext =
  | "userSignup"
  | "adminLogin"
  | "adminForgot"
  | "adminEmail"
  | "adminEmailNew";

const LoginDialog: React.FC<Props> = ({ open, onClose, onSuccess }) => {
  const [role, setRole] = useState<"user" | "admin">("user");
  const [userTab, setUserTab] = useState(0);
  const [adminTab, setAdminTab] = useState(0);

  const [email, setEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [otpMap, setOtpMap] = useState<Record<OTPContext, string>>({
    userSignup: "",
    adminLogin: "",
    adminForgot: "",
    adminEmail: "",
    adminEmailNew: "",
  });

  const [otpEnabledMap, setOtpEnabledMap] = useState<
    Record<OTPContext, boolean>
  >({
    userSignup: false,
    adminLogin: false,
    adminForgot: false,
    adminEmail: false,
    adminEmailNew: false,
  });

  const [countdownMap, setCountdownMap] = useState<Record<OTPContext, number>>({
    userSignup: 0,
    adminLogin: 0,
    adminForgot: 0,
    adminEmail: 0,
    adminEmailNew: 0,
  });

  const { executeRecaptcha } = useGoogleReCaptcha();

  const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  useEffect(() => {
    const timers = Object.keys(countdownMap).map((key) => {
      const context = key as OTPContext;
      if (countdownMap[context] > 0) {
        return setInterval(() => {
          setCountdownMap((prev) => ({
            ...prev,
            [context]: Math.max(0, prev[context] - 1),
          }));
        }, 1000);
      }
      return null;
    });

    return () => timers.forEach((t) => t && clearInterval(t));
  }, [countdownMap]);

  const getOtp = async (context: OTPContext) => {
    const token = await executeReCaptchaToken("get_otp", executeRecaptcha);
    if (!token) return;

    console.log("OTP reCAPTCHA token:", token);
    setOtpMap((prev) => ({ ...prev, [context]: "123456" }));
    setOtpEnabledMap((prev) => ({ ...prev, [context]: true }));
    setCountdownMap((prev) => ({ ...prev, [context]: 30 }));
  };

  const verifyRecaptchaBeforeAction = async (
    action: string,
    callback: () => void
  ) => {
    if (!executeRecaptcha) {
      console.warn("reCAPTCHA not yet loaded");
      alert("reCAPTCHA is still loading. Please wait a moment and try again.");
      return;
    }

    try {
      const token = await executeReCaptchaToken(action, executeRecaptcha);
      if (!token) {
        alert("reCAPTCHA failed. Please try again.");
        return;
      }

      console.log(`reCAPTCHA token for ${action}:`, token);
      callback();
    } catch (err) {
      console.error("reCAPTCHA error:", err);
      alert("Unexpected error during reCAPTCHA. Try again.");
    }
  };

  const resetAll = () => {
    setEmail("");
    setNewEmail("");
    setPassword("");
    setConfirmPassword("");
    setOtpMap({
      userSignup: "",
      adminLogin: "",
      adminForgot: "",
      adminEmail: "",
      adminEmailNew: "",
    });
    setOtpEnabledMap({
      userSignup: false,
      adminLogin: false,
      adminForgot: false,
      adminEmail: false,
      adminEmailNew: false,
    });
    setCountdownMap({
      userSignup: 0,
      adminLogin: 0,
      adminForgot: 0,
      adminEmail: 0,
      adminEmailNew: 0,
    });
  };

  const renderOtp = (context: OTPContext) => (
    <Box className={styles.otpRow}>
      {otpEnabledMap[context] && (
        <TextField
          label="Enter OTP"
          value={otpMap[context]}
          onChange={(e) =>
            setOtpMap((prev) => ({ ...prev, [context]: e.target.value }))
          }
          autoComplete="off"
        />
      )}
      <Button
        variant="outlined"
        onClick={() => getOtp(context)}
        disabled={countdownMap[context] > 0 || !email}
        sx={{ ml: otpEnabledMap[context] ? 2 : 0 }}
      >
        {countdownMap[context] > 0
          ? `Wait (${countdownMap[context]}s)`
          : "Get OTP"}
      </Button>
    </Box>
  );

  const handleLogin = () => {
    verifyRecaptchaBeforeAction("user_login", () => {
      console.log("User Login reCAPTCHA passed");
      onSuccess();
    });
  };

  const handleRegister = () => {
    verifyRecaptchaBeforeAction("user_register", () => {
      console.log("User Register reCAPTCHA passed");
      onSuccess();
    });
  };

  const renderUser = () => (
    <>
      <Tabs
        value={userTab}
        onChange={(_, v) => {
          resetAll();
          setUserTab(v);
        }}
        className={styles.userMiniTabs}
      >
        <Tab label="Login" />
        <Tab label="Signup" />
      </Tabs>
      <TextField
        fullWidth
        margin="dense"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {userTab === 0 ? (
        <>
          <TextField
            fullWidth
            margin="dense"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
            disabled={!isValidEmail(email) || !password}
            onClick={handleLogin}
          >
            Login
          </Button>
        </>
      ) : (
        <>
          <TextField
            fullWidth
            margin="dense"
            label="Create Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          <TextField
            fullWidth
            margin="dense"
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />
          {renderOtp("userSignup")}
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
            disabled={
              !isValidEmail(email) ||
              password !== confirmPassword ||
              !otpMap.userSignup
            }
            onClick={handleRegister}
          >
            Register
          </Button>
        </>
      )}
    </>
  );

  const renderAdmin = () => (
    <>
      {adminTab !== 0 && (
        <Button size="small" onClick={() => setAdminTab(0)} sx={{ mb: 1 }}>
          <ArrowCircleLeftIcon fontSize="small" /> Back
        </Button>
      )}
      <Tabs
        value={adminTab}
        onChange={(_, v) => {
          resetAll();
          setAdminTab(v);
        }}
        className={styles.adminMiniTabs}
      >
        <Tab label="Login" />
        <Tab label="Forgot Password" />
        <Tab label="Update Email" />
      </Tabs>

      <TextField
        fullWidth
        margin="dense"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {(adminTab === 0 || adminTab === 1 || adminTab === 2) && (
        <>
          {renderOtp(
            adminTab === 0
              ? "adminLogin"
              : adminTab === 1
              ? "adminForgot"
              : "adminEmail"
          )}
        </>
      )}

      {adminTab === 0 && (
        <>
          <TextField
            fullWidth
            margin="dense"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
        </>
      )}

      {adminTab === 1 && (
        <>
          <TextField
            fullWidth
            margin="dense"
            label="New Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          <TextField
            fullWidth
            margin="dense"
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />
        </>
      )}

      {adminTab === 2 && (
        <>
          <TextField
            fullWidth
            margin="dense"
            label="New Email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          {renderOtp("adminEmailNew")}
          <TextField
            fullWidth
            margin="dense"
            label="Create Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </>
      )}

      <Button
        fullWidth
        variant="contained"
        sx={{ mt: 2 }}
        disabled={
          (adminTab === 0 && (!otpMap.adminLogin || !password)) ||
          (adminTab === 1 &&
            (!otpMap.adminForgot || password !== confirmPassword)) ||
          (adminTab === 2 &&
            (!otpMap.adminEmail ||
              !otpMap.adminEmailNew ||
              password !== confirmPassword ||
              !isValidEmail(newEmail)))
        }
        onClick={() => {
          let action = "";
          if (adminTab === 0) action = "admin_login";
          else if (adminTab === 1) action = "admin_update_password";
          else if (adminTab === 2) action = "admin_update_email";

          verifyRecaptchaBeforeAction(action, onSuccess);
        }}
      >
        {adminTab === 0 && "Login"}
        {adminTab === 1 && "Update Password"}
        {adminTab === 2 && "Update Email"}
      </Button>
    </>
  );

  return (
    <Dialog
      open={open}
      onClose={() => {}}
      disableEscapeKeyDown
      PaperProps={{ className: styles.dialogPaper }}
    >
      <DialogTitle className={styles.dialogTitle}>
        Authentication
        <IconButton className={styles.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box display="flex" justifyContent="center" gap={2} mb={2}>
          <Button
            variant={role === "user" ? "contained" : "outlined"}
            onClick={() => {
              resetAll();
              setRole("user");
            }}
          >
            User
          </Button>
          <Button
            variant={role === "admin" ? "contained" : "outlined"}
            onClick={() => {
              resetAll();
              setRole("admin");
            }}
          >
            Admin
          </Button>
        </Box>
        {role === "user" ? renderUser() : renderAdmin()}
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
