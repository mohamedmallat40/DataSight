import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { Spinner } from "@heroui/react";
import { Icon } from "@iconify/react";

import DefaultLayout from "@/layouts/default";

export default function Custom404(): JSX.Element {
  const router = useRouter();

  useEffect(() => {
    // Redirect to statistics page after a brief delay
    const timer = setTimeout(() => {
      router.replace("/statistics");
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 min-h-[60vh]">
        <div className="text-center">
          {/* 404 Icon */}
          <div className="mb-6">
            <Icon
              className="text-warning mx-auto"
              height={80}
              icon="solar:question-circle-linear"
              width={80}
            />
          </div>

          {/* 404 Message */}
          <h1 className="text-4xl font-bold text-default-900 mb-2">
            404 - Page Not Found
          </h1>
          <p className="text-lg text-default-600 mb-6">
            The page you&apos;re looking for doesn&apos;t exist.
          </p>

          {/* Redirect Message */}
          <div className="flex items-center justify-center gap-3 p-4 bg-primary/10 rounded-lg border border-primary/20 max-w-md mx-auto">
            <Spinner color="primary" size="sm" />
            <div className="text-left">
              <p className="text-sm font-medium text-primary">
                Redirecting to Statistics...
              </p>
              <p className="text-xs text-default-500">
                You&apos;ll be redirected in 2 seconds
              </p>
            </div>
          </div>

          {/* Manual Navigation */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2"
              onClick={() => router.push("/statistics")}
            >
              <Icon icon="lucide:line-chart" width={18} />
              Go to Statistics
            </button>
            <button
              className="px-6 py-3 bg-default-100 text-default-900 rounded-lg hover:bg-default-200 transition-colors flex items-center gap-2"
              onClick={() => router.push("/table")}
            >
              <Icon icon="solar:users-group-two-rounded-linear" width={18} />
              Go to Contacts
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-sm text-default-500">
              If you believe this is an error, please check the URL or contact
              support.
            </p>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
