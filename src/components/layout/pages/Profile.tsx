import React, { useEffect } from "react";
import { useAuth } from "../../../lib/hooks/useAuth";
import { Link } from "react-router-dom";

const Profile: React.FC = () => {
  const { user, getProfile } = useAuth();

  useEffect(() => {
    getProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-12 bg-black w-full md:w-3/4 border-2 border-gray-500 mx-auto text-white">
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
