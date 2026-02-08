"use client";

import { signIn } from "next-auth/react";

export default function SignInPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold">Clawdi Dashboard</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Sign in with Google. Access is restricted.
        </p>
        <button
          className="mt-6 w-full rounded-lg bg-black px-4 py-2 text-white hover:bg-neutral-800"
          onClick={() => signIn("google", { callbackUrl: "/" })}
        >
          Sign in with Google
        </button>
      </div>
    </main>
  );
}
