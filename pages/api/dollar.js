import axios from "axios";

export default async function handle(req, res) {
  const config = {
    url: "https://api.estadisticasbcra.com/usd_of",
    method: "GET",
    headers: {
      Authorization: "BEARER " + process.env.TOKEN_BCRA_2,
      "Access-Control-Allow-Origin": "*",
      origin: "x-requested-with",
      "Access-Control-Allow-Headers":
        "POST, GET, PUT, DELETE, OPTIONS, HEAD, Authorization, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Access-Control-Allow-Origin",
      "Content-Type": "application/json",
    },
  };

  const totalDollar = await axios(config);

  // Filtrado por fecha del dia de ayer

  /*   const dateNow = new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T");

  const dollarFilter = totalDollar.data.find(
    (dollar) => dollar.d === dateNow[0]
  ); */

  // Filtrado por ultimo item del arreglo
  const dollarFilter = totalDollar.data[totalDollar.data.length - 1];

  res.json(dollarFilter);
}
