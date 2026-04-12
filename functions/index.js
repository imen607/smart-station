const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "azzaboujemaa10@gmail.com",
    pass: "xynzoldshtexogjp"  // ← à remplacer
  }
});

exports.checkExpiredSubscriptions = functions.pubsub
  .schedule("every 1 minutes")
  .onRun(async (context) => {
    const db = admin.database();
    const now = Math.floor(Date.now() / 1000);

    const snapshot = await db.ref("cards").once("value");

    snapshot.forEach((cardSnap) => {
      const card = cardSnap.val();
      const sub = card?.subscription;
      const email = card?.email;

      if (!sub || !email) return;
      if (!sub.isActive) return;
      if (now < sub.endAt) return;

      // Marquer expiré
      cardSnap.ref.child("subscription/isActive").set(false);

      // Envoyer email
      transporter.sendMail({
        from: "Smart Station <azzaboujemaa10@gmail.com>",
        to: email,
        subject: "⚠️ Votre abonnement Smart Station a expiré",
        html: `
          <h2>Abonnement expiré</h2>
          <p>Votre abonnement <strong>${sub.offerLabel}</strong> est arrivé à expiration.</p>
          <p>Rechargez votre carte pour continuer à utiliser le service.</p>
          <br/>
          <p>Merci — Smart Station</p>
        `
      });

      console.log("Email envoyé à", email);
    });

    return null;
  });