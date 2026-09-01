-- 1. Ajouter temporairement entrepriseId comme nullable
ALTER TABLE `Proforma`
ADD COLUMN `entrepriseId` INTEGER NULL;

-- 2. Associer les anciennes proformas à l'entreprise 4
UPDATE `Proforma`
SET `entrepriseId` = 4
WHERE `entrepriseId` IS NULL;

-- 3. Rendre entrepriseId obligatoire
ALTER TABLE `Proforma`
MODIFY COLUMN `entrepriseId` INTEGER NOT NULL;

-- 4. Ajouter la relation avec Entreprise
ALTER TABLE `Proforma`
ADD CONSTRAINT `Proforma_entrepriseId_fkey`
FOREIGN KEY (`entrepriseId`) REFERENCES `Entreprise`(`id`)
ON DELETE CASCADE
ON UPDATE CASCADE;