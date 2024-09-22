"use client";

import React, { useState } from "react";
import Header from "./Header";
import ProjectCard from "./ProjectCard";
import LoadProjectsDialog from "./LoadProjectsDialog";
import AsidePanel from "./AsidePanel";

type Project = {
  _id: string;
  name: string;
  description: string;
  createdAt: Date;
  status: string;
  files: any[];
  userId: string;
};

type DashboardProps = {
  initialProjects: Project[];
};

export default function Dashboard({ initialProjects }: DashboardProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAsidePanelOpen, setIsAsidePanelOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter((project) => project._id !== id));
  };

  const openAsidePanel = (id: string) => {
    setSelectedProjectId(id);
    setIsAsidePanelOpen(true);
  };

  const handleLoadProjects = (newProjects: Project[]) => {
    setProjects((prevProjects) => {
      const updatedProjects = [...prevProjects];
      newProjects.forEach((newProject) => {
        const index = updatedProjects.findIndex(
          (p) => p._id === newProject._id
        );
        if (index !== -1) {
          updatedProjects[index] = newProject;
        } else {
          updatedProjects.push(newProject);
        }
      });
      return updatedProjects;
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8 relative">
      <Header onOpenLoadProjectsDialog={() => setIsDialogOpen(true)} />

      {projects.length === 0 ? (
        <div className="text-center text-gray-400 mt-20">
          <p className="text-2xl mb-4">No projects loaded</p>
          <p>Your projects will appear here once created or loaded.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
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
        projects={initialProjects}
        onLoadProjects={handleLoadProjects}
      />

      <AsidePanel
        isOpen={isAsidePanelOpen}
        onClose={() => setIsAsidePanelOpen(false)}
        selectedProjectId={selectedProjectId}
      />
    </div>
  );
}
