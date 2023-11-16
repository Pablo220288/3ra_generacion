import dynamic from "next/dynamic";

const InvoicePDF = dynamic(() => import("./pdf"), {
  ssr: false,
});

const DowloadPDF = ({ order }) => {
  return <InvoicePDF orderInfo={order} />;
};

export default DowloadPDF;
