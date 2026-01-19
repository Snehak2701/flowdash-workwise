import bcrypt from "bcrypt";
import prisma from "../db";

async function main() {
  const email = "sneha@gmail.com";
  const plainPassword = "Sneha@2701";

  // hash password
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: "MANAGER",
    },
  });

  console.log("✅ User created:", user);
}

main()
  .catch((e) => {
    console.error("❌ Error creating user:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
