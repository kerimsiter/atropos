"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, Headphones, Plus, Quote } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/api";

// Zod validasyon şeması
const loginSchema = z.object({
  tenantId: z
    .string()
    .min(3, "İşletme kodu en az 3 karakter olmalıdır.")
    .regex(/^[a-z0-9-]+$/, "Sadece küçük harf, rakam ve tire içerebilir."),
  email: z.string().email("Lütfen geçerli bir e-posta adresi giriniz."),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır."),
  rememberMe: z.boolean().optional(),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    setServerError(null);
    try {
      const response = await loginUser({
        tenantId: data.tenantId,
        email: data.email,
        password: data.password,
      });
      console.log("Giriş başarılı:", response);
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Giriş hatası:", err);
      setServerError(err?.message || "Giriş başarısız. Lütfen bilgilerinizi kontrol edin.");
    }
  };

  return (
    <main className="grid min-h-screen grid-cols-1 bg-white lg:grid-cols-2">
      {/* Sol: Marka & Görsel */}
      <div
        className="relative hidden flex-col justify-between p-8 text-white lg:flex"
        style={{
          backgroundImage: "url(/login-bg.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10">
          <Image src="/logo.svg" alt="Atropos Logo" width={140} height={40} />
        </div>

        <div className="relative z-10">
          <Quote className="h-12 w-12 text-green-400" fill="currentColor" />
          <p className="mt-4 text-xl italic">
            "İşletmenizin ihtiyaç duyduğu her şeyi, herkesin kolaylıkla
            anlayabileceği basit bir tasarımda sunuyoruz."
          </p>
          <div className="mt-6 flex items-center gap-4">
            <Image
              src="https://api.dicebear.com/8.x/initials/svg?seed=Osmanbey"
              alt="Osmanbey"
              width={48}
              height={48}
              className="rounded-full"
            />
            <div>
              <p className="font-semibold">Osmanbey</p>
              <p className="text-sm text-gray-300">Masis Erekli</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sağ: Login Formu */}
      <div className="flex flex-col justify-center px-8 py-12 sm:px-12 lg:px-16">
        <div className="flex w-full justify-end">
          <Link
            href="/destek"
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
          >
            <Headphones className="h-4 w-4" />
            Destek İste
          </Link>
        </div>

        <div className="mx-auto w-full max-w-md">
          <div className="mt-8 sm:mt-16">
            <h1 className="text-[32px] leading-[40px] tracking-[-0.32px] font-bold text-[#141414]">
              Atropos'a Hoşgeldiniz
            </h1>
            <p className="mt-2 text-[14px] text-[#757575]">
              Lütfen üyelik bilgileriniz ile giriş yapınız
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
            {serverError && (
              <div className="rounded-md border border-red-400 bg-red-50 p-4 text-sm text-red-700">
                {serverError}
              </div>
            )}
            {/* Multi-tenant için kritik alan */}
            <div>
              <label htmlFor="tenantId" className="block text-[14px] font-medium text-[#141414]">
                İşletme Kodu
              </label>
              <div className="mt-1">
                <input
                  id="tenantId"
                  type="text"
                  autoComplete="organization"
                  placeholder="ornek-isletme"
                  className={`w-full rounded-[12px] border bg-white px-5 py-4 text-[#141414] placeholder-[#A3A3A3] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#289E56] ${
                    errors.tenantId ? "border-red-500 focus:border-red-500" : "border-[#E5E5E5] focus:border-[#289E56]"
                  }`}
                  {...register("tenantId")}
                />
                {errors.tenantId && (
                  <p className="mt-1 text-xs text-red-600">{errors.tenantId.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-[14px] font-medium text-[#141414]">
                E-Posta Adresi veya Telefon Numarası
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="ornek@email.com"
                  className={`w-full rounded-[12px] border bg-white px-5 py-4 text-[#141414] placeholder-[#A3A3A3] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#289E56] ${
                    errors.email ? "border-red-500 focus:border-red-500" : "border-[#E5E5E5] focus:border-[#289E56]"
                  }`}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-[14px] font-medium text-[#141414]">
                Şifre
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className={`w-full rounded-[12px] border bg-white px-5 py-4 text-[#141414] placeholder-[#A3A3A3] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#289E56] ${
                    errors.password ? "border-red-500 focus:border-red-500" : "border-[#E5E5E5] focus:border-[#289E56]"
                  }`}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-5 w-5 rounded-[6px] border-2 border-[#A3A3A3] bg-white accent-[#289E56] shadow-sm focus:outline-none focus:ring-0 checked:border-[#289E56]"
                  {...register("rememberMe")}
                />
                <label htmlFor="remember-me" className="ml-2 block text-[14px] text-[#141414]">
                  Beni Hatırla
                </label>
              </div>

              <div className="text-sm">
                <Link href="/sifremi-unuttum" className="font-medium text-[#289E56] hover:opacity-90">
                  Şifremi Unuttum
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full justify-center rounded-[12px] border border-transparent px-8 py-4 text-[18px] font-medium text-white shadow-sm hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[#2E9055] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
                style={{ backgroundImage: "linear-gradient(180deg, #35C56E 0%, #2E9055 100%)" }}
              >
                {isSubmitting ? "Giriş Yapılıyor..." : "Giriş Yap"}
              </button>
            </div>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-[#E5E5E5]" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">Veya</span>
            </div>
          </div>

          <div>
            <Link
              href="/register"
              className="flex w-full items-center justify-center gap-2 rounded-[12px] border border-[#E5E5E5] bg-white px-8 py-4 text-[16px] font-medium text-[#282828] shadow-sm hover:bg-gray-50 focus:outline-none"
            >
              <Plus className="h-5 w-5" />
              Üye Değil Misiniz? <strong>Şimdi Kaydolun</strong>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
