import React from "react";
import { BuilderProvider } from "@/contexts/BuilderContext";
import { BuilderIOProvider } from "@/contexts/BuilderIOContext";
import { BuilderIOIntegration } from "@/components/builder/BuilderIOIntegration";

export default function Builder() {
  return (
    <BuilderProvider>
      <BuilderIOProvider>
        <BuilderIOIntegration />
      </BuilderIOProvider>
    </BuilderProvider>
  );
}
