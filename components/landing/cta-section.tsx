"use client";

import React from "react";
import { Button, Card, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { useRouter } from "next/router";

export default function CTASection() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/register");
  };

  const handleContactSales = () => {
    router.push("/contacts");
  };

  return (
    <section className="py-24 px-4 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <LazyMotion features={domAnimation}>
          <m.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Card className="overflow-hidden border-0 bg-gradient-to-br from-primary via-primary to-secondary shadow-2xl">
              <CardBody className="relative p-12 text-center text-white">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 left-0 h-40 w-40 rounded-full bg-white/20 blur-3xl" />
                  <div className="absolute bottom-0 right-0 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
                  <div className="absolute top-1/2 left-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/15 blur-2xl" />
                </div>

                <div className="relative z-10">
                  {/* Icon */}
                  <div className="mb-6 flex justify-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                      <Icon
                        className="text-white"
                        icon="solar:rocket-2-outline"
                        width={40}
                      />
                    </div>
                  </div>

                  {/* Headline */}
                  <h2 className="mb-6 text-3xl font-bold sm:text-4xl lg:text-5xl">
                    Ready to Transform Your
                    <br />
                    Healthcare Practice?
                  </h2>

                  {/* Description */}
                  <p className="mb-10 text-lg opacity-90 sm:text-xl">
                    Join thousands of healthcare professionals who trust All
                    Care Medical to streamline their operations and improve
                    patient outcomes with AI.
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-6">
                    <Button
                      className="h-14 bg-white px-8 text-base font-semibold text-primary shadow-lg hover:shadow-xl hover:scale-105"
                      radius="full"
                      size="lg"
                      onPress={handleGetStarted}
                    >
                      <Icon icon="solar:user-plus-outline" width={20} />
                      Start Free Trial
                    </Button>
                    <Button
                      className="h-14 border-2 border-white/30 px-8 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/10"
                      radius="full"
                      size="lg"
                      variant="bordered"
                      onPress={handleContactSales}
                    >
                      <Icon icon="solar:phone-outline" width={20} />
                      Contact Sales
                    </Button>
                  </div>

                  {/* Trust Indicators */}
                  <div className="mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row">
                    <div className="flex items-center gap-2 text-sm opacity-80">
                      <Icon icon="solar:shield-check-outline" width={20} />
                      <span>HIPAA Compliant</span>
                    </div>
                    <div className="hidden h-4 w-px bg-white/30 sm:block" />
                    <div className="flex items-center gap-2 text-sm opacity-80">
                      <Icon icon="solar:clock-circle-outline" width={20} />
                      <span>Setup in 5 minutes</span>
                    </div>
                    <div className="hidden h-4 w-px bg-white/30 sm:block" />
                    <div className="flex items-center gap-2 text-sm opacity-80">
                      <Icon
                        icon="solar:users-group-rounded-outline"
                        width={20}
                      />
                      <span>24/7 Support</span>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </m.div>
        </LazyMotion>
      </div>
    </section>
  );
}
