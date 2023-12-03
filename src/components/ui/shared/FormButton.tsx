import { VariantProps } from "class-variance-authority";
import { cn } from "../../../lib/utils";
import * as React from "react";
import { Link } from "react-router-dom";
import { variants } from "../../../lib/constants";

interface IButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof variants> {
  href?: string;
}

const FormButton = React.forwardRef<HTMLButtonElement, IButtonProps>(
  ({ className, children, href, variant, size, ...props }, ref) => {
    if (href) {
      return (
        <Link to={href} className={cn(variants({ variant, size, className }))}>
          {children}
        </Link>
      );
    }
    return (
      <button
        className={cn(variants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

export default FormButton;
