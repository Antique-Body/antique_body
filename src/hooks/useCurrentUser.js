import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export const useCurrentUser = () => {
  const { data: session } = useSession();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch("/api/users/me");
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          throw new Error("Failed to fetch user data");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [session?.user?.id]);

  const getClientId = () => userData?.clientInfo?.id;

  const getTrainerId = () => userData?.trainerInfo?.id;

  const getRole = () => userData?.role;

  return {
    userData,
    loading,
    error,
    getClientId,
    getTrainerId,
    getRole,
  };
}; 