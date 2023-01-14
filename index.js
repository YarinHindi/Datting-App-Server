const exp = require("express");
const firebase = require("firebase-admin");
const serviceAccount = require("./config/datingapp.json");
const cors = require("cors");
const app = exp();

const corsOptions = {
  credentials: true,
};

// const res = await fetch("http://localhost:1000/getUsers", { method: "GET" });

// const users = await res.json();

app.use(exp.json());
app.use(cors());

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://datingapp-3423b.firebaseio.com/",
});

app.get("/getUsers", async (req, res) => {
  try {
    let firestore = firebase.firestore();

    const users = (await firestore.collection("users").get()).docs.map((doc) =>
      doc.data()
    );

    console.log(users);
    console.log("hello there");
    res.send({ users });
  } catch (err) {
    res.send(err);
    console.log(err);
  }
});

app.post("/deleteUser", async (req, res) => {
  try {
    
    let uid = req.body.id || "";
    console.log(uid);
    if (uid.length > 0) {
      firebase.auth().deleteUser(uid).then(() => {
        console.log('Successfully deleted user');
      })
      .catch((error) => {
        console.log('Error deleting user:', error);
      });
    }
    
    res.send('done');
  } catch (err) {
    res.send(err);
    console.log(err);
  }
});

app.listen(1000, () => {
  console.log("Server is up!");
});
