import React from "react";
import { Card, CardHeader, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react";

import DefaultLayout from "@/layouts/default";

export default function StatisticsPage(): JSX.Element {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className="text-4xl font-bold leading-tight tracking-tighter md:text-6xl">
            Statistics
          </h1>
          <p className="text-lg text-default-600 mt-4">
            Comprehensive analytics and insights dashboard
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl px-6 mt-8">
          {/* Total Contacts Card */}
          <Card className="p-4">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Icon
                    icon="solar:users-group-two-rounded-linear"
                    className="text-primary"
                    width={24}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Total Contacts</h3>
                  <p className="text-small text-default-500">
                    All contacts in database
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <div className="text-3xl font-bold text-primary">0</div>
              <p className="text-small text-default-500 mt-1">
                No contacts available yet
              </p>
            </CardBody>
          </Card>

          {/* New Contacts This Month */}
          <Card className="p-4">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-success/10 rounded-lg">
                  <Icon
                    icon="solar:calendar-add-linear"
                    className="text-success"
                    width={24}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">New This Month</h3>
                  <p className="text-small text-default-500">
                    Contacts added this month
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <div className="text-3xl font-bold text-success">0</div>
              <p className="text-small text-default-500 mt-1">
                No new contacts this month
              </p>
            </CardBody>
          </Card>

          {/* Gender Distribution */}
          <Card className="p-4">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <Icon
                    icon="solar:pie-chart-2-linear"
                    className="text-secondary"
                    width={24}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Gender Distribution</h3>
                  <p className="text-small text-default-500">
                    Contact gender breakdown
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-small flex items-center gap-2">
                    <Icon
                      icon="lucide:user"
                      className="text-blue-500"
                      width={16}
                    />
                    Male
                  </span>
                  <span className="text-small font-medium">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-small flex items-center gap-2">
                    <Icon
                      icon="lucide:user"
                      className="text-pink-500"
                      width={16}
                    />
                    Female
                  </span>
                  <span className="text-small font-medium">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-small flex items-center gap-2">
                    <Icon
                      icon="lucide:help-circle"
                      className="text-gray-500"
                      width={16}
                    />
                    Unknown
                  </span>
                  <span className="text-small font-medium">0</span>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Top Industries */}
          <Card className="p-4 md:col-span-2 lg:col-span-1">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <Icon
                    icon="solar:buildings-2-linear"
                    className="text-warning"
                    width={24}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Top Industries</h3>
                  <p className="text-small text-default-500">
                    Most common industries
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <div className="text-center text-default-500 py-4">
                <Icon
                  icon="solar:chart-square-linear"
                  width={48}
                  className="mx-auto mb-2 opacity-50"
                />
                <p className="text-small">No industry data available</p>
              </div>
            </CardBody>
          </Card>

          {/* Top Countries */}
          <Card className="p-4 md:col-span-2 lg:col-span-1">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-danger/10 rounded-lg">
                  <Icon
                    icon="solar:global-linear"
                    className="text-danger"
                    width={24}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Top Countries</h3>
                  <p className="text-small text-default-500">
                    Most common countries
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <div className="text-center text-default-500 py-4">
                <Icon
                  icon="solar:map-point-linear"
                  width={48}
                  className="mx-auto mb-2 opacity-50"
                />
                <p className="text-small">No location data available</p>
              </div>
            </CardBody>
          </Card>

          {/* Recent Activity */}
          <Card className="p-4 md:col-span-2 lg:col-span-1">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-default/10 rounded-lg">
                  <Icon
                    icon="solar:clock-circle-linear"
                    className="text-default-600"
                    width={24}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Recent Activity</h3>
                  <p className="text-small text-default-500">
                    Latest contact additions
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <div className="text-center text-default-500 py-4">
                <Icon
                  icon="solar:history-linear"
                  width={48}
                  className="mx-auto mb-2 opacity-50"
                />
                <p className="text-small">No recent activity</p>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Coming Soon Message */}
        <div className="text-center mt-8 max-w-2xl">
          <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
            <CardBody>
              <Icon
                icon="solar:chart-line-up-linear"
                width={64}
                className="mx-auto mb-4 text-primary"
              />
              <h2 className="text-2xl font-bold text-primary mb-2">
                Analytics Dashboard Coming Soon
              </h2>
              <p className="text-default-600">
                We're working on comprehensive analytics and reporting features.
                This dashboard will show detailed insights about your contacts,
                including growth trends, demographic analysis, and performance
                metrics.
              </p>
              <div className="flex justify-center gap-4 mt-4 text-small text-default-500">
                <span className="flex items-center gap-1">
                  <Icon
                    icon="solar:check-circle-linear"
                    width={16}
                    className="text-success"
                  />
                  Contact Management
                </span>
                <span className="flex items-center gap-1">
                  <Icon
                    icon="solar:clock-circle-linear"
                    width={16}
                    className="text-warning"
                  />
                  Advanced Analytics
                </span>
                <span className="flex items-center gap-1">
                  <Icon
                    icon="solar:clock-circle-linear"
                    width={16}
                    className="text-warning"
                  />
                  Export Reports
                </span>
              </div>
            </CardBody>
          </Card>
        </div>
      </section>
    </DefaultLayout>
  );
}
