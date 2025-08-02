// StreamPage.tsx
import { useEffect } from "react";
import Loading from "../../components/common/loading/Loading";
import useAuthCheck from "../../hooks/useAuthCheck";

function StreamPage() {
  const { loading, user } = useAuthCheck();

  useEffect(() => {
    console.log("User Info:", user); // ✅ Safe placement
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
          <p><strong>Domain:</strong> {user.domain}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>
      ) : (
        <p>No user info found.</p>
      )}
    </div>
  );
}

export default StreamPage;
