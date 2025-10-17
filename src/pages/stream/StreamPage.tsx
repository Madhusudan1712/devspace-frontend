import { useEffect } from "react";
import Loading from "../../components/common/loading/Loading";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { fetchCurrentUser } from "../../features/auth/authThunks";

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
    <div>
      <h1>Stream Page</h1>
      {user ? (
        <div>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>Domain:</strong> {user.application}</p>
          <p><strong>Role:</strong> Mutiple roles </p>
        </div>
      ) : (
        <p>No user info found.</p>
      )}
    </div>
  );
}

export default StreamPage;
