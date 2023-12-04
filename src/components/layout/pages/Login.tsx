import { useState, FormEvent, ChangeEvent } from "react";
import FormInput from "../../ui/shared/FormInput";
import { axiosApi } from "../../../api/axios";
import FormButton from "../../ui/shared/FormButton";
import { Link, useNavigate } from "react-router-dom";
import { ILogin, IError } from "../../../models/types";
import Errors from "../../ui/shared/Errors";
import toast from "react-hot-toast";
import { useAuth } from "../../../lib/hooks/useAuth";

const Login: React.FC = () => {
  const [user, setUser] = useState<ILogin>({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState<IError>({ errors: [] });

  const { getProfile } = useAuth();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    axiosApi
      .post("/login", user)
      .then((response) => {
        setErrors({ errors: [] });
        toast.success("Logged in as " + user.email);

        const { accessToken } = response.data;
        localStorage.setItem("accessToken", accessToken);

        reset();

        const token = localStorage.getItem("accessToken");
        if (token) {
          getProfile();
          navigate("/products", { replace: true });
        }
      })
      .catch((err) => {
        if (Array.isArray(err.response?.data.message)) {
          setErrors({ errors: err.response?.data.message });
        } else {
          setErrors({ errors: [err.response?.data.message] });
        }
      });
  };

  const reset = () => {
    setErrors({ errors: [] });
    setUser({
      email: "",
      password: "",
    });
  };

  return (
    <>
      <form
        className="p-12 bg-black w-full md:w-1/2 border-2 border-gray-500 mx-auto"
        onSubmit={handleSubmit}
      >
        <h1 className="text-4xl font-bold text-white mb-7">Sign In</h1>

        <div className="my-6">
          {errors.errors.length > 0 && <Errors errors={errors.errors} />}
        </div>

        <div className="flex flex-col gap-5">
          <FormInput
            label="Email"
            name="email"
            type="email"
            onChange={handleChange}
          />
          <FormInput
            label="Password"
            name="password"
            type="password"
            onChange={handleChange}
          />
        </div>

        <div className="mt-6">
          <p className="text-white mb-3">
            No account?{" "}
            <Link to="/register" className="font-bold">
              Make one!
            </Link>
          </p>

          <FormButton size="lg" type="submit">
            Sign In
          </FormButton>
        </div>
      </form>
    </>
  );
};

export default Login;
