import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

async function main() {
  const user1 = await prisma.user.create({
    data: {
      username: "vivpupu",
      password: await bcrypt.hash("puamomo", 10),
    },
  });

  const user2 = await prisma.user.create({
    data: {
      username: "kangritel",
      password: await bcrypt.hash("r1d3r0ck@3uL.", 10),
    },
  });

  console.log({ user1, user2 });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
