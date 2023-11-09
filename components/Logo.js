import Link from "next/link";

export default function Logo({signin}) {
  return (
    <Link href={"/"} className="flex gap-1">
      <img
        className={signin ? "w-[250px] md:w-[300px]" : "w-[150px] md:w-[200px]"}
        src="https://static.wixstatic.com/media/ed9a86_fae1caa9740742d689844de75397e4c2~mv2.png/v1/fill/w_509,h_162,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/ed9a86_fae1caa9740742d689844de75397e4c2~mv2.png"
        alt="3ra Generación"
      />
    </Link>
  );
}
