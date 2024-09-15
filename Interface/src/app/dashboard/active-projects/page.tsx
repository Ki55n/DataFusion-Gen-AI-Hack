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
import {
  Trash2,
  Edit,
  MoreVertical,
  Wand2,
  Sparkles,
  BarChart2,
  Download,
  Settings,
  Plus,
  RefreshCcw,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";

type Project = {
  id: number;
  name: string;
  description: string;
  lastUpdated: string;
};

const availableProjects: Project[] = [
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

export default function Component() {
  const [selectedProjects, setSelectedProjects] = useState<Project[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDeleteProject = (id: number) => {
    setSelectedProjects(
      selectedProjects.filter((project) => project.id !== id)
    );
  };

  const handleEditProject = (id: number) => {
    console.log(`Editing project with id: ${id}`);
  };

  const handleAIFeature = (id: number) => {
    console.log(`Applying AI features to project with id: ${id}`);
  };

  const handleDataCleaning = (id: number) => {
    console.log(`Starting data cleaning for project with id: ${id}`);
  };

  const handleAnalyze = (id: number) => {
    console.log(`Analyzing data for project with id: ${id}`);
  };

  const handleExport = (id: number) => {
    console.log(`Exporting data for project with id: ${id}`);
  };

  const handleLoadProjects = (projectIds: number[]) => {
    const newProjects = availableProjects.filter((project) =>
      projectIds.includes(project.id)
    );
    setSelectedProjects([...selectedProjects, ...newProjects]);
    setIsDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <header className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-bold text-gray-100">
            Active Projects Dashboard
          </h1>
          <div className="flex space-x-4">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Load Projects
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-gray-800 text-gray-100">
                <DialogHeader>
                  <DialogTitle>Load Projects</DialogTitle>
                  <DialogDescription>
                    Select projects to load into your dashboard.
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="mt-4 h-[300px] pr-4">
                  {availableProjects.map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center space-x-2 mb-4"
                    >
                      <Checkbox
                        id={`project-${project.id}`}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleLoadProjects([project.id]);
                          } else {
                            handleDeleteProject(project.id);
                          }
                        }}
                        checked={selectedProjects.some(
                          (p) => p.id === project.id
                        )}
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
            <Link href="/dashboard/projects">
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Manage Projects
              </Button>
            </Link>
          </div>
        </div>
      </header>

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
            <Card
              key={project.id}
              className="w-full bg-gray-800 border-gray-700 border-green-500"
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
                        <RefreshCcw className="mr-2 h-4 w-4" />
                        Sync
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
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAIFeature(project.id)}
                    className="text-gray-300 hover:text-gray-100 border-gray-600 hover:bg-gray-700"
                  >
                    <Wand2 className="mr-2 h-4 w-4" />
                    AI Features
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDataCleaning(project.id)}
                    className="text-gray-300 hover:text-gray-100 border-gray-600 hover:bg-gray-700"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Clean Data
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAnalyze(project.id)}
                    className="text-gray-300 hover:text-gray-100 border-gray-600 hover:bg-gray-700"
                  >
                    <BarChart2 className="mr-2 h-4 w-4" />
                    Analyze
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport(project.id)}
                    className="text-gray-300 hover:text-gray-100 border-gray-600 hover:bg-gray-700"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </CardContent>
              {/* <CardFooter className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditProject(project.id)}
                  className="text-gray-300 hover:text-gray-100 border-gray-600 hover:bg-gray-700"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Project
                </Button>
              </CardFooter> */}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
