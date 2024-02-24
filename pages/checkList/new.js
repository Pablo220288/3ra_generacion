import CheckListForm from "@/components/CheckListForm";
import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function CheckListPage() {
  const [checkLists, setCheckLists] = useState(null);
  const [isCheckLists, setIsCheckLists] = useState(false);

  const getCheckList = async () => {
    try {
      setIsCheckLists(true);
      const response = await axios.get("/api/checkList/find");
      setCheckLists(response.data);
    } catch (error) {
      console.error("Error fetching Check List data:", error);
    } finally {
      setIsCheckLists(false);
    }
  };

  useEffect(() => {
    getCheckList();
  }, []);

  return (
    <Layout>
      <div className="mb-4 text-gray-400 text-sm flex items-center">
        <Link className="hover:text-text-generation" href={"/checkList"}>
          Check Lists{" "}
        </Link>
        <span>\ </span>
        <span className="text-text-generation">Nuevo Check List</span>
        <div className="ml-3">{isCheckLists && <Spinner color={"#0a5a7d"} />}</div>
      </div>
      {checkLists && <CheckListForm title={"Nuevo Check List"} checkList={checkLists} />}
    </Layout>
  );
}
