import React from "react";
import { FileCheck } from "lucide-react";
import DocumentListPage from "@/components/DocumentListPage";

const Actas: React.FC = () => (
  <DocumentListPage
    category="acta"
    title="Actas"
    formType="Acta"
    icon={<FileCheck className="w-5 h-5 text-primary" />}
  />
);

export default Actas;
