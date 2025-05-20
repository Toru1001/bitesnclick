import {
  Page,
  Text,
  View,
  Document,
  PDFViewer,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import { styles } from "./style";
import { Button } from "@/components/ui/button";

interface InvoicePDFProps {
  orderDetails: any[];
  subTotal: number;
  orders: any;
}

const InvoicePDF = ({ orderDetails, subTotal, orders }: InvoicePDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header Section */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, styles.textBold]}>INVOICE</Text>
          <Text>Invoice #INV-{orders?.[0]?.orderid}</Text>
        </View>
        <View style={styles.spaceY}>
          <Text style={styles.textBold}>HomeBites Davao</Text>
          <Text>Door 8 Gahol bldg., DMSF Drive</Text>
          <Text>Bajada, Davao City, Philippines</Text>
        </View>
      </View>

      {/* Bill To Section */}
      <View style={styles.spaceY}>
        <Text style={[styles.billTo, styles.textBold]}>Bill To:</Text>
        <Text style={styles.details}>
          Customer Name: {`${orders?.[0]?.customers?.first_name ?? ""} ${orders?.[0]?.customers?.last_name ?? ""}`}
        </Text>
        <Text style={styles.details}>Customer Address: {orders?.[0]?.delivery_address ?? ""}</Text>
        <Text style={styles.details}>Phone Number: {orders?.[0]?.customers?.mobile_num ?? ""}</Text>
        <Text style={styles.details}>Payment: {orders?.[0]?.paymentMethod ?? ""}</Text>
        <Text style={styles.details}>Order Date: {orders?.[0]?.order_date ?? ""}</Text>
        <Text style={styles.details}>Message: {orders?.[0]?.message ?? "none"}</Text>
      </View>

      {/* Table Header */}
      <View style={[styles.tableRow, styles.tableHeader]}>
        <Text style={styles.tableCol}>Product</Text>
        <Text style={styles.tableCol}>Quantity</Text>
        <Text style={styles.tableCol}>Unit Price</Text>
        <Text style={styles.tableCol}>Total</Text>
      </View>

      {/* Table Data */}
      {orderDetails.map((item, index) => (
        <View style={styles.tableRow} key={index}>
          <Text style={styles.tableCol}>{item.products.name}</Text>
          <Text style={styles.tableCol}>{item.quantity}</Text>
          <Text style={styles.tableCol}>₱{item.prod_price.toFixed(2)}</Text>
          <Text style={styles.tableCol}>
            ₱
            {item.price.toFixed(2)}
          </Text>
        </View>
      ))}

      {/* Totals Section */}
      <View style={styles.totals}>
        <View style={{ width: 256 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <Text style={styles.textNormal}>Subtotal</Text>
            <Text style={styles.textNormal}>₱ {subTotal.toFixed(2)}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <Text style={styles.textNormal}>Delivery Fee</Text>
            <Text style={styles.textNormal}>₱ 40.00</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <Text style={styles.textNormal}>Voucher</Text>
            <Text style={styles.textNormal}>{orders?.[0]?.vouchers?.percent ?? 0}%</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <Text style={styles.textTotal}>Total</Text>
            <Text style={styles.textTotal}>₱{orders?.[0]?.order_price.toFixed(2) ?? "0.00"}</Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

export default function Invoice2({ orderDetails, subTotal, orders }: InvoicePDFProps) {
  
  return (
    <div className="flex flex-col w-150 h-120 mt-5">
      <div className="w-full h-100">
        <PDFViewer width="100%" height="100%">
          <InvoicePDF orderDetails={orderDetails} subTotal={subTotal} orders={orders}/>
        </PDFViewer>
      </div>
      <div className="flex justify-center mt-10">
        <PDFDownloadLink
          document={
            <InvoicePDF orderDetails={orderDetails} subTotal={subTotal} orders={orders}/>
          }
          fileName={`invoice#inv-${orders?.[0]?.orderid}.pdf`}
        >
          <Button
              variant="outline"
              className="border-1 border-[#E19517] text-[#E19517] hover:bg-[#E19517] hover:text-white font-semibold  text-xs rounded cursor-pointer"
            >
              Print
            </Button>
        </PDFDownloadLink>
      </div>
    </div>
  );
}
