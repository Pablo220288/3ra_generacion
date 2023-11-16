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
    padding: 60,
    fontFamily: "Poppins",
  },
  contentTitle: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    gap: "3mm",
  },
  title: {
    fontSize: "3mm",
    color: "#666666",
    fontStyle: "italic",
  },
  text: {
    fontSize: "4mm",
  },
  line: {
    width: "100%",
    border: "0.3mm",
    backgroundColor: "#0a5a7d",
    borderColor: "#0a5a7d",
    marginVertical: 30,
  },
  signature: {
    width: "3cm",
    height: "3cm"
  },
});

const PDF = ({ order }) => {
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
          >
            <Image
              style={{
                width: "6cm",
              }}
              src="https://static.wixstatic.com/media/ed9a86_fae1caa9740742d689844de75397e4c2~mv2.png/v1/fill/w_509,h_162,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/ed9a86_fae1caa9740742d689844de75397e4c2~mv2.png"
            />
            <View style={styles.contentTitle}>
              <Text style={styles.title}>Orden :</Text>
              <Text style={styles.text}>{order.file}</Text>
            </View>
          </View>
          <View
            style={{
              width: "100%",
              paddingTop: 60,
              paddingBottom: 20,
            }}
          >
            <Text wrap={false} style={{ textAlign: "left", color: "#0a5a7d" }}>
              ORDEN DE TRABAJO
            </Text>
          </View>
          <View
            style={{
              width: "100%",
              display: "flex",
              alignItems: "flex-start",
              flexDirection: "row",
              gap: "3mm",
            }}
          >
            <View style={[styles.contentTitle, { flex: 1 }]}>
              <Text style={styles.title}>Fecha :</Text>
              <Text style={styles.text}>{order.dateOrder}</Text>
            </View>
            <View style={[styles.contentTitle, { flex: 1 }]}>
              <Text style={styles.title}>Nombre :</Text>
              <Text style={styles.text}>{order.name}</Text>
            </View>
          </View>
          <View style={styles.line}></View>
          <View
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 20,
            }}
          >
            <Text style={styles.title}>Tareas Realizadas :</Text>
            <Text
              style={[
                styles.text,
                {
                  marginLeft: 20,
                },
              ]}
            >
              {order.description}
            </Text>
          </View>
        </View>
        <View
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "100%",
              display: "flex",
              alignItems: "flex-end",
              flexDirection: "row",
            }}
          >
            <View style={[styles.contentTitle, { flex: 1 }]}>
              <Text style={styles.title}>Técnico :</Text>
              <Text style={styles.text}>{order.owner.fullName}</Text>
            </View>
            <View
              style={[
                styles.contentTitle,
                { flex: 1, alignItems: "flex-end", justifyContent: "flex-end" },
              ]}
            >
              <Text style={[styles.title, { paddingBottom: 2 }]}>Aprobó :</Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <Image style={styles.signature} src={order.signature} />
                <Text style={styles.text}>{order.nameSignature}</Text>
              </View>
            </View>
          </View>
          <View style={styles.line}></View>
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
const OrderPDF = ({ orderInfo }) => {
  
  const order = {
    file:
      "0".repeat(4 - orderInfo.file.toString().length) +
      Math.abs(orderInfo.file).toString(),
    description: orderInfo.description,
    dateOrder: new Date(orderInfo.dateOrder).toLocaleDateString(),
    name: orderInfo.name,
    nameSignature: orderInfo.nameSignature,
    owner: {
      fullName: orderInfo.owner.fullName,
    },
    signature: orderInfo.signature,
  };

  return (
    <PDFViewer
      style={{
        width: "100%",
        height: "100vh",
      }}
    >
      <PDF order={order} />
    </PDFViewer>
  );
};
export default OrderPDF;
