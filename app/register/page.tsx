"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useI18n } from "@/contexts/I18nContext";

const Register = () => {
    const { register, loading } = useUser();
    const navigate = useRouter();
    const { t } = useI18n();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            await register(name, email, password);
            navigate.push("/shop"); // redirect after registration
        } catch (err: any) {
            setError(err.message || "Registration failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="w-full max-w-md p-8 bg-card rounded-xl border border-border">
                <h1 className="text-2xl font-bold mb-6 text-center">{t('register.title')}</h1>
                {error && <p className="text-destructive mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1 font-medium">{t('register.name')}</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full border border-border rounded-lg px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">{t('register.email')}</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full border border-border rounded-lg px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">{t('register.password')}</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full border border-border rounded-lg px-3 py-2"
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? t('register.registering') : t('register.register')}
                    </Button>
                </form>

                <p className="text-sm text-muted-foreground mt-4 text-center">
                    {t('register.alreadyHave')}{" "}
                    <Link href="/login" className="text-primary font-medium">
                        {t('register.login')}
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
