import React from "react";
import { ButtonProps } from "@heroui/react";
import { cn } from "@heroui/react";

export interface StepNavigationProps
  extends React.HTMLAttributes<HTMLDivElement> {
  onBack?: () => void;
  onNext?: () => void;
  backButtonProps?: ButtonProps;
  nextButtonProps?: ButtonProps;
}

const StepNavigation = React.forwardRef<HTMLDivElement, StepNavigationProps>(
  (
    { className, onBack, onNext, backButtonProps, nextButtonProps, ...props },
    ref,
  ) => (
    <div
      ref={ref}
      className={cn(
        "mx-auto my-6 flex w-full items-center justify-end gap-x-4 lg:mx-0",
        className,
      )}
      {...props}
    >
      {/* <Button
        className="rounded-medium border-default-200 text-medium font-medium text-default-500 lg:hidden"
        variant="bordered"
        onPress={onBack}
        {...backButtonProps}
      >
        <Icon icon="lucide:arrow-left" width={24} />
        Go Back
      </Button>

      <Button
        className="text-medium font-medium bg-gradient-to-r from-secondary to-danger text-white"
        type="button"
        onPress={onNext}
        {...nextButtonProps}
      >
        {nextButtonProps?.children || "Continue"}
      </Button> */}
    </div>
  ),
);

StepNavigation.displayName = "StepNavigation";

export default StepNavigation;
