import React, { useEffect } from "react";
import { useAuth } from "../../../lib/hooks/useAuth";
import { Link } from "react-router-dom";
import Loading from "../../ui/shared/Loading";

const Profile: React.FC = () => {
  const { user, getProfile, loadingProfile } = useAuth();

  useEffect(() => {
    getProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loadingProfile) {
    return <Loading />;
  }

  return (
    <div className="p-12 dark:bg-black bg-white text-black w-full md:w-3/4 border-2 dark:border-gray-500 mx-auto dark:text-white border-gray-200">
      {user ? (
        <div className="flex flex-col gap-5">
          <h1 className="text-4xl font-bold text-center">
            {user.firstName} {user.lastName} (ID: {user.id})
          </h1>

          <h2 className="text-center text-2xl">Email: {user.email}</h2>
          <h2 className="text-center text-xl">Phone: {user.phoneNumber}</h2>
        </div>
      ) : (
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-5">Oops!</h1>
          <h2 className="text-3xl italic">
            You are not logged in!{" "}
            <Link to="/login" className="font-bold">
              Log in!
            </Link>
          </h2>
        </div>
      )}
    </div>
  );
};

export default Profile;
