"use client";

import React from "react";
import { useLocale } from "@react-aria/i18n";

import { title, subtitle } from "@/components/primitives";
import { useTranslations } from "@/hooks/use-translation";

const TachnoSection = () => {
  const { t } = useTranslations();
  const { locale } = useLocale();
  const isRTL = locale === "ar";

  const sponsors = [
    {
      id: 1,
      name: "JavaScript",
      img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    },
    {
      id: 2,
      name: "TypeScript",
      img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    },
    {
      id: 3,
      name: "Python",
      img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    },
    {
      id: 4,
      name: "NestJS",
      img: "https://nestjs.com/img/logo-small.svg",
      isPremium: true,
    },
    {
      id: 5,
      name: "ExpressJS",
      img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
    },
    { id: 6, name: "AWS", img: "https://cdn.simpleicons.org/apachekafka" },
    {
      id: 7,
      name: "MongoDB",
      img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
      isPrimary: true,
    },
    {
      id: 8,
      name: "PostgreSQL",
      img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
      isPremium: true,
    },
    {
      id: 9,
      name: "MySQL",
      img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
    },
    {
      id: 10,
      name: "Docker",
      img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
    },
    {
      id: 11,
      name: "Kubernetes",
      img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg",
    },
    {
      id: 12,
      name: "Redis",
      img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg",
    },
    {
      id: 13,
      name: "Elasticsearch",
      img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/elasticsearch/elasticsearch-original.svg",
    },
    {
      id: 14,
      name: "React",
      img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    },
    {
      id: 15,
      name: "Next.js",
      img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
    },
    {
      id: 16,
      name: "GraphQL",
      img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg",
      isPremium: true,
    },
    {
      id: 17,
      name: "Linux",
      img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg",
      isPremium: true,
    },
  ];

  return (
    <section className="relative gap-2 w-full flex flex-col items-center z-20 mt-16 lg:mt-44">
      <div className="max-w-4xl flex flex-col gap-8">
        <div>
          <div className="flex flex-col gap-2 justify-center w-full text-center items-center">
            <div className="flex md:inline-flex flex-col md:flex-row items-center">
              <h1 className={title({ size: "lg" })}>
                {" "}
                {t("title_tech_we_use")} &nbsp;
              </h1>
              <svg
                aria-hidden="true"
                className="text-pink-500 animate-heartbeat"
                fill="none"
                focusable="false"
                height="50"
                role="presentation"
                style={{ animationDuration: "2.5s" }}
                viewBox="0 0 24 24"
                width="50"
              >
                <path
                  d="M16.44 3.10156C14.63 3.10156 13.01 3.98156 12 5.33156C10.99 3.98156 9.37 3.10156 7.56 3.10156C4.49 3.10156 2 5.60156 2 8.69156C2 9.88156 2.19 10.9816 2.52 12.0016C4.1 17.0016 8.97 19.9916 11.38 20.8116C11.72 20.9316 12.28 20.9316 12.62 20.8116C15.03 19.9916 19.9 17.0016 21.48 12.0016C21.81 10.9816 22 9.88156 22 8.69156C22 5.60156 19.51 3.10156 16.44 3.10156Z"
                  fill="currentColor"
                />
              </svg>
            </div>
          </div>
          <p className={isRTL ? subtitle() + " text-right" : subtitle()}>
            {t("description_tech_we_use")}
          </p>

          <div className="relative mt-48 md:mt-60 w-full flex items-center justify-center ">
            <div className="relative inline-block">
              <div
                className="relative flex items-center justify-center text-center rounded-full bg-transparent"
                style={{ width: "80px", height: "80px" }}
              >
                <button
                  aria-label="Become a sponsor"
                  className="group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden tap-highlight-transparent transform-gpu data-[pressed=true]:scale-[0.97] outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 text-small gap-2 rounded-full px-0 !gap-0 transition-transform-colors-opacity motion-reduce:transition-none bg-default text-default-foreground min-w-10 data-[hover=true]:opacity-hover z-50 w-auto h-auto bg-gradient-to-b from-[#FF1CF7] to-[#7928CA]"
                  tabIndex={0}
                  type="button"
                >
                  <svg
                    aria-hidden="true"
                    className="flex items-center justify-center rounded-full text-white"
                    fill="none"
                    focusable="false"
                    height="54"
                    role="presentation"
                    viewBox="0 0 24 24"
                    width="54"
                  >
                    <g
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    >
                      <path d="M6 12h12" />
                      <path d="M12 18V6" />
                    </g>
                  </svg>
                </button>
              </div>
              <div
                className="absolute rounded-full bg-transparent"
                style={{ width: "130px", top: "21.6667px", left: "21.6667px" }}
              >
                {sponsors.map((sponsor, index) => {
                  // Calculate positions in a circle
                  const angle = (index / sponsors.length) * 2 * Math.PI;
                  const radius = 65; // Half of the width
                  const x = Math.cos(angle) * radius * 2;
                  const y = Math.sin(angle) * radius * 2;

                  return (
                    <span
                      key={sponsor.id}
                      className={`flex justify-center items-center box-border overflow-hidden align-middle z-0 outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 ${
                        sponsor.isPremium
                          ? "w-14 h-14 text-small text-warning-foreground"
                          : "w-10 h-10 text-tiny"
                      } ${
                        sponsor.isPrimary
                          ? "text-primary-foreground"
                          : "text-default-foreground"
                      } rounded-full ring-2 ring-offset-2 ring-offset-background dark:ring-offset-background-dark ${
                        sponsor.isPrimary ? "ring-primary" : "ring-default"
                      } absolute cursor-pointer bg-transparent before:bg-white/10 before:content-[''] before:block before:z-[-1] before:absolute before:inset-0 before:backdrop-blur-md before:backdrop-saturate-200`}
                      style={{ transform: `translate(${x}px, ${y}px)` }}
                      tabIndex={-1}
                    >
                      {sponsor.img?.includes("undefined") ? (
                        <>
                          <img
                            alt={sponsor.name}
                            className="flex object-cover w-full h-full transition-opacity !duration-500 opacity-0 data-[loaded=true]:opacity-100"
                            src={sponsor.img}
                          />
                          <span
                            aria-label={sponsor.name}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-normal text-center text-inherit"
                            role="img"
                          >
                            {sponsor.name}
                          </span>
                        </>
                      ) : (
                        <img
                          alt={sponsor.name}
                          className="flex object-cover w-full h-full transition-opacity !duration-500 opacity-0 data-[loaded=true]:opacity-100"
                          data-loaded="true"
                          src={sponsor.img}
                        />
                      )}
                    </span>
                  );
                })}
              </div>
              <div className="absolute top-1/2 left-1/2 overflow-visible -z-10">
                <div
                  className="absolute animate-expand rounded-full"
                  style={{
                    width: "120px",
                    height: "120px",
                    top: "calc(-60px)",
                    left: "calc(-60px)",
                    animationPlayState: "running",
                    animationDelay: "1s",
                    border: "1.5px solid rgba(121, 40, 202, 0.4)",
                    background:
                      "linear-gradient(-180deg, rgba(121,40,202,0.4) 40%, hsl(var(--heroui-background)) 100%)",
                  }}
                />
                <div
                  className="circle circle-1 absolute animate-expand-opacity"
                  style={{
                    width: "200px",
                    height: "200px",
                    borderRadius: "50%",
                    top: "calc(-100px)",
                    left: "calc(-100px)",
                    animationPlayState: "running",
                    animationDelay: "0.5s",
                    border: "1px solid rgba(121, 40, 202, 0.4)",
                    background:
                      "linear-gradient(-180deg, rgba(121,40,202,0.30000000000000004) 20%, hsl(var(--heroui-background)) 100%)",
                  }}
                />
                <div
                  className="circle circle-2 absolute animate-expand-opacity"
                  style={{
                    width: "280px",
                    height: "280px",
                    borderRadius: "50%",
                    top: "calc(-140px)",
                    left: "calc(-140px)",
                    animationPlayState: "running",
                    animationDelay: "1s",
                    border: "1px solid rgba(121, 40, 202, 0.3)",
                    background:
                      "linear-gradient(-180deg, rgba(121,40,202,0.2) 20%, hsl(var(--heroui-background)) 100%)",
                  }}
                />
                <div
                  className="circle circle-3 absolute animate-expand-opacity"
                  style={{
                    width: "360px",
                    height: "360px",
                    borderRadius: "50%",
                    top: "calc(-180px)",
                    left: "calc(-180px)",
                    animationPlayState: "running",
                    animationDelay: "1.5s",
                    border: "1px solid rgba(121, 40, 202, 0.2)",
                    background:
                      "linear-gradient(-180deg, rgba(121,40,202,0.09999999999999998) 20%, hsl(var(--heroui-background)) 100%)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TachnoSection;
