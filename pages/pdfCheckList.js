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

const PDF = ({ checkList }) => {
  return (
    <Document>
      <Page style={styles.body} size={"A4"} orientation={"landscape"}>
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
              Check List
            </Text>
            <View style={styles.contentTitle}>
              <Text style={styles.title}>Número :</Text>
              <Text style={styles.text}>{checkList.file}</Text>
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
              <Text style={styles.text}>{checkList.dateCheckList}</Text>
            </View>
            <View style={[styles.contentTitle, { flex: 1 }]}>
              <Text style={styles.title}>Tarea Asignada a:</Text>
              <Text style={styles.text}>3ra Generación</Text>
            </View>
            <View style={[styles.contentTitle, { flex: 1 }]}>
              <Text style={styles.title}>Filial / Objetivo :</Text>
              <Text style={styles.text}>{checkList.branch}</Text>
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
            <View style={[styles.contentTitle, { flex: 1 }]}>
              <Text style={styles.title}>Equipamiento Entregado :</Text>
              <Text style={styles.text}>{checkList.equipment}</Text>
            </View>
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
                Tareas
              </Text>
              <Text style={[styles.title, { flex: 2, textAlign: "center" }]}>
                Resultado
              </Text>
              <Text style={[styles.title, { flex: 2, textAlign: "center" }]}>
                Observaciones
              </Text>
              <Text style={[styles.title, { flex: 2, textAlign: "center" }]}>
                Num. Serie
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
              {checkList.items.map((item, index) => (
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
                  {item.check === "si" ? (
                    <View
                      style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Svg
                        viewBox="0 0 24 24"
                        strokeWidth="3"
                        stroke="#00913f"
                        style={{ width: "5mm", height: "5mm" }}
                      >
                        <Path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m4.5 12.75 6 6 9-13.5"
                        />
                      </Svg>
                    </View>
                  ) : item.check === "no" ? (
                    <View
                      style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Svg
                        viewBox="0 0 24 24"
                        strokeWidth="3"
                        stroke="#f00002"
                        style={{ width: "5mm", height: "5mm" }}
                      >
                        <Path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18 18 6M6 6l12 12"
                        />
                      </Svg>
                    </View>
                  ) : (
                    <View
                      style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Svg
                        viewBox="0 0 24 24"
                        strokeWidth="3"
                        stroke="#ffa500"
                        style={{ width: "5mm", height: "5mm" }}
                      >
                        <Path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                        />
                      </Svg>
                    </View>
                  )}
                  <Text
                    style={[
                      styles.text,
                      { flex: 2, textAlign: "start", paddingLeft: "2mm" },
                    ]}
                  >
                    {item.check === "na" ? "No Aplica" : item.observation}
                  </Text>{" "}
                  <Text style={[styles.text, { flex: 2, textAlign: "center" }]}>
                    {item.check === "na" ? "--" : item.serialNumber}
                  </Text>
                </View>
              ))}
            </View>
          </View>
          <View
            style={{
              width: "100%",
              display: "flex",
              alignItems: "flex-start",
              flexDirection: "row",
              gap: "3mm",
              marginTop: "4mm",
              marginBottom: "2mm",
            }}
          >
            <View style={[styles.contentTitle, { flex: 1 }]}>
              <Text style={styles.title}>Kilometros Recorridos :</Text>
              <Text style={styles.text}>{checkList.mileage} KM</Text>
            </View>
          </View>
          <View
            style={{
              width: "100%",
              display: "flex",
              alignItems: "flex-start",
              flexDirection: "row",
              gap: "3mm",
              marginTop: "2mm",
            }}
          >
            <View style={[styles.contentTitle, { flex: 1 }]}>
              <Text style={styles.title}>Observaciones Generales :</Text>
              <Text style={styles.text}>{checkList.observations}</Text>
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
          <View style={[styles.line]}></View>
          <View
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around",
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
const CheckListPDF = ({ checkListInfo }) => {
  const [file, setFile] = useState(null);
  const [dateCheckList, setDateCheckList] = useState("");
  const [branch, setBranch] = useState("");
  const [equipment, setEquipment] = useState("");
  const [items, setItems] = useState([]);
  const [observations, setObservations] = useState("");
  const [mileage, setMileage] = useState("");

  useEffect(() => {
    setFile(
      "0".repeat(4 - checkListInfo.file.toString().length) +
        Math.abs(checkListInfo.file).toString()
    );
    setDateCheckList(
      new Date(checkListInfo.dateCheckList)
        .toISOString()
        .slice(0, 10)
        .match(/([^T]+)/)[0]
        .split("-")
        .reverse()
        .join("/")
    );
    setBranch(checkListInfo.branch);
    setEquipment(checkListInfo.equipment);
    setItems(checkListInfo.items);
    setObservations(checkListInfo.observations);
    setMileage(checkListInfo.mileage);
  }, []);

  const checkList = {
    file,
    dateCheckList,
    branch,
    equipment,
    items,
    observations,
    mileage,
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
          <PDF checkList={checkList} />
        </PDFViewer>
      )}
    </>
  );
};
export default CheckListPDF;
