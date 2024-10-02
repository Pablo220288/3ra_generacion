import JobForm from "@/components/JobForm";
import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function JobsNew() {
  const [jobs, setJobs] = useState(null);
  const [isJobs, setIsJobs] = useState(false);

  const getJobs = async () => {
    try {
      setIsJobs(true);
      const response = await axios.get("/api/job/find");
      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching Jobs data:", error);
    } finally {
      setIsJobs(false);
    }
  };

  useEffect(() => {
    getJobs();
  }, []);
  
  return (
    <Layout>
      <div className="mb-4 text-gray-400 text-sm flex items-center">
        <Link className="hover:text-text-generation" href={"/Jobs"}>
          Tareas a Realizar{" "}
        </Link>
        <span>\ </span>
        <span className="text-text-generation">Nueva Tarea</span>
        <div className="ml-3">{isJobs && <Spinner color={"#0a5a7d"} />}</div>
      </div>
      {jobs && <JobForm title={"Nueva Tarea"} jobs={jobs} />}
    </Layout>
  );
}
