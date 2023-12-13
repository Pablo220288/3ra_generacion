import { BarLoader, ClipLoader } from "react-spinners";

export default function Spinner({ color, dollar }) {
  if (dollar) {
    return <ClipLoader className="!w-[25px] !h-[25px]" color={color} />;
  } else {
    return <BarLoader color={color} />;
  }
}
