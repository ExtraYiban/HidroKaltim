/* eslint-disable @typescript-eslint/no-explicit-any */

interface Prismalike {
  $transaction: (ops: any[]) => Promise<any>;
  user: {
    count: (args?: any) => Promise<number>;
    findUnique: (args: any) => Promise<any>;
    findMany: (args?: any) => Promise<any[]>;
    create: (args: any) => Promise<any>;
    update: (args: any) => Promise<any>;
    delete: (args: any) => Promise<any>;
  };
  session: {
    deleteMany: (args: any) => Promise<any>;
  };
}

const globalForPrisma = globalThis as unknown as { prisma: Prismalike | undefined };

const mockPrisma: Prismalike = {
  $transaction: async (ops: any[]) => ops,
  user: {
    count: async () => 0,
    findUnique: async () => null,
    findMany: async () => [],
    create: async () => null,
    update: async () => null,
    delete: async () => null,
  },
  session: {
    deleteMany: async () => null,
  },
};

export const prisma: Prismalike = globalForPrisma.prisma ?? mockPrisma;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

