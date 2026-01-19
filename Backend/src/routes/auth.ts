import { Router, Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../db";

const router = Router();

const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    jwt.verify(token, process.env.JWT_SECRET!);
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

/*
=================================
 LOGIN USING EMAIL & PASSWORD
=================================
*/
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("LOGIN ATTEMPT:", email);

    // 1️⃣ Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    console.log("USER FOUND:", user);

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 2️⃣ Compare password
    console.log("HASH IN DB:", user.password);

    const isPasswordValid = await bcrypt.compare(password, user.password);

    console.log("PASSWORD MATCH:", isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 3️⃣ Create token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ message: "Login failed" });
  }
});
router.get("/go-to-hrm", auth, async (req, res) => {
  const tenantCode = req.query.tenantCode;

  if (!tenantCode) {
    return res.status(400).json({ error: "Tenant code missing" });
  }

  // Dummy HRM URL (can be anything)
  return res.json({
    redirectUrl: "https://example.com",
  });
});


export default router;
