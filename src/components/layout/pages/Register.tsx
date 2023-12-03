import { useState, ChangeEvent, FormEvent } from "react";
import { IUserForm, IError } from "../../../models/types";
import FormButton from "../../ui/shared/FormButton";
import FormInput from "../../ui/shared/FormInput";
import { axiosApi } from "../../../api/axios";
import { Link, useNavigate } from "react-router-dom";
import Errors from "../../ui/shared/Errors";
import toast from "react-hot-toast/headless";

const Register: React.FC = () => {
  const [user, setUser] = useState<IUserForm>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState<IError>({ errors: [] });

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
      .post("/register", user)
      .then((response) => {
        setErrors({ errors: [] });
        toast.success(`Registered user (${user.firstName} ${user.lastName})`);

        const { accessToken } = response.data;
        localStorage.setItem("accessToken", accessToken);

        reset();

        const token = localStorage.getItem("accessToken");
        if (token) {
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
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
    });
  };

  return (
    <>
      <form
        className="p-12 bg-black w-full md:w-1/2 border-2 border-gray-500 mx-auto"
        onSubmit={handleSubmit}
      >
        <h1 className="text-4xl font-bold text-white mb-7">Sign Up</h1>

        <div className="my-6">
          {errors.errors.length > 0 && <Errors errors={errors.errors} />}
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex justify-between gap-7">
            <FormInput
              label="First Name"
              name="firstName"
              value={user.firstName}
              onChange={handleChange}
            />
            <FormInput
              label="Last Name"
              name="lastName"
              value={user.lastName}
              onChange={handleChange}
            />
          </div>

          <FormInput
            label="Email"
            name="email"
            type="email"
            value={user.email}
            onChange={handleChange}
          />
          <FormInput
            label="Phone Number"
            name="phoneNumber"
            value={user.phoneNumber}
            onChange={handleChange}
          />
          <FormInput
            label="Password"
            name="password"
            type="password"
            value={user.password}
            onChange={handleChange}
          />

          <div className="mt-2">
            <p className="text-white mb-3">
              Having account?{" "}
              <Link to="/login" className="font-bold">
                Log in!
              </Link>
            </p>

            <FormButton size="lg" type="submit">
              Sign Up
            </FormButton>
          </div>
        </div>
      </form>
    </>
  );
};

export default Register;
