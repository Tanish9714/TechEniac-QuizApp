import { connectDB } from "@/db/database";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "secret_key";

export async function POST(request) {
  await connectDB();
  const { email, password } = await request.json();

  const user = await User.findOne({ email });
  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return new Response(JSON.stringify({ error: "Invalid password" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, {
    expiresIn: "1h",
  });

  const profilePicturePath = user.profilePicture
    ? `/uploads/${user.profilePicture}`
    : `/uploads/${user._id}.png`;

  return new Response(
    JSON.stringify({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profilePicture: profilePicturePath,
      },
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
