import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const main = async () => {
  /* Comum */
  const currentCommonPassword = await prisma.currentCommonPassword.create({
    data: { password: 0, message: "" }
  });
  const totalCommonPasswords = await prisma.sessionCommonTotal.create({
    data: { quantity: 0, updatedAt: null, closedAt: null }
  });

  /* Prioridade */
  const currentPriorityPassword = await prisma.currentPriorityPassword.create({
    data: { password: 0, message: "" }
  });
  const totalPriorityPasswords = await prisma.sessionPriorityTotal.create({
    data: { quantity: 0, updatedAt: null, closedAt: null }
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