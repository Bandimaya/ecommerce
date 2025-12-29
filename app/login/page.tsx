"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

/**
 * Updated Login component:
 * - Password visibility toggle
 * - Inline validation animation when error occurs
 * - Success transition into /shop
 */
const Login = () => {
  const { login, loading } = useUser();
  const router = useRouter();
  const { t } = useI18n();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  // password visibility state
  const [showPwd, setShowPwd] = useState(false);

  // for playing success animation before navigation
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await login(email, password);
      // Trigger success animation
      setSuccess(true);
      // After a short delay (match animation), navigate
      setTimeout(() => {
        router.push("/shop");
      }, 360); // ~ matching animation duration
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  };

  // Animation variants
  const cardVariants: Variants = {
    initial: { opacity: 0, y: 24 },
    enter: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 24 } },
    exitSuccess: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
  };

  const shakeVariants = {
    idle: {},
    shake: {
      x: [0, -6, 6, -4, 4, 0],
      transition: { duration: 0.4 },
    },
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "var(--background)" }}
    >
      <AnimatePresence mode="wait">
        {!success && (
          <motion.div
            key="login-card"
            variants={cardVariants}
            initial="initial"
            animate="enter"
            exit="exitSuccess"
            className="w-full max-w-md p-8 rounded-xl border"
            style={{
              background: "var(--card)",
              borderColor: "var(--border)",
            }}
          >
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-2xl font-bold mb-6 text-center"
            >
              {t('login.title')}
            </motion.h1>

            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.p
                  key="error-msg"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="mb-4 text-sm text-center"
                  style={{ color: "var(--destructive)" }}
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Form */}
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-4"
              // shake form when error occurs
              variants={shakeVariants}
              animate={error ? "shake" : "idle"}
            >
              {/* Email */}
              <div className="space-y-1">
                <label className="text-sm font-medium">{t('login.email')}</label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                    style={{ color: "var(--muted-foreground)" }}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder={t('login.placeholderEmail')}
                    className="w-full pl-10 pr-3 py-2 rounded-lg border outline-none transition-all"
                    style={{
                      background: "var(--background)",
                      borderColor: "var(--border)",
                    }}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor = "var(--primary)")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor = "var(--border)")
                    }
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-sm font-medium">{t('login.password')}</label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                    style={{ color: "var(--muted-foreground)" }}
                  />
                  <input
                    type={showPwd ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2 rounded-lg border outline-none transition-all"
                    style={{
                      background: "var(--background)",
                      borderColor: "var(--border)",
                    }}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor = "var(--primary)")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor = "var(--border)")
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <motion.div whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2"
                  style={{
                    background: "var(--primary)",
                    color: "var(--primary-foreground)",
                  }}
                >
                  {loading ? t('login.submitting') : t('login.submit')}
                </Button>
              </motion.div>
            </motion.form>

            <p
              className="text-sm mt-5 text-center"
              style={{ color: "var(--muted-foreground)" }}
            >
              {t('login.noAccount')}{" "}
              <Link
                href="/register"
                className="font-medium"
                style={{ color: "var(--primary)" }}
              >
                {t('login.register')}
              </Link>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;
