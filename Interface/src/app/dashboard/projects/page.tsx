"use client";

import React, { useEffect, useState } from "react";
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
  PlusCircle,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { createProject, getProjectsByUserId } from "@/db/project";
import { UserAuth } from "@/app/context/AuthContext";
import { useRouter, redirect } from "next/navigation";
import { File } from "@/db/project";

interface Project {
  name: string;
  description: string;
  createdAt: Date;
  status: string;
  files: File[];
  _id?: string; // MongoDB will generate this
  userId: string; // Assuming userId is a string, modify as needed
}

export default function Component() {
  const { user, loading: authLoading }: any = UserAuth(); // Use 'loading' from auth context
  const [projects, setProjects] = useState<Project[]>([]);

  const [isOpen, setIsOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", description: "" });
  const router = useRouter();

  console.log(user);

  useEffect(() => {
    if (!authLoading && !user) {
      console.log(user);
      console.log("yoyoyo");
      router.push("/login"); // Redirect to the login page if not authenticated
    }
  }, [user, authLoading, router]);

  const fetchProjects = async () => {
    if (user && user.uid) {
      try {
        const fetchedProjects = await getProjectsByUserId(user.uid);
        setProjects(fetchedProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    }
  };
  useEffect(() => {
    fetchProjects();
  }, [user]); // Run this effect when the user changes

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const addedProject = {
        name: newProject.name,
        description: newProject.description,
        createdAt: new Date(),
        status: "inactive",
        files: [],
        userId: user.uid, // Assuming a default user ID, modify as needed
      };

      const createdProject = await createProject(user.uid, addedProject);

      if (createdProject) {
        setProjects([...projects, addedProject]);
        setIsOpen(false);
        setNewProject({ name: "", description: "" });
      }

      fetchProjects();
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter((project) => project._id !== id));
  };

  const handleEditProject = (id: string) => {
    console.log(`Editing project with id: ${id}`);
  };

  const handleToggleActive = (id: string) => {
    setProjects(
      projects.map((project) =>
        project._id === id
          ? {
              ...project,
              status: project.status === "active" ? "inactive" : "active",
            }
          : project
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-100 mb-4">All Projects</h1>
        <div className="flex items-center space-x-4">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-gray-800 text-gray-100">
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogDescription>
                  Enter the details for your new project here.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateProject}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={newProject.name}
                      onChange={(e) =>
                        setNewProject({ ...newProject, name: e.target.value })
                      }
                      className="col-span-3 bg-gray-700 text-gray-100"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={newProject.description}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          description: e.target.value,
                        })
                      }
                      className="col-span-3 bg-gray-700 text-gray-100"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Create Project</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card
            key={project._id?.toString()}
            className={`w-full bg-gray-800 border-gray-700 ${
              project.status === "active"
                ? "border-green-500"
                : "border-gray-600"
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
                      onClick={() => handleEditProject(project._id!)}
                      className="hover:bg-gray-700"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDeleteProject(project._id!)}
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
                Last updated: {project.createdAt.toLocaleDateString()}
              </p>
              <div className="flex items-center space-x-2">
                <Switch
                  id={`project-active-${project._id}`}
                  checked={project.status === "active"}
                  onCheckedChange={() => handleToggleActive(project._id!)}
                />
                <label
                  htmlFor={`project-active-${project._id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-300"
                >
                  {project.status === "active" ? "Active" : "Inactive"}
                </label>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Link
                href={{
                  pathname: `/project/${project._id}`,
                  query: project.name,
                }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditProject(project._id!)}
                  className="text-gray-300 hover:text-gray-100 border-gray-600 hover:bg-gray-700"
                >
                  <ArrowUpRightFromCircle className="mr-2 h-4 w-4" />
                  Visit
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeleteProject(project._id!)}
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
