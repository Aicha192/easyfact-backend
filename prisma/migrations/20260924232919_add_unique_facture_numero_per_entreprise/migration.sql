/*
  Warnings:

  - A unique constraint covering the columns `[entrepriseId,numero]` on the table `Facture` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Facture_entrepriseId_numero_key` ON `Facture`(`entrepriseId`, `numero`);
