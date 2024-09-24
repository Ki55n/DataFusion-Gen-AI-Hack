import React from "react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical,
  RefreshCcw,
  Trash2,
  Sliders,
  ArrowUpRightFromCircle,
} from "lucide-react";
import Link from "next/link";

type Project = {
  _id: string;
  name: string;
  description: string;
  createdAt: Date;
  status: string;
  files: any[];
  userId: string;
};

type ProjectCardProps = {
  project: Project;
  onDelete: (id: string) => void;
  onOpenAsidePanel: (id: string) => void;
};

export default function ProjectCard({
  project,
  onDelete,
  onOpenAsidePanel,
}: ProjectCardProps) {
  return (
    <Card className="w-full bg-gray-800 border-gray-700">
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
                onClick={() =>
                  console.log(`Syncing project with id: ${project._id}`)
                }
                className="hover:bg-gray-700"
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                Sync
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(project._id)}
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
          Created: {new Date(project.createdAt).toLocaleDateString()}
        </p>
        <p className="text-sm text-gray-400 mb-4">Status: {project.status}</p>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onOpenAsidePanel(project._id)}
          className="text-gray-300 hover:text-gray-100 bg-black hover:bg-gray-900 border-gray-600"
        >
          <Sliders className="mr-2 h-4 w-4" />
          Operations
        </Button>
        <div>
          <Link href={`/active-project/${project._id}`}>
            <Button
              variant="outline"
              size="sm"
              className="text-gray-300 hover:text-gray-100 bg-black hover:bg-gray-900 border-gray-600"
            >
              <ArrowUpRightFromCircle className="mr-2 h-4 w-4" />
              Visit
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
