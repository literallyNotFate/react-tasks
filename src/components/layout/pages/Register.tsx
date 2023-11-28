import { useState, ChangeEvent, FormEvent } from "react";
import { IUser, IError } from "../../../models/types";
import FormButton from "../../ui/shared/FormButton";
import FormInput from "../../ui/shared/FormInput";
import { axiosApi } from "../../../api/axios";
import { useNavigate } from "react-router-dom";
import Errors from "../../ui/Errors";

const Register = () => {
  const [user, setUser] = useState<IUser>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const navigate = useNavigate();

  const [errors, setErrors] = useState<IError>({ errors: [] });
  const [success, setSuccess] = useState<string>("");

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
        setSuccess(response.statusText);

        const { accessToken } = response.data;
        localStorage.setItem("accessToken", accessToken);

        setTimeout(() => {
          reset();
        }, 1000);

        setSuccess("");

        const token = localStorage.getItem("accessToken");
        if (token) {
          navigate("/products", { replace: true });
        }
      })
      .catch((err) => {
        setSuccess("");
        if (err.response?.data.message) {
          setErrors({ errors: err.response?.data.message });
        } else if (err.response?.data) {
          setErrors({ errors: [err.response?.data] });
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
        className="p-12 shadow-lg rounded-lg bg-white"
        onSubmit={handleSubmit}
      >
        <h1 className="text-center text-4xl font-bold text-indigo-500 mb-7">
          Sign Up
        </h1>

        {errors.errors.length > 0 && <Errors errors={errors.errors} />}

        {success && (
          <div className="p-3 bg-green-400 text-white rounded-md mb-3">
            {success}
          </div>
        )}

        <div className="flex flex-col gap-2">
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

          <div className="mt-5">
            <FormButton>Sign Up</FormButton>
          </div>
        </div>
      </form>
    </>
  );
};

export default Register;
