import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Settings } from "lucide-react";
import Link from "next/link";

type HeaderProps = {
  onOpenLoadProjectsDialog: () => void;
};

export default function Header({ onOpenLoadProjectsDialog }: HeaderProps) {
  return (
    <header className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-4xl font-bold text-gray-100">
          Active Projects Dashboard
        </h1>
        <div className="flex space-x-4">
          <Button variant="outline" onClick={onOpenLoadProjectsDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Load Projects
          </Button>
          <Link href="/dashboard/projects">
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Manage Projects
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
