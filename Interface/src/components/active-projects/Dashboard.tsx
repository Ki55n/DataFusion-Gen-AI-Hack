"use client";

import React, { useState } from "react";
import Header from "./Header";
import ProjectCard from "./ProjectCard";
import LoadProjectsDialog from "./LoadProjectsDialog";
import AsidePanel from "./AsidePanel";
import { dataCleaningPipeline } from "@/action/cleaning/cleaning";
import { dataAnalysisPipeline } from "@/action/analyse/analyse";
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

  const handleLoadProjects = async (newProjects: Project[]) => {
    try {
      console.log("Loading new projects...");
      console.log(newProjects[0].files);

      for (const newProject of newProjects) {
        console.log(`Processing project: ${newProject._id}`);

        // Change project status to active
        await changeProjectStatus(newProject._id, "active");

        // Process files within each project
        console.log();
        for (const file of newProject.files) {
          console.log(`Running data cleaning pipeline on file: ${file}`);
          await dataCleaningPipeline(file);

          console.log(`Running data analysis pipeline on file: ${file}`);
          await dataAnalysisPipeline(file);
        }
      }

      // Update state with new projects
      setProjects((prevProjects) => {
        console.log("Updating projects state...");
        const updatedProjects = [...prevProjects];

        newProjects.forEach((newProject) => {
          const existingProjectIndex = updatedProjects.findIndex(
            (project) => project._id === newProject._id
          );

          if (existingProjectIndex !== -1) {
            console.log(`Updating existing project: ${newProject._id}`);
            updatedProjects[existingProjectIndex] = newProject;
          } else {
            console.log(`Adding new project: ${newProject._id}`);
            updatedProjects.push(newProject);
          }
        });

        console.log("Projects state updated.");
        return updatedProjects;
      });
    } catch (error) {
      console.error("Error in handleLoadProjects: ", error);
    }
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
          {projects
            .filter((project) => project.status === "active")
            .map((project) => (
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
