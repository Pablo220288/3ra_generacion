import axios from "axios";

export default async function handle(req, res) {
  const config = {
    url: "https://api.estadisticasbcra.com/usd_of",
    method: "GET",
    headers: {
      Authorization: "BEARER " + process.env.TOKEN_BCRA_2,
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
