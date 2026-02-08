"use client";

import { usePathname } from "next/navigation";
import React from "react";

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      {children}
    </div>
  );
}

interface Props {
  children: React.ReactNode;
}

export default function AppWrapper({ children }: Props) {
  const pathname = usePathname();

  // Do not render the shell for the login page
  if (pathname === "/login") {
    return <>{children}</>;
  }

  return <PageShell>{children}</PageShell>;
}
