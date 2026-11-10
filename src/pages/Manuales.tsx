import React from "react";
import { FileText } from "lucide-react";
import DocumentListPage from "@/components/DocumentListPage";

const Manuales: React.FC = () => (
  <DocumentListPage
    category="manual"
    title="Manuales"
    formType="Manual"
    icon={<FileText className="w-5 h-5 text-primary" />}
  />
);

export default Manuales;
