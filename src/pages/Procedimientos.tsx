import React from "react";
import { ListChecks } from "lucide-react";
import DocumentListPage from "@/components/DocumentListPage";

const Procedimientos: React.FC = () => (
  <DocumentListPage
    category="procedimiento"
    title="Procedimientos"
    formType="Procedimiento"
    icon={<ListChecks className="w-5 h-5 text-primary" />}
  />
);

export default Procedimientos;
