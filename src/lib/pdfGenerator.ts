import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { Order } from '../types';

/**
 * Generates an official GoPvc Invoice PDF
 */
export async function generateInvoicePdf(order: Order): Promise<jsPDF> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const redPrimary = [220, 38, 38]; // #DC2626
  const darkGray = [30, 41, 59];
  const lightGray = [248, 250, 252];

  // Header Background Bar
  doc.setFillColor(redPrimary[0], redPrimary[1], redPrimary[2]);
  doc.rect(0, 0, 210, 28, 'F');

  // Brand Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text('GoPvc', 14, 18);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Premium PVC Card Printing Platform | www.gopvc.in', 14, 23);

  // INVOICE Title on top right
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('TAX INVOICE', 196, 18, { align: 'right' });

  // Invoice & Order Metadata Box
  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.roundedRect(14, 34, 182, 28, 2, 2, 'F');

  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Invoice Number:', 18, 41);
  doc.setFont('helvetica', 'normal');
  doc.text(`INV-${order.orderId}`, 48, 41);

  doc.setFont('helvetica', 'bold');
  doc.text('Order ID:', 18, 47);
  doc.setFont('helvetica', 'normal');
  doc.text(order.orderId, 48, 47);

  doc.setFont('helvetica', 'bold');
  doc.text('Order Date:', 18, 53);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' }), 48, 53);

  doc.setFont('helvetica', 'bold');
  doc.text('Payment Mode:', 110, 41);
  doc.setFont('helvetica', 'normal');
  doc.text(`${order.payment.provider} (${order.payment.status})`, 140, 41);

  doc.setFont('helvetica', 'bold');
  doc.text('Razorpay Ref:', 110, 47);
  doc.setFont('helvetica', 'normal');
  doc.text(order.payment.razorpayPaymentId || 'N/A', 140, 47);

  doc.setFont('helvetica', 'bold');
  doc.text('GSTIN:', 110, 53);
  doc.setFont('helvetica', 'normal');
  doc.text('19AABCG0123P1Z5 (GoPvc Pvt Ltd)', 140, 53);

  // Addresses Section: Billed To vs Shipped From
  let startY = 68;

  // Seller Details
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Sold & Fulfilled By:', 14, startY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('GoPvc Print Hub, Unit 4', 14, startY + 5);
  doc.text('Plot 88, Industrial Growth Center', 14, startY + 10);
  doc.text('Kolkata, WB - 700091, India', 14, startY + 15);
  doc.text('Email: support@gopvc.in | Helpline: +91 98765 43210', 14, startY + 20);

  // Customer Shipping Details
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Billed & Shipped To:', 110, startY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(order.customer.fullName, 110, startY + 5);
  doc.text(`${order.customer.houseNo}, ${order.customer.village}`, 110, startY + 10);
  doc.text(`PO: ${order.customer.postOffice}, PS: ${order.customer.policeStation}`, 110, startY + 15);
  doc.text(`${order.customer.district}, ${order.customer.state} - ${order.customer.pinCode}`, 110, startY + 20);
  doc.text(`Mobile: +91 ${order.customer.phone} | Email: ${order.customer.email}`, 110, startY + 25);

  // Line Separator
  startY += 34;
  doc.setDrawColor(226, 232, 240);
  doc.line(14, startY, 196, startY);

  // Items Table Header
  startY += 6;
  doc.setFillColor(redPrimary[0], redPrimary[1], redPrimary[2]);
  doc.rect(14, startY, 182, 8, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text('S.No', 18, startY + 5.5);
  doc.text('Description / Product Specifications', 32, startY + 5.5);
  doc.text('Qty', 125, startY + 5.5, { align: 'center' });
  doc.text('Unit Rate', 155, startY + 5.5, { align: 'right' });
  doc.text('Total (INR)', 192, startY + 5.5, { align: 'right' });

  // Items Table Rows
  startY += 8;
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.setFont('helvetica', 'bold');
  doc.text('1.', 18, startY + 6);
  doc.text('Premium HD PVC Card Printing (800 Micron Thermal UV)', 32, startY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`Applied Tier: ${order.priceBreakdown.appliedTierLabel || 'Standard Pricing'}`, 32, startY + 11);
  if (order.files && order.files.length > 0) {
    const filenames = order.files.map((f) => f.name).join(', ');
    const truncatedName = filenames.length > 60 ? filenames.substring(0, 57) + '...' : filenames;
    doc.text(`Files: ${truncatedName}`, 32, startY + 16);
  }

  doc.setFontSize(9);
  doc.text(`${order.quantity}`, 125, startY + 6, { align: 'center' });
  doc.text(`Rs. ${order.priceBreakdown.unitPrice.toFixed(2)}`, 155, startY + 6, { align: 'right' });
  doc.text(`Rs. ${(order.quantity * order.priceBreakdown.unitPrice).toFixed(2)}`, 192, startY + 6, { align: 'right' });

  // Table Bottom Line
  startY += 22;
  doc.setDrawColor(226, 232, 240);
  doc.line(14, startY, 196, startY);

  // Calculation Breakdown (Right Aligned)
  startY += 6;
  const rightValX = 192;
  const rightLabelX = 145;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');

  doc.text('Subtotal:', rightLabelX, startY);
  doc.text(`Rs. ${order.priceBreakdown.subtotal.toFixed(2)}`, rightValX, startY, { align: 'right' });

  if (order.priceBreakdown.tierDiscount > 0) {
    startY += 5;
    doc.text('Volume Tier Discount:', rightLabelX, startY);
    doc.text(`- Rs. ${order.priceBreakdown.tierDiscount.toFixed(2)}`, rightValX, startY, { align: 'right' });
  }

  if (order.priceBreakdown.couponDiscount > 0) {
    startY += 5;
    doc.text(`Coupon Discount (${order.priceBreakdown.couponCode || 'APPLIED'}):`, rightLabelX, startY);
    doc.text(`- Rs. ${order.priceBreakdown.couponDiscount.toFixed(2)}`, rightValX, startY, { align: 'right' });
  }

  startY += 5;
  doc.text('Shipping & Handling:', rightLabelX, startY);
  doc.text(
    order.priceBreakdown.shippingFee === 0 ? 'FREE' : `Rs. ${order.priceBreakdown.shippingFee.toFixed(2)}`,
    rightValX,
    startY,
    { align: 'right' }
  );

  // Grand Total Box
  startY += 8;
  doc.setFillColor(254, 242, 242);
  doc.roundedRect(120, startY, 76, 12, 1, 1, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(redPrimary[0], redPrimary[1], redPrimary[2]);
  doc.text('Grand Total:', 124, startY + 8);
  doc.text(`Rs. ${order.priceBreakdown.grandTotal.toFixed(2)}`, rightValX, startY + 8, { align: 'right' });

  // Generate QR Code for live order verification
  try {
    const qrDataUrl = await QRCode.toDataURL(`https://gopvc.in/track?orderId=${order.orderId}`, {
      width: 120,
      margin: 1,
    });
    doc.addImage(qrDataUrl, 'PNG', 14, startY - 5, 28, 28);
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text('Scan QR to verify order', 14, startY + 26);
  } catch (e) {
    // Ignore QR errors
  }

  // Footer & Terms
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');

  const footerY = 270;
  doc.line(14, footerY - 5, 196, footerY - 5);
  doc.text('Terms & Conditions: 1. PVC Cards are printed on 800-micron waterproof CR80 substrate.', 14, footerY);
  doc.text('2. Please inspect package upon delivery. For damaged cards, contact support@gopvc.in within 48 hours.', 14, footerY + 4);
  doc.text('This is a computer-generated tax invoice and does not require a physical signature.', 105, footerY + 12, { align: 'center' });

  return doc;
}

/**
 * Generates an A6 Printable Shipping Label PDF
 */
export async function generateShippingLabelPdf(order: Order): Promise<jsPDF> {
  // A6 Dimensions: 105mm x 148mm
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [105, 148],
  });

  const redPrimary = [220, 38, 38];
  const darkText = [15, 23, 42];

  // Outer Border
  doc.setLineWidth(0.5);
  doc.setDrawColor(203, 213, 225);
  doc.rect(3, 3, 99, 142);

  // Top Bar - GoPvc & Express Shipping
  doc.setFillColor(redPrimary[0], redPrimary[1], redPrimary[2]);
  doc.rect(3, 3, 99, 14, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('GoPvc', 6, 12);

  doc.setFontSize(9);
  doc.text('PRIORITY COURIER', 99, 12, { align: 'right' });

  // Order ID & Barcode representation
  doc.setTextColor(darkText[0], darkText[1], darkText[2]);
  doc.setFontSize(11);
  doc.text(`ORDER ID: ${order.orderId}`, 6, 24);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`Qty: ${order.quantity} PVC Card(s) | Date: ${new Date(order.createdAt).toLocaleDateString('en-IN')}`, 6, 29);

  // QR Code for Courier Scanning
  try {
    const qrDataUrl = await QRCode.toDataURL(
      JSON.stringify({
        orderId: order.orderId,
        pin: order.customer.pinCode,
        phone: order.customer.phone,
      }),
      { width: 100, margin: 1 }
    );
    doc.addImage(qrDataUrl, 'PNG', 72, 19, 26, 26);
  } catch (e) {
    // Ignore QR error
  }

  // Horizontal Divider
  doc.setLineWidth(0.3);
  doc.line(3, 48, 102, 48);

  // SHIP TO SECTION
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setFillColor(241, 245, 249);
  doc.rect(3, 48, 99, 7, 'F');
  doc.text('SHIP TO (DELIVERY ADDRESS):', 6, 53);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(order.customer.fullName.toUpperCase(), 6, 61);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  let addrY = 66;

  doc.text(`${order.customer.houseNo}, ${order.customer.village}`, 6, addrY);
  addrY += 5;
  doc.text(`PO: ${order.customer.postOffice}, PS: ${order.customer.policeStation}`, 6, addrY);
  addrY += 5;
  if (order.customer.landmark) {
    doc.text(`Landmark: ${order.customer.landmark}`, 6, addrY);
    addrY += 5;
  }
  doc.text(`${order.customer.district}, ${order.customer.state}`, 6, addrY);
  addrY += 6;

  // PIN CODE BOX - BOLD LARGE
  doc.setFillColor(220, 38, 38);
  doc.roundedRect(6, addrY, 93, 11, 1, 1, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text(`PIN CODE: ${order.customer.pinCode}`, 10, addrY + 8);

  // Phone Number
  addrY += 17;
  doc.setTextColor(darkText[0], darkText[1], darkText[2]);
  doc.setFontSize(11);
  doc.text(`MOBILE: +91 ${order.customer.phone}`, 6, addrY);

  // Divider
  addrY += 5;
  doc.line(3, addrY, 102, addrY);

  // RETURN ADDRESS / SENDER
  addrY += 2;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setFillColor(248, 250, 252);
  doc.rect(3, addrY, 99, 5, 'F');
  doc.text('RETURN IF UNDELIVERED TO:', 6, addrY + 4);

  addrY += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('GoPvc Print Hub, Unit 4, Plot 88, Industrial Center', 6, addrY);
  doc.text('Kolkata, WB - 700091 | Support: +91 98765 43210', 6, addrY + 4);

  // Footer Instructions
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('DO NOT BEND - CONTAINS RIGID HIGH-PRECISION PVC CARDS', 52.5, 142, { align: 'center' });

  return doc;
}
