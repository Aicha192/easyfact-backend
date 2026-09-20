ALTER TABLE `User`
ADD COLUMN `resetPasswordToken` VARCHAR(191) NULL,
ADD COLUMN `resetPasswordExpires` DATETIME(3) NULL;
