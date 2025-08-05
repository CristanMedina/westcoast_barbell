import escpos from "escpos";
import escposUSB from "escpos-usb";
import moment from "moment";
import Company from "../models/company.model.js";
import User from "../models/user.model.js";
import Trainer from "../models/trainer.model.js";

escpos.USB = escposUSB;

/* export const printTicket = async ({ userId, trainerId, amount, transactionType, weekDay }) => {
  try {
    const company = await Company.findOne();
    const user = await User.findByPk(userId);
    const trainer = await Trainer.findByPk(trainerId);

    if (!company || !user || !trainer) throw new Error("Missing company, user, or trainer info");

    const device = new escpos.USB();
    const printer = new escpos.Printer(device);

    device.open(() => {
      printer
        .align("CT")
        .style("B")
        .size(1, 1)
        .text(company.name)
        .style("NORMAL")
        .text(company.address)
        .text(`RFC: ${company.rfc}`)
        .text(`Tel: ${company.phone}`)
        .text(company.website || "")
        .text("--------------------------------");

      printer
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

*/

export const printTicket = async ({ userId, trainerId, amount, transactionType, weekDay }) => {
  try {
    const company = await Company.findOne();
    const user = await User.findByPk(userId);
    const trainer = await Trainer.findByPk(trainerId);

    if (!company || !user || !trainer) throw new Error("Missing company, user, or trainer info");

    console.log(`
    ---- TICKET ----
    ${company.name}
    ${company.address}
    RFC: ${company.rfc}
    Tel: ${company.phone}
    Website: ${company.website || "N/A"}
    ----------------
    Cliente: ${user.first_name} ${user.last_name} (ID: ${user.id})
    Entrenamiento: ${user.training_type}
    Trainer: ${trainer.first_name} ${trainer.last_name} (ID: ${trainer.id})
    Semana/Día: ${weekDay}
    Fecha: ${new Date().toLocaleString()}
    Tipo de Transacción: ${transactionType}
    Monto: $${amount.toFixed(2)}
    Total (NO IVA): $${amount.toFixed(2)}
    ---- END TICKET ----
    `);
  } catch (error) {
    console.error("Error generating ticket:", error.message);
  }
};
