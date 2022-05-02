const express = require("express");
const Firestore = require("@google-cloud/firestore");
const cors = require("cors");

const corsOptions = {
  origin: "Dominio de la web",
  optionsSuccessStatus: 200,
  methods: "GET",
};

const db = new Firestore();
const app = express();
app.use(cors(corsOptions));
// app.use(cors())

app.use(express.json());
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Rest API listening on port ${port}`);
});

app.get("/", async (req, res) => {
  const documento = req.query.documento;
  const email = req.query.email;
  const queryDoc = db
    .collection("ingresantes")
    .where("documento", "==", documento);
  const querySnapshDoc = await queryDoc.get();

  const queryEmail = db.collection("ingresantes").where("email", "==", email);
  const querySnapshEmail = await queryEmail.get();
  // false en caso de existir ducplicados
  if (querySnapshDoc.size > 0 || querySnapshEmail.size > 0) {
    res.json({ unico: false });
  } else {
    res.json({ unico: true });
  }
});
