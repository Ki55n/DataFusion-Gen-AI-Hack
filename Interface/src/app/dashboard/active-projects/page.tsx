"use client";

import { useEffect, useState } from "react";

import { UserAuth } from "@/app/context/AuthContext";
import { getProjectsByUserId } from "@/db/project";
import Dashboard from "@/components/active-projects/Dashboard";
import { useRouter } from "next/navigation";
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
  const { user, loading: authLoading }: any = UserAuth(); // Use 'loading' from auth context
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login"); // Redirect to the login page if not authenticated
    }
  }, [user, authLoading, router]);

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
    return <div>Loading...</div>;
  }

  return <Dashboard initialProjects={projects} />;
}
