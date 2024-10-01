"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react";
import { changeProjectStatus } from "@/db/project";

type Project = {
  _id: string;
  name: string;
  description: string;
  createdAt: Date;
  status: string;
  files: any[];
  userId: string;
};

type LoadProjectsDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  projects: Project[];
  onLoadProjects: (projects: Project[]) => void;
};

export default function LoadProjectsDialog({
  isOpen,
  onOpenChange,
  projects,
  onLoadProjects,
}: LoadProjectsDialogProps) {
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);

  const handleProjectSelection = (projectId: string) => {
    setSelectedProjects((prev) =>
      prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId]
    );
  };

  const handleLoadProjects = () => {
    const projectsToLoad = projects.filter((project) =>
      selectedProjects.includes(project._id)
    );
    onLoadProjects(projectsToLoad);
    onOpenChange(false);
    setSelectedProjects([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {/* <Button variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Load Projects
        </Button> */}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-gray-800 text-gray-100">
        <DialogHeader>
          <DialogTitle>Your Projects</DialogTitle>
          <DialogDescription>
            Select projects to add to your dashboard.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-4 h-[300px] pr-4">
          {projects
            .filter((project) => project.status === "inactive")
            .map((project) => (
              <div
                key={project._id}
                className="flex items-center space-x-2 mb-4"
              >
                <Checkbox
                  id={project._id}
                  checked={selectedProjects.includes(project._id)}
                  onCheckedChange={() => handleProjectSelection(project._id)}
                />
                <label
                  htmlFor={project._id}
                  className="text-sm font-medium flex items-center space-x-2"
                >
                  <span>{project.name}</span>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      project.status === "active"
                        ? "bg-green-500"
                        : "bg-gray-500"
                    }`}
                  >
                    {project.status}
                  </span>
                </label>
              </div>
            ))}
        </ScrollArea>
        <div className="mt-4 flex justify-end">
          <Button
            onClick={handleLoadProjects}
            disabled={selectedProjects.length === 0}
          >
            Add Selected Projects
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
