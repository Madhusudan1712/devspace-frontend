import { Link } from "react-router-dom";
import AppButton from "@/components/common/button/AppButton";
import styles from "./notFoundPage.module.scss";

export default function NotFoundPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>404</h1>
      <p className={styles.message}>Oops! The page you're looking for doesn't exist.</p>
      <AppButton
        component={Link}
        to="/"
        variant="primary"
        className={styles.button}
      >
        Go Back
      </AppButton>
    </div>
  );
}
