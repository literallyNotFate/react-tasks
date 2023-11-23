import React, { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  className?: string;
}

const defaultStyles: string =
  "p-2 border bg-indigo-400 focus:outline-none hover:bg-indigo-700 duration:100 rounded-md w-full text-white";

const FormButton: React.FC<ButtonProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <button className={`${defaultStyles} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default FormButton;
