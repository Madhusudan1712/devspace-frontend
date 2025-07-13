import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import styles from "./notFoundPage.module.css";

export default function NotFoundPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>404</h1>
      <p className={styles.message}>Oops! The page you're looking for doesn't exist.</p>
      <Button
        component={Link}
        to="/"
        variant="contained"
        className={styles.button}
      >
        Go Back
      </Button>
    </div>
  );
}
