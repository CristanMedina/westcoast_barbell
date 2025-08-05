import escpos from "escpos";
import escposUSB from "escpos-usb";
import moment from "moment";
import path from "path";
import Company from "../models/company.model.js";
import User from "../models/user.model.js";
import Trainer from "../models/trainer.model.js";

escpos.USB = escposUSB;

export const printTicket = async ({ userId, trainerId, amount, transactionType, weekDay }) => {
  try {
    const company = await Company.findOne();
    const user = await User.findByPk(userId);
    const trainer = await Trainer.findByPk(trainerId);

    if (!company || !user || !trainer) throw new Error("Missing company, user, or trainer info");

    const logoPath = path.join(process.cwd(), "public/logo.png");
    const image = await escpos.Image.load(logoPath);

    const device = new escpos.USB();
    const printer = new escpos.Printer(device);

    device.open((error) => {
      if (error) {
        console.error("Error opening device:", error);
        return;
      }

      printer
        .align("CT")
        .raster(image)
        .newline()

        .align("CT")
        .style("B")
        .size(1, 1)
        .text(company.name)
        .style("NORMAL")
        .text(company.address)
        .text(`RFC: ${company.rfc}`)
        .text(`Tel: ${company.phone}`)
        .text(company.website || "")
        .text("--------------------------------")

        .align("LT")
        .text(`Cliente: ${user.first_name} ${user.last_name}`)
        .text(`User ID: ${user.id}`)
        .text(`Entrenamiento: ${user.training_type}`)
        .text(`Trainer: ${trainer.first_name} ${trainer.last_name}`)
        .text(`Trainer ID: ${trainer.id}`)
        .text(`Semana/Día: ${weekDay}`)
        .text(`Fecha: ${moment().format("DD/MM/YYYY HH:mm")}`)
        .text(`Tipo de Transacción: ${transactionType}`)
        .text(`Monto: $${amount.toFixed(2)}`)
        .text(`Total (NO IVA): $${amount.toFixed(2)}`)
        .text("--------------------------------")

        .align("CT")
        .text("¡Gracias por su pago!")
        .cut()
        .close();
    });
  } catch (error) {
    console.error("Error printing ticket:", error.message);
  }
};
