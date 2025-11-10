import Link from "next/link";

export default function HomePage() {
  return (
    <main className="p-6">
      <h1>Welcome to the Coaching Management System</h1>
      <p>Manage your coaching sessions, clients, and schedules efficiently.</p>

      <Link
        href="/signup"
        className="inline-block mt-4 text-blue-600 hover:underline"
      >
        Go to Signup
      </Link><br/>
      <Link
        href="/login"
        className="inline-block mt-4 text-blue-600 hover:underline"
      >
        Go to Login
      </Link>
    </main>
  );
}
