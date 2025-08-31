"use client";

import LoginPage from "@/components/pages/LoginPage";

export default function EmployeeLogin() {
  return (
    <div className="!p-4 bg-custom-deep-blue">
      <LoginPage routingPage="/checkpoint" />
    </div>
  );
}
