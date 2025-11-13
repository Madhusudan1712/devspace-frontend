// src/components/Loading/Loading.tsx
import styles from './loading.module.scss';

const Loading = () => {
  return (
    <div className={styles.backdrop}>
      <div className={styles.dialog}>
        <div className={styles.spinner}></div>
        <p className={styles.text}>Loading...</p>
      </div>
    </div>
  );
};

export default Loading;