"use client";

import AsidePanel from "@/components/active-projects/AsidePanel";
import Header from "@/components/active-projects/Header";
import LoadProjectsDialog from "@/components/active-projects/LoadProjectsDialog";
import ProjectCard from "@/components/active-projects/ProjectCard";
import React, { useState } from "react";
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

export default function Dashboard() {
  const [selectedProjects, setSelectedProjects] = useState<Project[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAsidePanelOpen, setIsAsidePanelOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null
  );

  const handleDeleteProject = (id: number) => {
    setSelectedProjects(
      selectedProjects.filter((project) => project.id !== id)
    );
  };

  const handleLoadProjects = (projectIds: number[]) => {
    const newProjects = availableProjects.filter((project) =>
      projectIds.includes(project.id)
    );
    setSelectedProjects([...selectedProjects, ...newProjects]);
    setIsDialogOpen(false);
  };

  const openAsidePanel = (id: number) => {
    setSelectedProjectId(id);
    setIsAsidePanelOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8 relative">
      <Header onOpenLoadProjectsDialog={() => setIsDialogOpen(true)} />

      {selectedProjects.length === 0 ? (
        <div className="text-center text-gray-400 mt-20">
          <p className="text-2xl mb-4">No projects loaded</p>
          <p>
            Click the "Load Projects" button to add projects to your dashboard.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onDelete={handleDeleteProject}
              onOpenAsidePanel={openAsidePanel}
            />
          ))}
        </div>
      )}

      <LoadProjectsDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        availableProjects={availableProjects}
        selectedProjects={selectedProjects}
        onLoadProjects={handleLoadProjects}
        onDeleteProject={handleDeleteProject}
      />

      <AsidePanel
        isOpen={isAsidePanelOpen}
        onClose={() => setIsAsidePanelOpen(false)}
        selectedProjectId={selectedProjectId}
      />
    </div>
  );
}
