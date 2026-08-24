"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push("/admin/dashboard");
      router.refresh(); // Refresh to trigger middleware re-eval
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-blue">
      <div className="w-full max-w-md p-8 bg-white/5 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-sm">
        <h1 className="text-4xl font-heading text-brand-text text-center mb-8 tracking-widest">ADMIN LOGIN</h1>
        
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-200 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-brand-light-blue font-heading tracking-widest mb-2 text-sm">EMAIL</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white/10 border border-white/20 rounded-xl h-12 px-4 text-white focus:outline-none focus:border-brand-light-blue"
            />
          </div>
          <div>
            <label className="block text-brand-light-blue font-heading tracking-widest mb-2 text-sm">PASSWORD</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-white/10 border border-white/20 rounded-xl h-12 px-4 text-white focus:outline-none focus:border-brand-light-blue"
            />
          </div>
          <button type="submit" className="w-full bg-brand-light-blue text-brand-blue font-bold tracking-widest h-12 rounded-xl hover:bg-white transition-colors">
            SIGN IN
          </button>
        </form>
      </div>
    </div>
  );
}
