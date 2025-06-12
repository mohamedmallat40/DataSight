import React, { HTMLAttributes } from "react";
import { Button, cn } from "@heroui/react";
import { Icon } from "@iconify/react";
import VerticalSteps from "./vertical-step";
import RowSteps from "./row-steps";
import SupportCard from "./support-card";
import StepNavigation from "./step-navigation";

export type WizardSidebarProps = HTMLAttributes<HTMLDivElement> & {
  currentPage: number;
  onBack: () => void;
  onNext: () => void;
  onChangePage: (page: number) => void;
};

const stepperClasses = cn(
  // light
  "[--step-color:hsl(var(--heroui-secondary-400))]",
  "[--active-color:hsl(var(--heroui-secondary-400))]",
  "[--inactive-border-color:hsl(var(--heroui-secondary-200))]",
  "[--inactive-bar-color:hsl(var(--heroui-secondary-200))]",
  "[--inactive-color:hsl(var(--heroui-secondary-300))]",
  // dark
  "dark:[--step-color:rgba(255,255,255,0.1)]",
  "dark:[--active-color:hsl(var(--heroui-foreground-600))]",
  "dark:[--active-border-color:rgba(255,255,255,0.5)]",
  "dark:[--inactive-border-color:rgba(255,255,255,0.1)]",
  "dark:[--inactive-bar-color:rgba(255,255,255,0.1)]",
  "dark:[--inactive-color:rgba(255,255,255,0.2)]"
);

const WizardSidebar = React.forwardRef<HTMLDivElement, WizardSidebarProps>(
  (
    {
      children,
      className,
      currentPage,
      onBack,
      onNext,
      onChangePage,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn("flex h-[calc(100vh_-_150px)] w-full gap-x-2", className)}
        {...props}
      >
        <div className="flex hidden h-full w-[344px] flex-shrink-0 flex-col items-start gap-y-8 rounded-large bg-gradient-to-b from-default-100 via-danger-100 to-secondary-100 px-8 py-6 shadow-small lg:flex">
          <Button
            className="bg-default-50 text-small font-medium text-default-500 shadow-lg"
            isDisabled={currentPage === 0}
            radius="full"
            variant="flat"
            onPress={onBack}
          >
            <Icon icon="lucide:arrow-left" width={18} />
            Back
          </Button>
          <div>
            <div className="text-xl font-medium leading-7 text-default-foreground">
              Business Card Scanner
            </div>
            <div className="mt-1 text-base font-medium leading-6 text-default-500">
              Extract and enrich contact information from business cards
            </div>
          </div>
          {/* Desktop Steps */}
          <VerticalSteps
            className={stepperClasses}
            color="secondary"
            currentStep={currentPage}
            steps={[
              {
                title: "Upload Image",
                description: "Upload a business card photo",
              },
              {
                title: "Edit Information",
                description: "Review extracted data",
              },
              // {
              //   title: "Enrich Data",
              //   description: "Find additional information",
              // },
              // {
              //   title: "Complete",
              //   description: "Finalize contact details",
              // },
            ]}
            onStepChange={onChangePage}
          />
          <SupportCard className="w-full backdrop-blur-lg lg:bg-white/40 lg:shadow-none dark:lg:bg-white/20" />
        </div>
        <div className="flex h-full w-full flex-col items-center gap-4 md:p-4 overflow-hidden">
          <div className="sticky top-0 z-10 w-full rounded-large bg-gradient-to-r from-default-100 via-danger-100 to-secondary-100 py-4 shadow-small md:max-w-xl lg:hidden flex-shrink-0">
            <div className="flex justify-center">
              {/* Mobile Steps */}
              <RowSteps
                className={cn("pl-6", stepperClasses)}
                currentStep={currentPage}
                steps={[
                  {
                    title: "Upload",
                  },
                  {
                    title: "Edit",
                  },
                  // {
                  //   title: "Enrich",
                  // },
                  // {
                  //   title: "Complete",
                  // },
                ]}
                onStepChange={onChangePage}
              />
            </div>
          </div>
          <div className="flex-1 w-full p-4 sm:max-w-md md:max-w-lg overflow-y-auto">
            <div className="min-h-full flex flex-col">
              <div className="flex-1">{children}</div>
              <StepNavigation
                backButtonProps={{ isDisabled: currentPage === 0 }}
                className="lg:hidden mt-4 flex-shrink-0"
                nextButtonProps={{
                  children:
                    currentPage === 0
                      ? "Continue to Edit"
                      : currentPage === 1
                        ? "Continue to Enrich"
                        : currentPage === 2
                          ? "Complete"
                          : "Finish",
                }}
                onBack={onBack}
                onNext={onNext}
              />
              <SupportCard className="mx-auto w-full max-w-[252px] lg:hidden mt-4 flex-shrink-0" />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

WizardSidebar.displayName = "WizardSidebar";

export default WizardSidebar;
