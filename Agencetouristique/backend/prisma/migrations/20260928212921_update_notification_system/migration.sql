/*
  Warnings:

  - You are about to drop the column `idutilisateur` on the `Notification` table. All the data in the column will be lost.
  - Added the required column `iddestinataire` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_idutilisateur_fkey";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "idutilisateur",
ADD COLUMN     "iddestinataire" INTEGER NOT NULL,
ADD COLUMN     "role" TEXT NOT NULL;
