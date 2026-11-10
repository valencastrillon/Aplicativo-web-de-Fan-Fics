import React from "react";
import { Info } from "lucide-react";

const PlaceholderPage: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <div className="max-w-3xl animate-fade-in-up">
    <div className="flex items-center gap-3 mb-4">
      <Info className="w-7 h-7 text-primary" />
      <h1 className="text-2xl font-bold text-foreground">{title}</h1>
    </div>
    <div className="bg-card rounded-xl border border-border p-8">
      <p className="text-muted-foreground">{description}</p>
    </div>
  </div>
);

export default PlaceholderPage;
