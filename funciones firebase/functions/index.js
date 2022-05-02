const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp(functions.config.firebase);
// admin.initializeApp();
const db = admin.firestore();

//--------------
//construccion de funciones para el mailing automatizado
//--------------
const trasporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  post: 465,
  secure: true,
  auth: {
    user: "apikey",
    pass: "###########################", //colocar clave de sendgrid
  },
});

function sendEmail(to, subject, body) {
  const mailOptions = {
    from: "#######@###.##", // colocar mail habilitado desde sendgrid u otro
    to: to,
    subject: subject,
    html: body,
  };
  return trasporter.sendMail(mailOptions, (e, data) => {
    let log;
    if (e) {
      log = e;
    } else {
      log = "mail enviado a: ".concat(to);
    }
    console.log(log);
    return;
  });
}

//--------------
// asunt oy cuerpo de los mails
//--------------
const asuntoRechazado = "Asunto mail Rechazo";
const bodyRechazado = `<p>Body en formato HTML!</p>`;
const asuntoAceptado = "Asunto mail Aceptación ";
const bodyAceptado = `<p>Body en formato HTML!</p>`;

//--------------------
//funcion activada al crearse un documento para el envio de un mail o su almacenamiento en caso de rebalsar el maximo gratuito del dia
//--------------------
exports.createEstudiante = functions.firestore
  .document(`/ingresantes/{documentId}`)
  .onCreate((snap, context) => {
    const documento = db.doc("tareas/timer"); // testear
    const doc = snap.data();

    const email = doc.email;
    const sector = doc.iSector;
    const secu = doc.cursandoSecu;
    const juris = doc.iProvincia;
    let body;
    let asunto;
    var aceptadx = false;

    if (
      sector == "Estatal" &&
      secu == "si" &&
      juris != "Ciudad de Buenos Aires"
    ) {
      aceptadx = true;
      asunto = asuntoAceptado;
      body = bodyAceptado;
    } else {
      asunto = asuntoRechazado;
      body = bodyRechazado;
    }

    documento.get().then((documentSnapshot) => {
      var data = documentSnapshot.data();
      if (data.count < 90) {
        documento.update({
          time: admin.firestore.Timestamp.now(),
          count: admin.firestore.FieldValue.increment(1),
        });
        return sendEmail(email, asunto, body);
      } else {
        console.log(" se guardo el mail en la lista de espera | ", email);

        if (aceptadx) {
          return documento.update({
            time: admin.firestore.Timestamp.now(),
            listaAceptadxs: admin.firestore.FieldValue.arrayUnion(email),
          });
        } else {
          return documento.update({
            time: admin.firestore.Timestamp.now(),
            listaRechazaxs: admin.firestore.FieldValue.arrayUnion(email), // listaRechazaxs: admin.firestore.FieldValue.arrayUnion(...[email]),
          });
        }
      }
    });
  });

//------------
//Funcion activada ciclicamente (todos los dias a las 7am de argentina)
//-----------
exports.revisarListaMail = functions.pubsub
  .schedule("0 7 * * *")
  .timeZone("America/Argentina/Buenos_Aires")
  .onRun((context) => {
    const documento = db.doc("tareas/timer");

    documento.get().then((documentSnapshot) => {
      var data = documentSnapshot.data();

      var reseteoContador = Math.min(data.count, 90) * -1; //revisar la cuenta y el contador
      var mailsEnviados = 0;
      var listaRechazaxsCopia = [...data.listaRechazaxs];
      var listaAceptadxsCopia = [...data.listaAceptadxs];
      var listaRechazaxsSend = [null];
      var listaAceptadxsSend = [null];

      let len = listaAceptadxsCopia.length;
      if (mailsEnviados < 90) {
        for (i = 0; i < Math.min(len, 90 - mailsEnviados); i++) {
          let mail = listaAceptadxsCopia.pop();

          let asunto = asuntoAceptado;
          let body = bodyAceptado;

          sendEmail(mail, asunto, body);
          listaAceptadxsSend.push(mail);
          mailsEnviados++;
        }
      }

      if (mailsEnviados < 90) {
        len = listaRechazaxsCopia.length;
        for (i = 0; i < Math.min(len, 90 - mailsEnviados); i++) {
          let mail = listaRechazaxsCopia.pop();
          let asunto = asuntoRechazado;
          let body = bodyRechazado;
          sendEmail(mail, asunto, body);
          listaRechazaxsSend.push(mail);
          mailsEnviados++;
        }
      }

      reseteoContador += mailsEnviados;
      return documento.update({
        time: admin.firestore.Timestamp.now(),
        count: admin.firestore.FieldValue.increment(reseteoContador),
        listaAceptadxs: admin.firestore.FieldValue.arrayRemove(
          ...listaAceptadxsSend
        ),
        listaRechazaxs: admin.firestore.FieldValue.arrayRemove(
          ...listaRechazaxsSend
        ),
      });
    });
  });
