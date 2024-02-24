import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Spinner from "@/components/Spinner";
import CheckListForm from "@/components/CheckListForm";

export default function EditOrderPage() {
  const [checkListInfo, setCheckList] = useState(null);
  const [isCheckList, setIsCheckList] = useState(false);

  const router = useRouter();
  const { id } = router.query;

  const getCheckList = async () => {
    try {
      setIsCheckList(true);
      if (!id) return;
      const response = await axios.get("/api/checkList/findbyid/?id=" + id[0]);     
      setCheckList(response.data);
    } catch (error) {
      console.error("Error Fetching Check List data:", error);
    } finally {
      setIsCheckList(false);
    }
  };

  useEffect(() => {
    getCheckList();
  }, [id]);

  return (
    <Layout>
      <div className="mb-4 text-gray-400 text-sm flex items-center">
        <Link className="hover:text-generation" href={"/orders"}>
          Check Lists{" "}
        </Link>
        <span>\ </span>
        <span className="text-text-generation">Editar Check List</span>
        <div className="ml-3">{isCheckList && <Spinner color={"#0a5a7d"} />}</div>
      </div>
      {checkListInfo && (
        <CheckListForm title={"Editar Check List"} {...checkListInfo} />
      )}
    </Layout>
  );
}
