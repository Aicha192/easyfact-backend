/*
  Warnings:

  - A unique constraint covering the columns `[entrepriseId,factureNumero]` on the table `Proforma` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Proforma_entrepriseId_factureNumero_key` ON `Proforma`(`entrepriseId`, `factureNumero`);
