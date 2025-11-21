import { useEffect } from "react";
import { Box, Container, Typography } from "@mui/material";
import Loading from "../../components/common/loading/Loading";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { fetchCurrentUser } from "../../features/auth/authThunks";
import StreamCard from "./components/streamCard/StreamCard";
import { sampleCards } from "./components/streamCard/streamData";
import styles from "./streamPage.module.scss";

function StreamPage() {
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      dispatch(fetchCurrentUser());
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (user) {
      console.log("User Info:", user);
    }
  }, [user]);

  if (loading) return <Loading />;

  return (
    <Container maxWidth="xl" className={styles.streamPage}>
      <Box className={styles.header}>
        <Typography variant="h2" component="h1" className={styles.pageTitle}>
          Latest Articles
        </Typography>
      </Box>

      <Box className={styles.cardGrid}>
        {sampleCards.map((card) => (
          <Box key={card.id} className={styles.cardWrapper}>
            <StreamCard data={card} />
          </Box>
        ))}
      </Box>
    </Container>
  );
}

export default StreamPage;
