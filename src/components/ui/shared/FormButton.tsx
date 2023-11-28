import React, { ReactNode, ButtonHTMLAttributes } from "react";

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  className?: string;
}

const defaultStyles: string =
  "p-2 border text-white bg-indigo-400 focus:outline-none hover:bg-indigo-700 duration:100 rounded-md w-full";

const FormButton: React.FC<IButtonProps> = ({
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
