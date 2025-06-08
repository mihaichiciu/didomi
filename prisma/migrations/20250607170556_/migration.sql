/*
  Warnings:

  - You are about to drop the column `consents` on the `Event` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ConsentType" AS ENUM ('email_notifications', 'sms_notifications');

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "consents";

-- CreateTable
CREATE TABLE "ConsentChange" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "consentId" "ConsentType" NOT NULL,
    "enabled" BOOLEAN NOT NULL,

    CONSTRAINT "ConsentChange_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ConsentChange" ADD CONSTRAINT "ConsentChange_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
