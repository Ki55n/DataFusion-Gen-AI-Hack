import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
export type Project = {
  id: number;
  name: string;
  description: string;
  lastUpdated: string;
};

export const availableProjects: Project[] = [
  {
    id: 1,
    name: "Customer Data",
    description: "Clean and normalize customer information",
    lastUpdated: "2023-05-15",
  },
  {
    id: 2,
    name: "Sales Records",
    description: "Remove duplicates and standardize formats",
    lastUpdated: "2023-05-10",
  },
  {
    id: 3,
    name: "Product Catalog",
    description: "Update product descriptions and categories",
    lastUpdated: "2023-05-05",
  },
  {
    id: 4,
    name: "Employee Database",
    description: "Standardize job titles and departments",
    lastUpdated: "2023-05-20",
  },
  {
    id: 5,
    name: "Inventory Management",
    description: "Optimize stock levels and categorization",
    lastUpdated: "2023-05-25",
  },
];
type LoadProjectsDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  availableProjects: Project[];
  selectedProjects: Project[];
  onLoadProjects: (projectIds: number[]) => void;
  onDeleteProject: (id: number) => void;
};

export default function LoadProjectsDialog({
  isOpen,
  onOpenChange,
  availableProjects,
  selectedProjects,
  onLoadProjects,
  onDeleteProject,
}: LoadProjectsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-gray-800 text-gray-100">
        <DialogHeader>
          <DialogTitle>Load Projects</DialogTitle>
          <DialogDescription>
            Select projects to load into your dashboard.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-4 h-[300px] pr-4">
          {availableProjects.map((project) => (
            <div key={project.id} className="flex items-center space-x-2 mb-4">
              <Checkbox
                id={`project-${project.id}`}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onLoadProjects([project.id]);
                  } else {
                    onDeleteProject(project.id);
                  }
                }}
                checked={selectedProjects.some((p) => p.id === project.id)}
              />
              <label
                htmlFor={`project-${project.id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {project.name}
              </label>
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
