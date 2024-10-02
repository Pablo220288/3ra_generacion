import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Spinner from "@/components/Spinner";
import JobForm from "@/components/JobForm";

export default function EditOrderPage() {
  const [jobInfo, setJobInfo] = useState(null);
  const [orderInfo, setOrderInfo] = useState(null);
  const [isJobs, setIsJobs] = useState(false);

  const router = useRouter();
  const { id } = router.query;

  const getJob = async () => {
    try {
      setIsJobs(true);
      if (!id) return;
      const response = await axios.get("/api/job/findbyid/?id=" + id[0]);
      setJobInfo(response.data);

      const inforOrder = await axios.get("/api/order/find");
      setOrderInfo(inforOrder.data);
    } catch (error) {
      console.error("Error fetching Jobs data:", error);
    } finally {
      setIsJobs(false);
    }
  };

  useEffect(() => {
    getJob();
  }, [id]);

  return (
    <Layout>
      <div className="mb-4 text-gray-400 text-sm flex items-center">
        <Link className="hover:text-generation" href={"/orders"}>
          Tareas a Realizar{" "}
        </Link>
        <span>\ </span>
        <span className="text-text-generation">Tarea</span>
        <div className="ml-3">{isJobs && <Spinner color={"#0a5a7d"} />}</div>
      </div>
      {jobInfo && (
        <>
          {jobInfo.status === "pending" ? (
            orderInfo && (
              <JobForm title={"Tarea Pendiente"} {...jobInfo} orders={orderInfo} />
            )
          ) : (
            <JobForm title={"Tarea Finalizada"} {...jobInfo} />
          )}
        </>
      )}
    </Layout>
  );
}
