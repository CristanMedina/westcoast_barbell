import escpos from "escpos";
import escposUSB from "escpos-usb";

escpos.USB = escposUSB;

const device = new escpos.USB(); // O pasa Vendor ID y Product ID
const printer = new escpos.Printer(device);

device.open((error) => {
  if (error) return console.error("Error abriendo impresora:", error);

  printer
    .align("CT")
    .text("PRUEBA DE IMPRESIÓN")
    .cut()
    .close();
});
