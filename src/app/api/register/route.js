import { connectDB } from "@/db/database";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(request) {
  await connectDB();

  try {
    const formData = await request.formData();

    const firstName = formData.get("firstName").trim();
    const lastName = formData.get("lastName").trim();
    const email = formData.get("email").trim();
    const birthdate = formData.get("birthdate").trim();
    const phone = formData.get("phone").trim();
    const password = formData.get("password").trim();
    const profilePicture = formData.get("profilePicture");

    const hashPassword = await bcrypt.hash(password, 10);

    const existingUser = await User.find({ email });
    if (existingUser.length > 0) {
      return new Response(JSON.stringify({ error: "User already exists" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const user = new User({
      firstName,
      lastName,
      email,
      birthdate,
      phone,
      password: hashPassword,
    });

    await user.save();

    if (profilePicture && profilePicture.size > 0) {
      const bytes = await profilePicture.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const fileExtension = profilePicture.name.split(".").pop();
      const fileName = `${user._id}.${fileExtension}`;

      const uploadPath = path.join(
        process.cwd(),
        "public",
        "uploads",
        fileName
      );
      await writeFile(uploadPath, buffer);

      user.profilePicture = fileName;
      await user.save();
    }

    return new Response(
      JSON.stringify({ message: "User registered successfully" }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return new Response(JSON.stringify({ error: "Registration failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
