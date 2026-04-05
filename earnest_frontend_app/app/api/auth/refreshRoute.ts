import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Call your backend OR verify here
  // Example:
  const newAccessToken = "NEW_ACCESS_TOKEN"; // generate JWT

  return NextResponse.json({ accessToken: newAccessToken });
}