// middleware.js
import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl.clone();

  // Redirect root URL ("/") to "/login"
  if (url.pathname === "/") {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Allow all other routes to continue normally
  return NextResponse.next();
}

// Apply middleware only on root route
export const config = {
  matcher: ["/"],
};
