import { useLocale } from "@react-aria/i18n";

import { useTranslations } from "@/hooks/use-translation";

const Services: React.FC = () => {
  const { t } = useTranslations();
  const { locale } = useLocale();
  const isRTL = locale === "ar";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="flex flex-col relative overflow-hidden h-auto text-foreground box-border outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 shadow-medium rounded-large transition-transform-background motion-reduce:transition-none border-transparent bg-white/5 dark:bg-default-400/10 backdrop-blur-lg backdrop-saturate-[1.8]">
        <div
          className={
            isRTL
              ? "flex p-3 z-10 flex-row-reverse w-full justify-start items-center shrink-0 overflow-inherit color-inherit subpixel-antialiased rounded-t-large gap-2 pb-0"
              : "flex p-3 z-10 w-full justify-start items-center shrink-0 overflow-inherit color-inherit subpixel-antialiased rounded-t-large gap-2 pb-0"
          }
        >
          <div className="flex justify-center p-2 rounded-full items-center bg-secondary-100/80 text-pink-500">
            <svg
              aria-hidden="true"
              className="text-pink-500"
              fill="none"
              focusable="false"
              height="24"
              role="presentation"
              viewBox="0 0 24 24"
              width="24"
            >
              <path
                d="M3.5 20.5c.83.83 2.17.83 3 0l13-13c.83-.83.83-2.17 0-3-.83-.83-2.17-.83-3 0l-13 13c-.83.83-.83 2.17 0 3ZM18.01 8.99l-3-3"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
              <path
                d="M8.5 2.44 10 2l-.44 1.5L10 5l-1.5-.44L7 5l.44-1.5L7 2l1.5.44ZM4.5 8.44 6 8l-.44 1.5L6 11l-1.5-.44L3 11l.44-1.5L3 8l1.5.44ZM19.5 13.44 21 13l-.44 1.5L21 16l-1.5-.44L18 16l.44-1.5L18 13l1.5.44Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p className="text-base font-semibold">{t("ai_automation")}</p>
        </div>
        <div className="relative flex w-full p-3 flex-auto flex-col place-content-inherit align-items-inherit h-auto break-words text-left overflow-y-auto subpixel-antialiased">
          <p
            className={
              isRTL
                ? "font-normal text-medium text-default-500 text-right"
                : "font-normal text-medium text-default-500"
            }
          >
            {t("description_ai_automation")}
          </p>
        </div>
      </div>
      <div className="flex flex-col relative overflow-hidden h-auto text-foreground box-border outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 shadow-medium rounded-large transition-transform-background motion-reduce:transition-none border-transparent bg-white/5 dark:bg-default-400/10 backdrop-blur-lg backdrop-saturate-[1.8]">
        <div
          className={
            isRTL
              ? "flex p-3 z-10 flex-row-reverse w-full justify-start items-center shrink-0 overflow-inherit color-inherit subpixel-antialiased rounded-t-large gap-2 pb-0"
              : "flex p-3 z-10 w-full justify-start items-center shrink-0 overflow-inherit color-inherit subpixel-antialiased rounded-t-large gap-2 pb-0"
          }
        >
          <div className="flex justify-center p-2 rounded-full items-center bg-secondary-100/80 text-pink-500">
            <svg
              aria-hidden="true"
              className="text-pink-500"
              fill="none"
              focusable="false"
              height="24"
              role="presentation"
              viewBox="0 0 24 24"
              width="24"
            >
              <path
                d="M6.09 13.28h3.09v7.2c0 1.68.91 2.02 2.02.76l7.57-8.6c.93-1.05.54-1.92-.87-1.92h-3.09v-7.2c0-1.68-.91-2.02-2.02-.76l-7.57 8.6c-.92 1.06-.53 1.92.87 1.92Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit="10"
                strokeWidth="1.5"
              />
            </svg>
          </div>
          <p className="text-base font-semibold">{t("ai_integration")}</p>
        </div>
        <div className="relative flex w-full p-3 flex-auto flex-col place-content-inherit align-items-inherit h-auto break-words text-left overflow-y-auto subpixel-antialiased">
          <p
            className={
              isRTL
                ? "font-normal text-medium text-default-500 text-right"
                : "font-normal text-medium text-default-500"
            }
          >
            {t("description_ai_integration")}
          </p>
        </div>
      </div>
      <div className="flex flex-col relative overflow-hidden h-auto text-foreground box-border outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 shadow-medium rounded-large transition-transform-background motion-reduce:transition-none border-transparent bg-white/5 dark:bg-default-400/10 backdrop-blur-lg backdrop-saturate-[1.8]">
        <div
          className={
            isRTL
              ? "flex p-3 z-10 flex-row-reverse w-full justify-start items-center shrink-0 overflow-inherit color-inherit subpixel-antialiased rounded-t-large gap-2 pb-0"
              : "flex p-3 z-10 w-full justify-start items-center shrink-0 overflow-inherit color-inherit subpixel-antialiased rounded-t-large gap-2 pb-0"
          }
        >
          <div className="flex justify-center p-2 rounded-full items-center bg-secondary-100/80 text-pink-500">
            <svg
              aria-hidden="true"
              className="text-pink-500"
              fill="none"
              focusable="false"
              height="24"
              role="presentation"
              viewBox="0 0 24 24"
              width="24"
            >
              <path
                d="M21.25 12C21.25 14.4533 20.2754 16.806 18.5407 18.5407C16.806 20.2754 14.4533 21.25 12 21.25V22.75C17.937 22.75 22.75 17.937 22.75 12H21.25ZM12 21.25C9.54675 21.25 7.19397 20.2754 5.45926 18.5407C3.72455 16.806 2.75 14.4533 2.75 12H1.25C1.25 17.937 6.063 22.75 12 22.75V21.25ZM2.75 12C2.75 9.54675 3.72455 7.19397 5.45926 5.45926C7.19397 3.72455 9.54675 2.75 12 2.75V1.25C6.063 1.25 1.25 6.063 1.25 12H2.75ZM15.5 14.25C13.975 14.25 12.5125 13.6442 11.4341 12.5659C10.3558 11.4875 9.75 10.025 9.75 8.5H8.25C8.25 10.4228 9.01384 12.2669 10.3735 13.6265C11.7331 14.9862 13.5772 15.75 15.5 15.75V14.25ZM20.425 11.469C19.9133 12.3176 19.191 13.0197 18.3281 13.5069C17.4652 13.9942 16.491 14.2501 15.5 14.25V15.75C16.7494 15.7504 17.9777 15.4279 19.0657 14.8138C20.1537 14.1997 21.0646 13.3148 21.71 12.245L20.425 11.469ZM9.75 8.5C9.74986 7.50903 10.0058 6.53483 10.4931 5.67193C10.9803 4.80902 11.6824 4.08669 12.531 3.575L11.755 2.291C10.6854 2.93628 9.80058 3.84701 9.18649 4.93486C8.57239 6.02271 8.2498 7.25078 8.25 8.5H9.75ZM12 2.75C11.9497 2.74903 11.9002 2.73811 11.8542 2.71785C11.8082 2.6976 11.7666 2.66842 11.732 2.632C11.6898 2.58965 11.6613 2.53568 11.65 2.477C11.646 2.446 11.648 2.356 11.755 2.291L12.531 3.575C13.034 3.271 13.196 2.714 13.137 2.276C13.075 1.821 12.717 1.25 12 1.25V2.75ZM21.71 12.245C21.644 12.352 21.554 12.354 21.523 12.35C21.4643 12.3387 21.4103 12.3102 21.368 12.268C21.3316 12.2334 21.3024 12.1918 21.2821 12.1458C21.2619 12.0998 21.251 12.0503 21.25 12H22.75C22.75 11.283 22.179 10.925 21.724 10.863C21.286 10.804 20.729 10.966 20.425 11.469L21.71 12.245Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <p className="text-base font-semibold">{t("mobile_development")}</p>
        </div>
        <div className="relative flex w-full p-3 flex-auto flex-col place-content-inherit align-items-inherit h-auto break-words text-left overflow-y-auto subpixel-antialiased">
          <p
            className={
              isRTL
                ? "font-normal text-medium text-default-500 text-right"
                : "font-normal text-medium text-default-500"
            }
          >
            {t("description_mobile_development")}
          </p>
        </div>
      </div>
      <div className="flex flex-col relative overflow-hidden h-auto text-foreground box-border outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 shadow-medium rounded-large transition-transform-background motion-reduce:transition-none border-transparent bg-white/5 dark:bg-default-400/10 backdrop-blur-lg backdrop-saturate-[1.8]">
        <div
          className={
            isRTL
              ? "flex p-3 z-10 flex-row-reverse w-full justify-start items-center shrink-0 overflow-inherit color-inherit subpixel-antialiased rounded-t-large gap-2 pb-0"
              : "flex p-3 z-10 w-full justify-start items-center shrink-0 overflow-inherit color-inherit subpixel-antialiased rounded-t-large gap-2 pb-0"
          }
        >
          <div className="flex justify-center p-2 rounded-full items-center bg-secondary-100/80 text-pink-500">
            <svg
              aria-hidden="true"
              className="text-pink-500"
              fill="none"
              focusable="false"
              height="24"
              role="presentation"
              viewBox="0 0 24 24"
              width="24"
            >
              <path
                d="M10 16.95H6.21c-3.37 0-4.21-.84-4.21-4.21v-6c0-3.37.84-4.21 4.21-4.21h10.53c3.37 0 4.21.84 4.21 4.21M10 21.47v-4.52M2 12.95h8M6.74 21.47H10"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
              <path
                d="M22 12.8v5.71c0 2.37-.59 2.96-2.96 2.96h-3.55c-2.37 0-2.96-.59-2.96-2.96V12.8c0-2.37.59-2.96 2.96-2.96h3.55c2.37 0 2.96.59 2.96 2.96Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
              <path
                d="M17.244 18.25h.01"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </div>
          <p className="text-base font-semibold"> {t("web_development")} </p>
        </div>
        <div className="relative flex w-full p-3 flex-auto flex-col place-content-inherit align-items-inherit h-auto break-words text-left overflow-y-auto subpixel-antialiased">
          <p
            className={
              isRTL
                ? "font-normal text-medium text-default-500 text-right"
                : "font-normal text-medium text-default-500"
            }
          >
            {t("description_web_development")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Services;
