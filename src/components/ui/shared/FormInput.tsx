import * as React from "react";
import { cn } from "../../../lib/utils";

export interface IInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const FormInput = React.forwardRef<HTMLInputElement, IInputProps>(
  ({ className, name, label, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2 w-full">
        <label htmlFor={name} className="text-white text-lg">
          {label}
        </label>
        <input
          className={cn(
            "flex h-10 w-full text-white rounded-md border border-white bg-transparent py-2 px-3 text-sm placeholder:text-white focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 focus:border-red-500",
            className
          )}
          name={name}
          id={name}
          ref={ref}
          autoComplete="off"
          {...props}
        />
      </div>
    );
  }
);

export default FormInput;
