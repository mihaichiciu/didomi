/*
  Warnings:

  - You are about to drop the `ConsentChange` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `consents` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ConsentChange" DROP CONSTRAINT "ConsentChange_eventId_fkey";

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "consents" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "consents" JSONB NOT NULL DEFAULT '[]';

-- DropTable
DROP TABLE "ConsentChange";
