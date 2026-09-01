-- Ajouter temporairement les colonnes comme nullable
ALTER TABLE `parametres`
ADD COLUMN `entrepriseId` INTEGER NULL;

ALTER TABLE `produit`
ADD COLUMN `entrepriseId` INTEGER NULL;

-- Rattacher les anciennes données à EasyFact (entreprise id = 1)
UPDATE `parametres`
SET `entrepriseId` = 1
WHERE `entrepriseId` IS NULL;

UPDATE `produit`
SET `entrepriseId` = 1
WHERE `entrepriseId` IS NULL;

-- Rendre les colonnes obligatoires
ALTER TABLE `parametres`
MODIFY COLUMN `entrepriseId` INTEGER NOT NULL;

ALTER TABLE `produit`
MODIFY COLUMN `entrepriseId` INTEGER NOT NULL;

-- Une entreprise ne peut avoir qu'un seul paramètre
CREATE UNIQUE INDEX `Parametres_entrepriseId_key`
ON `Parametres`(`entrepriseId`);

-- Relations avec Entreprise
ALTER TABLE `Produit`
ADD CONSTRAINT `Produit_entrepriseId_fkey`
FOREIGN KEY (`entrepriseId`)
REFERENCES `Entreprise`(`id`)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE `Parametres`
ADD CONSTRAINT `Parametres_entrepriseId_fkey`
FOREIGN KEY (`entrepriseId`)
REFERENCES `Entreprise`(`id`)
ON DELETE CASCADE
ON UPDATE CASCADE;