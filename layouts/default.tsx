import { Link } from "@heroui/link";

import { Head } from "./head";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen overflow-x-hidden">
      <Head />
      <main className="container mx-auto max-w-7xl px-6 flex-grow pt-16">
        {children}
      </main>
      <footer className="w-full flex items-center justify-center py-3">
        <Link
          isExternal
          className="flex items-center gap-1 text-current"
          href="https://www.perla-it.com"
          title="perla-it.com homepage"
        >
          <span className="text-default-600">Powered by</span>
          <p className="text-primary">Perla it</p>
        </Link>
      </footer>
    </div>
  );
}
