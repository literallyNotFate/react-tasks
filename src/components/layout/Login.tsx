import { useState, FormEvent, ChangeEvent } from "react";
import FormInput from "../ui/FormInput";
import { axiosApi } from "../../api/axios";
import FormButton from "../ui/FormButton";
import { useNavigate } from "react-router-dom";
import { ILogin, IError } from "../../models/types";
import Errors from "../ui/Errors";

const Login = () => {
  const [user, setUser] = useState<ILogin>({
    email: "",
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
      .post("/login", user)
      .then((response) => {
        setErrors({ errors: [] });
        // setSuccess(response.statusText);

        const { accessToken } = response.data;
        localStorage.setItem("accessToken", accessToken);

        setTimeout(() => {
          reset();
        }, 1000);

        //setSuccess("");

        const token = localStorage.getItem("accessToken");
        if (token) {
          navigate("/products", { replace: true });
        }
      })
      .catch((err) => {
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
      email: "",
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
          Sign In
        </h1>

        {errors.errors.length > 0 && <Errors errors={errors.errors} />}

        <div className="flex flex-col gap-2">
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

        <div className="mt-5">
          <FormButton>Sign In</FormButton>
        </div>
      </form>
    </>
  );
};

export default Login;
