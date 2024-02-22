import React, { useEffect, useState } from "react";
import {
  Document,
  Page,
  View,
  Text,
  Image,
  PDFViewer,
  StyleSheet,
  Font,
  Svg,
  Path,
} from "@react-pdf/renderer";

Font.register({
  family: "Poppins",
  fonts: [
    { src: "./font/Poppins-Medium.otf" }, // font-style: normal, font-weight: normal
    { src: "./font/Poppins-MediumItalic.otf", fontStyle: "italic" },
  ],
});

const styles = StyleSheet.create({
  body: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "column",
    paddingHorizontal: 60,
    paddingVertical: 40,
    fontFamily: "Poppins",
  },
  contentTitle: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    gap: "3mm",
  },
  title: {
    fontSize: "4mm",
    color: "#666666",
    fontStyle: "italic",
  },
  text: {
    fontSize: "3.5mm",
  },
  line: {
    width: "100%",
    border: "0.3mm",
    backgroundColor: "#0a5a7d",
    borderColor: "#0a5a7d",
    marginVertical: 10,
  },
  signature: {
    width: "2cm",
    height: "2cm",
  },
});

const PDF = ({ budget }) => {
  return (
    <Document>
      <Page style={styles.body} size={"A4"}>
        <View
          style={{
            width: "100%",
          }}
        >
          <View
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexDirection: "row",
            }}
            fixed
          >
            <Image
              style={{
                width: "5cm",
              }}
              src="https://static.wixstatic.com/media/ed9a86_fae1caa9740742d689844de75397e4c2~mv2.png/v1/fill/w_509,h_162,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/ed9a86_fae1caa9740742d689844de75397e4c2~mv2.png"
            />
          </View>
          <View
            style={{
              width: "100%",
              paddingTop: 20,
              paddingBottom: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexDirection: "row",
            }}
            fixed
          >
            <Text wrap={false} style={{ textAlign: "left", color: "#0a5a7d" }}>
              PRESUPUESTO
            </Text>
            <View style={styles.contentTitle}>
              <Text style={styles.title}>Número :</Text>
              <Text style={styles.text}>{budget.file}</Text>
            </View>
          </View>
          <View
            style={{
              width: "100%",
              display: "flex",
              alignItems: "flex-start",
              flexDirection: "row",
              gap: "3mm",
              marginBottom: "4mm",
            }}
            fixed
          >
            <View style={[styles.contentTitle, { flex: 1 }]}>
              <Text style={styles.title}>Fecha :</Text>
              <Text style={styles.text}>{budget.dateBudget}</Text>
            </View>
          </View>

          <View
            style={{
              width: "100%",
              display: "flex",
              alignItems: "flex-start",
              flexDirection: "row",
              gap: "3mm",
              marginBottom: "2mm",
            }}
            fixed
          >
            {budget.gender === "Cliente" ? (
              <View
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexDirection: "row",
                }}
              >
                <View style={[styles.contentTitle]}>
                  <Text style={styles.title}>Cliente :</Text>
                  <Text style={styles.text}>{budget.name}</Text>
                </View>
                <View style={[styles.contentTitle]}>
                  <Text style={styles.title}>Sucursal :</Text>
                  <Text style={styles.text}>{budget.branch}</Text>
                </View>
              </View>
            ) : (
              <View style={[styles.contentTitle, { flex: 1 }]}>
                <Text style={styles.title}>Nombre:</Text>
                <Text style={styles.text}>{budget.name}</Text>
              </View>
            )}
          </View>
          <View style={styles.line} fixed></View>
          <View
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 20,
            }}
          >
            {/* <Text style={styles.title}>Productos / Servicios :</Text> */}
            <View
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              fixed
            >
              <Text style={[styles.title, { flex: 5, textAlign: "start" }]}>
                Productos / Servicios
              </Text>
              <Text style={[styles.title, { flex: 2, textAlign: "center" }]}>
                Cant
              </Text>
              <Text style={[styles.title, { flex: 1, textAlign: "start" }]}>
                Total
              </Text>
            </View>
            <View
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
                justifyContent: "start",
                gap: 5,
              }}
            >
              {budget.items.map((item, index) => (
                <View
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                  key={index}
                >
                  <Text style={[styles.text, { flex: 5, textAlign: "start" }]}>
                    {item.name}
                  </Text>
                  <Text style={[styles.text, { flex: 2, textAlign: "center" }]}>
                    {item.cant}
                  </Text>
                  {item.total === 0 ? (
                    <Text
                      style={[styles.text, { flex: 1, textAlign: "start" }]}
                    ></Text>
                  ) : (
                    <Text
                      style={[styles.text, { flex: 1, textAlign: "start" }]}
                    >
                      $ {item.total}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        </View>
        <View
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 10,
          }}
        >
          <View
            style={{
              width: "100%",
              display: "flex",
              alignItems: "flex-end",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View style={styles.contentTitle}>
              <Text style={styles.title}>Vendedor :</Text>
              <Text style={styles.text}>{budget.owner}</Text>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <View style={styles.contentTitle}>
                <Text style={styles.title}>Total :</Text>
                <Text style={styles.text}>$ {budget.total}</Text>
              </View>
              <View style={styles.contentTitle}>
                <Text style={styles.title}>Total :</Text>
                <Text style={styles.text}>USD {budget.totalDollar}</Text>
              </View>
            </View>
          </View>
          <Text style={[styles.title, { fontSize: "2mm" }]}>
            Cotización sujeta a la variación del dolar oficial (tipo de cambio
            BNA). Al total de este presupuesto se le debe sumar el IVA.
          </Text>
          <View style={[styles.line, { marginTop: 10 }]}></View>
          <View
            style={{
              width: "100%",
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: "3mm",
                color: "#666666",
              }}
            >
              www.3rageneracion.com
            </Text>
          </View>
          <View
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around",
              marginTop: 20,
            }}
          >
            <View
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: 10,
              }}
            >
              <Svg
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                style={{ width: "5mm", height: "5mm" }}
              >
                <Path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
                />
              </Svg>
              <Text
                style={{
                  fontSize: "3mm",
                  color: "#666666",
                }}
              >
                +54 3543 552622
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
            >
              <Svg
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                style={{ width: "5mm", height: "5mm" }}
              >
                <Path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </Svg>
              <Text
                style={{
                  fontSize: "3mm",
                  color: "#666666",
                }}
              >
                3gseguridad@gmail.com
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: 10,
              }}
            >
              <Image
                style={{
                  width: "3mm",
                }}
                src="./assets/logoFacebook.png"
              />
              <Text
                style={{
                  fontSize: "3mm",
                  color: "#666666",
                }}
              >
                Facebook/3GSeguridad
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};
const BudgetPDF = ({ budgetInfo }) => {
  const [file, setFile] = useState(null);
  const [dateBudget, setDateBudget] = useState("");
  const [name, setName] = useState("");
  const [items, setItems] = useState([]);
  const [gender, setGender] = useState("");
  const [branch, setBranch] = useState("");
  const [owner, setOwner] = useState("");
  const [total, setTotal] = useState("");
  const [totalDollar, setTotalDollar] = useState("");

  useEffect(() => {
    setFile(
      "0".repeat(4 - budgetInfo.file.toString().length) +
        Math.abs(budgetInfo.file).toString()
    );
    setDateBudget(
      new Date(budgetInfo.dateBudget)
        .toISOString()
        .slice(0, 10)
        .match(/([^T]+)/)[0]
        .split("-")
        .reverse()
        .join("/")
    );
    setName(budgetInfo.name);
    setItems(budgetInfo.items);
    setGender(budgetInfo.gender);
    setBranch(budgetInfo.branch);
    setOwner(budgetInfo.owner.fullName);
    setTotal(budgetInfo.total);
    setTotalDollar(budgetInfo.totalDollar);
  }, []);

  const budget = {
    file,
    dateBudget,
    name,
    items,
    gender,
    branch,
    owner,
    total,
    totalDollar,
  };

  return (
    <>
      {file && (
        <PDFViewer
          style={{
            width: "100%",
            height: "100vh",
          }}
        >
          <PDF budget={budget} />
        </PDFViewer>
      )}
    </>
  );
};
export default BudgetPDF;
