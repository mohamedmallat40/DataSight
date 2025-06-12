import React from "react";
import { domAnimation, LazyMotion, m } from "framer-motion";
import { BusinessCardData, emptyBusinessCardData } from "../../../types/types";
import WizardSidebar from "./wizard-sidebar";
import UploadImageStep from "./upload-image-step";
import EditDataStep from "./edit-data-step";
import EnrichDataStep from "./enrich-data-step";
import CompleteStep from "./complete-step";
import StepNavigation from "./step-navigation";

const variants = {
  enter: (direction: number) => ({
    y: direction > 0 ? 30 : -30,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    y: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    y: direction < 0 ? 30 : -30,
    opacity: 0,
  }),
};

type MultiStepWizardProps = {
  onClose: () => void;
};

export default function MultiStepWizard({ onClose }: MultiStepWizardProps) {
  const [[page, direction], setPage] = React.useState([0, 0]);
  const [businessCardData, setBusinessCardData] =
    React.useState<BusinessCardData>(emptyBusinessCardData);
  const [uploadedImage, setUploadedImage] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  React.useEffect(() => {
    // Reset state when the component mounts
    setBusinessCardData(emptyBusinessCardData);
    setUploadedImage(null);
    setIsLoading(false);
  }, []);

  const paginate = React.useCallback((newDirection: number) => {
    setPage((prev) => {
      const nextPage = prev[0] + newDirection;
      if (nextPage < 0 || nextPage > 3) return prev;
      return [nextPage, newDirection];
    });
  }, []);

  const onChangePage = React.useCallback((newPage: number) => {
    setPage((prev) => {
      if (newPage < 0 || newPage > 3) return prev;
      const currentPage = prev[0];
      return [newPage, newPage > currentPage ? 1 : -1];
    });
  }, []);

  const onBack = React.useCallback(() => {
    paginate(-1);
  }, [paginate]);

  const onNext = React.useCallback(() => {
    paginate(1);
  }, [paginate]);

  const content = React.useMemo(() => {
    let component = (
      <UploadImageStep
        onImageUpload={(frontImage, backImage, extractedData) => {
          setUploadedImage(frontImage); // Assuming frontImage is a base64 string
          setBusinessCardData(extractedData);
        }}
        onNextStep={onNext}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
    );

    switch (page) {
      case 1:
        component = (
          <EditDataStep
            businessCardData={businessCardData}
            setBusinessCardData={setBusinessCardData}
            uploadedImage={uploadedImage}
            onNextStep={onClose}
          />
        );
        break;
      case 2:
        component = (
          <EnrichDataStep
            businessCardData={businessCardData}
            setBusinessCardData={setBusinessCardData}
          />
        );
        break;
      case 3:
        component = (
          <CompleteStep
            businessCardData={businessCardData}
            uploadedImage={uploadedImage}
          />
        );
        break;
    }

    return (
      <LazyMotion features={domAnimation}>
        <m.div
          key={page}
          animate="center"
          className="col-span-12"
          custom={direction}
          exit="exit"
          initial="exit"
          transition={{
            y: { ease: "backOut", duration: 0.7 },
            opacity: { duration: 0.6 },
          }}
          variants={variants}
        >
          {component}
        </m.div>
      </LazyMotion>
    );
  }, [direction, page, businessCardData, uploadedImage, isLoading, onNext]);

  return (
    <WizardSidebar
      currentPage={page}
      onBack={onBack}
      onChangePage={onChangePage}
      onNext={onNext}
    >
      <div className="relative flex h-fit w-full flex-col pt-6 text-center lg:h-full lg:justify-center lg:pt-0">
        {content}
        <StepNavigation
          backButtonProps={{ isDisabled: page === 0 }}
          className="hidden justify-start lg:flex"
          nextButtonProps={{
            children:
              page === 0
                ? "Continue to Edit"
                : page === 1
                  ? "Continue to Enrich"
                  : page === 2,
            // ? "Complete"
            // : "Finish",
          }}
          onBack={onBack}
          onNext={onNext}
        />
      </div>
    </WizardSidebar>
  );
}
