import React, { ForwardRefRenderFunction, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  ref: string;
  className?: string;
}

const defaultStyles: string =
  "p-2 border border-indigo-400 focus:outline-none focus:border-indigo-700 duration:100 rounded-md w-full";

const Input: ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
  { name, label, className, ...props },
  ref
) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label htmlFor={name}>{label}</label>
      <input
        name={name}
        id={name}
        className={`${defaultStyles + " " + className}`}
        {...props}
        ref={ref}
      />
    </div>
  );
};

const FormInput = React.forwardRef(Input);
export default FormInput;
