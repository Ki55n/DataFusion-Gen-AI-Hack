"use client";

import { useEffect, useState } from "react";

import { UserAuth } from "@/app/context/AuthContext";
import { getProjectsByUserId } from "@/db/project";
import Dashboard from "@/components/active-projects/Dashboard";
// Assuming you have a Project type defined

type Project = {
  _id: string;
  name: string;
  description: string;
  createdAt: Date;
  status: string;
  files: any[];
  userId: string;
};

export default function DashboardPage() {
  const { user }: any = UserAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      if (user && user.uid) {
        try {
          const fetchedProjects = await getProjectsByUserId(user.uid);
          setProjects(fetchedProjects);
        } catch (error) {
          console.error("Error fetching projects:", error);
        } finally {
          setLoading(false);
        }
      }
    }

    fetchProjects();
  }, [user]);

  if (loading) {
    return <div>Loading...</div>; // You might want to replace this with a proper loading component
  }

  return <Dashboard initialProjects={projects} />;
}
