import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const main = async () => {
  /* Comum */
  const currentCommonPassword = await prisma.currentCommonPassword.upsert({
    where: { id: 1 },
    create: {
      password: 0, message: ""
    },
    update: {}
  });
  const totalCommonPasswords = await prisma.sessionCommonTotal.upsert({
    where: { id: 1 },
    create: {
      quantity: 0, updatedAt: null, closedAt: null
    },
    update: {}
  });

  /* Prioridade */
  const currentPriorityPassword = await prisma.currentPriorityPassword.upsert({
    where: { id: 1 },
    create: {
      password: 0, message: ""
    },
    update: {}
  });
  const totalPriorityPasswords = await prisma.sessionPriorityTotal.upsert({
    where: { id: 1 },
    create: {
      quantity: 0, updatedAt: null, closedAt: null
    },
    update: {}
  });
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect()
    process.exit(1);
  });