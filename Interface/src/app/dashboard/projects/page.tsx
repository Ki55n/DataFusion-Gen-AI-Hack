"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  UploadCloud,
  Trash2,
  Edit,
  MoreVertical,
  ArrowUpRightFromCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

type Project = {
  id: number;
  name: string;
  description: string;
  lastUpdated: string;
  active: boolean;
};

export default function Component() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      name: "Customer Data",
      description: "Clean and normalize customer information",
      lastUpdated: "2023-05-15",
      active: true,
    },
    {
      id: 2,
      name: "Sales Records",
      description: "Remove duplicates and standardize formats",
      lastUpdated: "2023-05-10",
      active: false,
    },
    {
      id: 3,
      name: "Product Catalog",
      description: "Update product descriptions and categories",
      lastUpdated: "2023-05-05",
      active: true,
    },
  ]);

  const [file, setFile] = useState<File | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      // Simulating file upload and new project creation
      const newProject: Project = {
        id: projects.length + 1,
        name: event.target.files[0].name,
        description: "Newly uploaded file for cleaning",
        lastUpdated: new Date().toISOString().split("T")[0],
        active: true,
      };
      setProjects([...projects, newProject]);
    }
  };

  const handleDeleteProject = (id: number) => {
    setProjects(projects.filter((project) => project.id !== id));
  };

  const handleEditProject = (id: number) => {
    // Placeholder for edit functionality
    console.log(`Editing project with id: ${id}`);
  };

  const handleToggleActive = (id: number) => {
    setProjects(
      projects.map((project) =>
        project.id === id ? { ...project, active: !project.active } : project
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-100 mb-4">All Projects</h1>
        <div className="flex items-center space-x-4">
          <Input
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <Button variant="outline">
              <UploadCloud className="mr-2 h-4 w-4" />
              Upload New File
            </Button>
          </label>
          {file && (
            <p className="text-sm text-gray-400">File selected: {file.name}</p>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card
            key={project.id}
            className={`w-full bg-gray-800 border-gray-700 ${
              project.active ? "border-green-500" : "border-gray-600"
            }`}
          >
            <CardHeader>
              <CardTitle className="flex justify-between items-center text-gray-100">
                <span className="truncate">{project.name}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-300 hover:text-gray-100"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-gray-800 text-gray-100"
                  >
                    <DropdownMenuItem
                      onClick={() => handleEditProject(project.id)}
                      className="hover:bg-gray-700"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDeleteProject(project.id)}
                      className="hover:bg-gray-700"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardTitle>
              <CardDescription className="text-gray-400">
                {project.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400 mb-4">
                Last updated: {project.lastUpdated}
              </p>
              <div className="flex items-center space-x-2">
                <Switch
                  id={`project-active-${project.id}`}
                  checked={project.active}
                  onCheckedChange={() => handleToggleActive(project.id)}
                />
                <label
                  htmlFor={`project-active-${project.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-300"
                >
                  {project.active ? "Active" : "Inactive"}
                </label>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Link href={`/project/${project.id}`}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditProject(project.id)}
                  className="text-gray-300 hover:text-gray-100 border-gray-600 hover:bg-gray-700"
                >
                  <ArrowUpRightFromCircle className="mr-2 h-4 w-4" />
                  Visit
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeleteProject(project.id)}
                className="text-gray-300 hover:text-gray-100 border-gray-600 hover:bg-gray-700"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
