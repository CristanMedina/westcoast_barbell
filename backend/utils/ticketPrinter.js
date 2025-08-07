import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import Company from "../models/company.model.js";

import pkg from "pdf-to-printer";
const { print: pdfPrint } = pkg;

const createTicketPDF = async (payment) => {
  return new Promise(async (resolve, reject) => {
    try {
      const company = await Company.findOne();
      if (!company) throw new Error("Company info not found");

      const tmpDir = path.join(process.cwd(), "tmp");
      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir);
      }

      // Tamaño ancho fijo, altura grande para que no corte contenido
      const width = 288; // ~80mm
      const height = 2000; // alto grande para que todo quepa

      const doc = new PDFDocument({
        size: [width, height],
        margins: { top: 0, bottom: 10, left: 10, right: 10 },
      });

      const pdfPath = path.join(tmpDir, `ticket-${Date.now()}.pdf`);
      const stream = fs.createWriteStream(pdfPath);
      doc.pipe(stream);

      let y = 0;

      const logoPath = path.join(process.cwd(), "public/logo.png");
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, (width - 100) / 2, y, { width: 100 });
        y += 60;
      }

      const lineHeight = 14;
      const textX = 10;

      doc.fontSize(12).text(company.name, textX, y, { width: width - 20, align: "center" });
      y += lineHeight;

      doc.text(company.address, textX, y, { width: width - 20, align: "center" });
      y += lineHeight;

      doc.text(`RFC: ${company.rfc}`, textX, y, { width: width - 20, align: "center" });
      y += lineHeight;

      doc.text(`Tel: ${company.phone}`, textX, y, { width: width - 20, align: "center" });
      y += lineHeight;

      if (company.website) {
        doc.text(company.website, textX, y, { width: width - 20, align: "center" });
        y += lineHeight;
      }

      y += 6;

      doc.fontSize(10);

      doc.text("------------------------------------------", textX, y, { width: width - 20, align: "left" });
      y += lineHeight;

      doc.text(`Cliente: ${payment.user ? `${payment.user.first_name} ${payment.user.last_name}` : "Usuario no encontrado"}`, textX, y);
      y += lineHeight;

      doc.text(`User ID: ${payment.user ? payment.user.id : "N/A"}`, textX, y);
      y += lineHeight;

      doc.text(`Entrenamiento: ${payment.user ? payment.user.training_type : "N/A"}`, textX, y);
      y += lineHeight;

      doc.text(`Trainer: ${payment.trainer ? `${payment.trainer.first_name} ${payment.trainer.last_name}` : "Entrenador no asignado"}`, textX, y);
      y += lineHeight;

      doc.text(`Trainer ID: ${payment.trainer ? payment.trainer.id : "N/A"}`, textX, y);
      y += lineHeight;

      doc.text(`Semana/Día: ${payment.week_day}`, textX, y);
      y += lineHeight;

      doc.text(`Fecha: ${new Date().toLocaleString()}`, textX, y);
      y += lineHeight;

      doc.text(`Tipo de Transacción: ${payment.transaction_type}`, textX, y);
      y += lineHeight;

      doc.text(`Monto: $${payment.amount.toFixed(2)}`, textX, y);
      y += lineHeight;

      doc.text(`Total (NO IVA): $${payment.amount.toFixed(2)}`, textX, y);
      y += lineHeight;

      doc.text("------------------------------------------", textX, y, { width: width - 20, align: "left" });
      y += lineHeight + 10;

      doc.fontSize(12).text("¡Gracias por su pago!", textX, y, { width: width - 20, align: "center" });

      doc.end();

      stream.on("finish", () => resolve(pdfPath));
      stream.on("error", (err) => reject(err));
    } catch (error) {
      reject(error);
    }
  });
};

export const printTicket = async (payment) => {
  try {
    const pdfPath = await createTicketPDF(payment);

    await pdfPrint(pdfPath);

    fs.unlink(pdfPath, (err) => {
      if (err) console.warn("No se pudo borrar el archivo temporal:", pdfPath);
    });

    console.log("Ticket impreso correctamente");
  } catch (error) {
    console.error("Error imprimiendo ticket:", error.message);
    console.log("Mostrando ticket en consola como fallback:");
    console.log(`
================= TICKET =================
Cliente: ${payment.user ? `${payment.user.first_name} ${payment.user.last_name}` : "Usuario no encontrado"}
User ID: ${payment.user ? payment.user.id : "N/A"}
Entrenamiento: ${payment.user ? payment.user.training_type : "N/A"}
Trainer: ${payment.trainer ? `${payment.trainer.first_name} ${payment.trainer.last_name}` : "Entrenador no asignado"}
Trainer ID: ${payment.trainer ? payment.trainer.id : "N/A"}
Semana/Día: ${payment.week_day}
Fecha: ${new Date().toLocaleString()}
Tipo de Transacción: ${payment.transaction_type}
Monto: $${payment.amount.toFixed(2)}
Total (NO IVA): $${payment.amount.toFixed(2)}
==========================================
    `);
  }
};
