import dynamic from "next/dynamic";

const InvoicePDF = dynamic(() => import("./pdfOrder"), {
  ssr: false,
});

const DowloadPDF = ({ order }) => {
  return <InvoicePDF orderInfo={order} />;
};

export default DowloadPDF;
