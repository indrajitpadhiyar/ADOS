import React from "react";
import PublishAdSection from "./PublishAdSection";

export default function CreateAdSection({ onAdCreated, onAdPublished, ...props }) {
  return (
    <PublishAdSection
      onAdPublished={onAdPublished || onAdCreated}
      onNavigateToManage={onAdCreated}
      {...props}
    />
  );
}

