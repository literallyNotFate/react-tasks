import { useAuth } from "../../../lib/hooks/useAuth";
import { useEffect } from "react";

const NotFound: React.FC = () => {
  const { getProfile } = useAuth();

  useEffect(() => {
    getProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="dark:text-white text-black text-center">
      <h1 className="text-6xl font-bold mb-5">Oops!</h1>
      <h2 className="text-3xl italic">Page was not found!</h2>
    </div>
  );
};

export default NotFound;
