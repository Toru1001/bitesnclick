import { StyleSheet, Font } from "@react-pdf/renderer";

Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "/fonts/Roboto/static/Roboto-Regular.ttf",
      fontWeight: "normal",
    },
    {
      src: "/fonts/Roboto/static/Roboto-Bold.ttf",
      fontWeight: "bold",
    },
  ],
});

export const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fff",
    color: "#262626",
    fontFamily: "Roboto",
    fontSize: 12,
    paddingHorizontal: 50,
    paddingVertical: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 5,
    fontWeight: "bold",
  },
  textBold: {
    fontWeight: "bold",
  },
  textTotal: {
    fontWeight: "bold",
    fontSize: 18,
  },
  textNormal: {
    fontWeight: "normal",
  },
  spaceY: {
    flexDirection: "column",
    marginBottom: 15,
  },
  details: {
    marginBottom: 2,
  },
  billTo: {
    marginBottom: 10,
    fontSize: 12,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    borderBottomStyle: "solid",
    paddingVertical: 6,
    alignItems: "center",
  },
  tableCol: {
    width: "25%",
    paddingHorizontal: 4,
  },
  tableHeader: {
    backgroundColor: "#e5e5e5",
  },
  totals: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
  },
});