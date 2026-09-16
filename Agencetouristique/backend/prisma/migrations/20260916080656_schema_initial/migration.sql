/*
  Warnings:

  - You are about to drop the `Test` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Test";

-- CreateTable
CREATE TABLE "Agence" (
    "idagc" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "tel" TEXT NOT NULL,
    "logo" TEXT,
    "email" TEXT NOT NULL,
    "mdp" TEXT NOT NULL,
    "description" TEXT,
    "idresp" INTEGER NOT NULL,

    CONSTRAINT "Agence_pkey" PRIMARY KEY ("idagc")
);

-- CreateTable
CREATE TABLE "Responsable" (
    "idresp" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "tel" TEXT NOT NULL,
    "photo" TEXT,
    "email" TEXT NOT NULL,
    "mdp" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "ville" TEXT NOT NULL,

    CONSTRAINT "Responsable_pkey" PRIMARY KEY ("idresp")
);

-- CreateTable
CREATE TABLE "Agent" (
    "idagt" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "tel" TEXT NOT NULL,
    "photo" TEXT,
    "email" TEXT NOT NULL,
    "mdp" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "ville" TEXT NOT NULL,
    "statut" TEXT NOT NULL,
    "idagc" INTEGER NOT NULL,
    "idresp" INTEGER NOT NULL,

    CONSTRAINT "Agent_pkey" PRIMARY KEY ("idagt")
);

-- CreateTable
CREATE TABLE "Chauffeur" (
    "idchauffeur" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "tel" TEXT NOT NULL,
    "photo" TEXT,
    "email" TEXT NOT NULL,
    "mdp" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "ville" TEXT NOT NULL,
    "statut" TEXT NOT NULL,
    "idagc" INTEGER NOT NULL,

    CONSTRAINT "Chauffeur_pkey" PRIMARY KEY ("idchauffeur")
);

-- CreateTable
CREATE TABLE "Vehicule" (
    "idveh" SERIAL NOT NULL,
    "immatriculation" TEXT NOT NULL,
    "marque" TEXT NOT NULL,
    "modele" TEXT NOT NULL,
    "capacite" INTEGER NOT NULL,
    "photo" TEXT,
    "status" TEXT NOT NULL,
    "idchauffeur" INTEGER,
    "idagc" INTEGER NOT NULL,

    CONSTRAINT "Vehicule_pkey" PRIMARY KEY ("idveh")
);

-- CreateTable
CREATE TABLE "Circuit" (
    "idcircuit" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "capacite" INTEGER NOT NULL,
    "photo" TEXT,
    "status" TEXT NOT NULL,
    "idagc" INTEGER NOT NULL,

    CONSTRAINT "Circuit_pkey" PRIMARY KEY ("idcircuit")
);

-- CreateTable
CREATE TABLE "Reservation" (
    "idres" SERIAL NOT NULL,
    "datereservation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "datevoyage" TIMESTAMP(3) NOT NULL,
    "dateretour" TIMESTAMP(3) NOT NULL,
    "lieu" TEXT NOT NULL,
    "idcircuit" INTEGER NOT NULL,
    "idagt" INTEGER NOT NULL,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("idres")
);

-- CreateTable
CREATE TABLE "RendezVous" (
    "idrdv" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "heure" TIMESTAMP(3) NOT NULL,
    "motif" TEXT NOT NULL,
    "statut" TEXT NOT NULL,
    "commentaire" TEXT,
    "idagt" INTEGER NOT NULL,

    CONSTRAINT "RendezVous_pkey" PRIMARY KEY ("idrdv")
);

-- CreateTable
CREATE TABLE "Recu" (
    "idrec" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "daterecu" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "heure" TIMESTAMP(3) NOT NULL,
    "idres" INTEGER NOT NULL,

    CONSTRAINT "Recu_pkey" PRIMARY KEY ("idrec")
);

-- CreateTable
CREATE TABLE "Utilisateur" (
    "idruti" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "tel" TEXT NOT NULL,
    "photo" TEXT,
    "email" TEXT NOT NULL,
    "mdp" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "ville" TEXT NOT NULL,

    CONSTRAINT "Utilisateur_pkey" PRIMARY KEY ("idruti")
);

-- CreateTable
CREATE TABLE "Notification" (
    "idnot" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reference" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "idutilisateur" INTEGER NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("idnot")
);

-- CreateIndex
CREATE UNIQUE INDEX "Agence_email_key" ON "Agence"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Agence_idresp_key" ON "Agence"("idresp");

-- CreateIndex
CREATE UNIQUE INDEX "Responsable_email_key" ON "Responsable"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Agent_email_key" ON "Agent"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Chauffeur_email_key" ON "Chauffeur"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicule_immatriculation_key" ON "Vehicule"("immatriculation");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicule_idchauffeur_key" ON "Vehicule"("idchauffeur");

-- CreateIndex
CREATE UNIQUE INDEX "Recu_idres_key" ON "Recu"("idres");

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_email_key" ON "Utilisateur"("email");

-- AddForeignKey
ALTER TABLE "Agence" ADD CONSTRAINT "Agence_idresp_fkey" FOREIGN KEY ("idresp") REFERENCES "Responsable"("idresp") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agent" ADD CONSTRAINT "Agent_idagc_fkey" FOREIGN KEY ("idagc") REFERENCES "Agence"("idagc") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agent" ADD CONSTRAINT "Agent_idresp_fkey" FOREIGN KEY ("idresp") REFERENCES "Responsable"("idresp") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chauffeur" ADD CONSTRAINT "Chauffeur_idagc_fkey" FOREIGN KEY ("idagc") REFERENCES "Agence"("idagc") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicule" ADD CONSTRAINT "Vehicule_idchauffeur_fkey" FOREIGN KEY ("idchauffeur") REFERENCES "Chauffeur"("idchauffeur") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicule" ADD CONSTRAINT "Vehicule_idagc_fkey" FOREIGN KEY ("idagc") REFERENCES "Agence"("idagc") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Circuit" ADD CONSTRAINT "Circuit_idagc_fkey" FOREIGN KEY ("idagc") REFERENCES "Agence"("idagc") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_idcircuit_fkey" FOREIGN KEY ("idcircuit") REFERENCES "Circuit"("idcircuit") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_idagt_fkey" FOREIGN KEY ("idagt") REFERENCES "Agent"("idagt") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RendezVous" ADD CONSTRAINT "RendezVous_idagt_fkey" FOREIGN KEY ("idagt") REFERENCES "Agent"("idagt") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recu" ADD CONSTRAINT "Recu_idres_fkey" FOREIGN KEY ("idres") REFERENCES "Reservation"("idres") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_idutilisateur_fkey" FOREIGN KEY ("idutilisateur") REFERENCES "Utilisateur"("idruti") ON DELETE RESTRICT ON UPDATE CASCADE;
