import { NextResponse } from "next/server";
import { getAuth } from "firebase/auth";
import { auth } from "./app/firebaseConfig";

export async function middleware(req) {
  const url = req.nextUrl.clone();
  const user = auth.currentUser;

  // 🔒 If user is not logged in and trying to access protected route
  if (!user && url.pathname.startsWith("/dashboard")) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // 🚫 If user is logged in, prevent access to /login or /signup
  if (user && (url.pathname === "/login" || url.pathname === "/signup")) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Define which routes this applies to
export const config = {
  matcher: ["/dashboard", "/login", "/signup"],
};
