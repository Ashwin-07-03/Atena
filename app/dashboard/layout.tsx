"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard-layout";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: DashboardLayoutProps) {
  return <DashboardLayout>{children}</DashboardLayout>;
} 