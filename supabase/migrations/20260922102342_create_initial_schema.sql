-- UserRole enum
DO $$ BEGIN
  CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- TransactionStatus enum
DO $$ BEGIN
  CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- PackageDuration enum
DO $$ BEGIN
  CREATE TYPE "PackageDuration" AS ENUM ('MONTH1', 'MONTH3', 'MONTH6');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- GameType enum
DO $$ BEGIN
  CREATE TYPE "GameType" AS ENUM ('WHEEL', 'QUIZ', 'SENTENCE_SCRAMBLE', 'WORD_MATCH', 'WORD_SQUARE');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Users table
CREATE TABLE IF NOT EXISTS "User" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "last_name" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "token" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "role" "UserRole" NOT NULL DEFAULT 'USER',
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "User_phone_key" ON "User"("phone");
CREATE UNIQUE INDEX IF NOT EXISTS "User_token_key" ON "User"("token");

-- Package table
CREATE TABLE IF NOT EXISTS "Package" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL DEFAULT '',
  "price1m" INTEGER NOT NULL DEFAULT 0,
  "price3m" INTEGER NOT NULL DEFAULT 0,
  "price6m" INTEGER NOT NULL DEFAULT 0,
  "options" TEXT[] NOT NULL DEFAULT '{}',
  CONSTRAINT "Package_pkey" PRIMARY KEY ("id")
);

-- UserPackage table
CREATE TABLE IF NOT EXISTS "UserPackage" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "packageId" TEXT NOT NULL,
  "duration" "PackageDuration" NOT NULL DEFAULT 'MONTH1',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "UserPackage_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "UserPackage_userId_key" ON "UserPackage"("userId");

-- Transaction table
CREATE TABLE IF NOT EXISTS "Transaction" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "packageId" TEXT NOT NULL,
  "amount" INTEGER NOT NULL,
  "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
  "refId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- GameData table
CREATE TABLE IF NOT EXISTS "GameData" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "gameType" "GameType" NOT NULL,
  "data" JSONB NOT NULL DEFAULT '{}',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "GameData_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "GameData_userId_gameType_key" ON "GameData"("userId", "gameType");

-- Foreign keys (drop if exist first, then create)
DO $$
BEGIN
  BEGIN ALTER TABLE "UserPackage" DROP CONSTRAINT "UserPackage_userId_fkey"; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER TABLE "UserPackage" DROP CONSTRAINT "UserPackage_packageId_fkey"; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_userId_fkey"; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_packageId_fkey"; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER TABLE "GameData" DROP CONSTRAINT "GameData_userId_fkey"; EXCEPTION WHEN OTHERS THEN NULL; END;
END $$;

ALTER TABLE "UserPackage" ADD CONSTRAINT "UserPackage_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "UserPackage" ADD CONSTRAINT "UserPackage_packageId_fkey"
  FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_packageId_fkey"
  FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "GameData" ADD CONSTRAINT "GameData_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Seed packages
INSERT INTO "Package" ("id", "title", "description", "price1m", "price3m", "price6m", "options")
VALUES (
  'pkg-creative-teacher',
  'معلم خلاق',
  'ویژه معلمان پرانرژی که دوست دارند محتوای شخصی‌سازی‌شده بسازند',
  200000,
  400000,
  800000,
  ARRAY['تایمر', 'تاس', 'گردونه', 'مرتب کردن جملات', 'بازی مربع کلمات', 'وصل کردن کلمات مرتبط', 'کوییز']
) ON CONFLICT ("id") DO UPDATE SET
  "title" = EXCLUDED."title",
  "description" = EXCLUDED."description",
  "price1m" = EXCLUDED."price1m",
  "price3m" = EXCLUDED."price3m",
  "price6m" = EXCLUDED."price6m",
  "options" = EXCLUDED."options";

INSERT INTO "Package" ("id", "title", "description", "price1m", "price3m", "price6m", "options")
VALUES (
  'pkg-dynamic-class',
  'کلاس پویا',
  'ابزارهای ضروری برای ایجاد پویایی در هر کلاس درسی (بدون ابزارهای تخصصی زبانی)',
  150000,
  300000,
  600000,
  ARRAY['تایمر', 'تاس', 'گردونه', 'کوییز']
) ON CONFLICT ("id") DO UPDATE SET
  "title" = EXCLUDED."title",
  "description" = EXCLUDED."description",
  "price1m" = EXCLUDED."price1m",
  "price3m" = EXCLUDED."price3m",
  "price6m" = EXCLUDED."price6m",
  "options" = EXCLUDED."options";

-- Enable RLS on all tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Package" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "UserPackage" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Transaction" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "GameData" ENABLE ROW LEVEL SECURITY;
