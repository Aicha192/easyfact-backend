-- CreateTable
CREATE TABLE `FactureSequence` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entrepriseId` INTEGER NOT NULL,
    `annee` INTEGER NOT NULL,
    `dernierNumero` INTEGER NOT NULL DEFAULT 0,

    INDEX `FactureSequence_entrepriseId_idx`(`entrepriseId`),
    UNIQUE INDEX `FactureSequence_entrepriseId_annee_key`(`entrepriseId`, `annee`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Facture_entrepriseId_fkey` ON `Facture`(`entrepriseId`);

-- AddForeignKey
ALTER TABLE `FactureSequence` ADD CONSTRAINT `FactureSequence_entrepriseId_fkey` FOREIGN KEY (`entrepriseId`) REFERENCES `Entreprise`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
