// frontend/src/app/(auth)/register/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Eye, EyeOff, Headphones, Quote, ArrowLeft } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/api";

// Zod validasyon şeması (Kayıt için)
const registerSchema = z
  .object({
    tenantName: z.string().min(2, "İşletme adı en az 2 karakter olmalıdır."),
    tenantId: z
      .string()
      .min(3, "İşletme kodu en az 3 karakter olmalıdır.")
      .regex(/^[a-z0-9-]+$/, "Sadece küçük harf, rakam ve tire içerebilir."),
    adminName: z.string().min(2, "Ad soyad en az 2 karakter olmalıdır."),
    adminEmail: z.string().email("Lütfen geçerli bir e-posta adresi giriniz."),
    adminPhone: z.string().optional(),
    adminPassword: z.string().min(6, "Şifre en az 6 karakter olmalıdır."),
    confirmPassword: z.string().min(6, "Şifre tekrarı en az 6 karakter olmalıdır."),
  })
  .refine((data) => data.adminPassword === data.confirmPassword, {
    message: "Şifreler eşleşmiyor.",
    path: ["confirmPassword"],
  });

type RegisterFormInputs = z.infer<typeof registerSchema>;

function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [tenantIdTouched, setTenantIdTouched] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
  });

  const tenantName = watch("tenantName");

  useEffect(() => {
    if (!tenantIdTouched) {
      const next = slugify(tenantName || "");
      setValue("tenantId", next, { shouldValidate: true });
    }
  }, [tenantName, tenantIdTouched, setValue]);

  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    setServerError(null);
    try {
      const response = await registerUser({
        tenantName: data.tenantName,
        tenantId: data.tenantId,
        adminName: data.adminName,
        adminEmail: data.adminEmail,
        adminPhone: data.adminPhone,
        adminPassword: data.adminPassword,
      });
      console.log("Kayıt başarılı:", response);
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Kayıt hatası:", err);
      setServerError(err?.message || "Kayıt başarısız oldu. Lütfen tekrar deneyin.");
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
            "İşletmenizi dijitalde bir sonraki seviyeye taşımak için buradayız. Atropos ile tanışın, yönetimi basitleştirin."
          </p>
          <div className="mt-6 flex items-center gap-4">
            <Image
              src="https://api.dicebear.com/8.x/initials/svg?seed=Atropos"
              alt="Atropos"
              width={48}
              height={48}
              className="rounded-full"
            />
            <div>
              <p className="font-semibold">Atropos Ekibi</p>
              <p className="text-sm text-gray-300">Başarı Partneriniz</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sağ: Kayıt Formu */}
      <div className="flex flex-col justify-center px-8 py-12 sm:px-12 lg:px-16">
        <div className="flex w-full items-center justify-between">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Giriş Yap'a Dön
          </Link>
          <Link
            href="/destek"
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
          >
            <Headphones className="h-4 w-4" />
            Destek İste
          </Link>
        </div>

        <div className="mx-auto w-full max-w-md">
          <div className="mt-8">
            <h1 className="text-[32px] leading-[40px] tracking-[-0.32px] font-bold text-[#141414]">
              Yeni Bir Hesap Oluşturun
            </h1>
            <p className="mt-2 text-[14px] text-[#757575]">
              Atropos'u kullanmaya başlamak için bilgilerinizi girin.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
            {serverError && (
              <div className="rounded-md border border-red-400 bg-red-50 p-4 text-sm text-red-700">
                {serverError}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="tenantName" className="block text-sm font-medium text-gray-700">
                  İşletme Adı
                </label>
                <input
                  id="tenantName"
                  type="text"
                  placeholder="Yıldız Burger"
                  {...register("tenantName")}
                  className={`mt-1 w-full rounded-[12px] border bg-white px-5 py-4 text-[#141414] placeholder-[#A3A3A3] shadow-sm ${
                    errors.tenantName ? "border-red-500" : "border-[#E5E5E5]"
                  }`}
                />
                {errors.tenantName && (
                  <p className="mt-1 text-xs text-red-600">{errors.tenantName.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="tenantId" className="block text-sm font-medium text-gray-700">
                  İşletme Kodu
                </label>
                <input
                  id="tenantId"
                  type="text"
                  placeholder="yildiz-burger"
                  {...register("tenantId")}
                  onFocus={() => setTenantIdTouched(true)}
                  className={`mt-1 w-full rounded-[12px] border bg-white px-5 py-4 text-[#141414] placeholder-[#A3A3A3] shadow-sm ${
                    errors.tenantId ? "border-red-500" : "border-[#E5E5E5]"
                  }`}
                />
                {errors.tenantId && (
                  <p className="mt-1 text-xs text-red-600">{errors.tenantId.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="adminName" className="block text-sm font-medium text-gray-700">
                Ad Soyad
              </label>
              <input
                id="adminName"
                type="text"
                placeholder="Ali Veli"
                {...register("adminName")}
                className={`mt-1 w-full rounded-[12px] border bg-white px-5 py-4 text-[#141414] placeholder-[#A3A3A3] shadow-sm ${
                  errors.adminName ? "border-red-500" : "border-[#E5E5E5]"
                }`}
              />
              {errors.adminName && (
                <p className="mt-1 text-xs text-red-600">{errors.adminName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700">
                E-Posta
              </label>
              <input
                id="adminEmail"
                type="email"
                placeholder="ali.veli@email.com"
                {...register("adminEmail")}
                className={`mt-1 w-full rounded-[12px] border bg-white px-5 py-4 text-[#141414] placeholder-[#A3A3A3] shadow-sm ${
                  errors.adminEmail ? "border-red-500" : "border-[#E5E5E5]"
                }`}
              />
              {errors.adminEmail && (
                <p className="mt-1 text-xs text-red-600">{errors.adminEmail.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="adminPhone" className="block text-sm font-medium text-gray-700">
                Telefon Numarası (Opsiyonel)
              </label>
              <input
                id="adminPhone"
                type="tel"
                placeholder="555 123 4567"
                {...register("adminPhone")}
                className={`mt-1 w-full rounded-[12px] border bg-white px-5 py-4 text-[#141414] placeholder-[#A3A3A3] shadow-sm ${
                  errors.adminPhone ? "border-red-500" : "border-[#E5E5E5]"
                }`}
              />
              {errors.adminPhone && (
                <p className="mt-1 text-xs text-red-600">{errors.adminPhone.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="adminPassword" className="block text-sm font-medium text-gray-700">
                  Şifre
                </label>
                <div className="relative mt-1">
                  <input
                    id="adminPassword"
                    type={showPassword ? "text" : "password"}
                    {...register("adminPassword")}
                    className={`w-full rounded-[12px] border bg-white px-5 pr-12 py-4 text-[#141414] placeholder-[#A3A3A3] shadow-sm ${
                      errors.adminPassword ? "border-red-500" : "border-[#E5E5E5]"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-4 text-[#A3A3A3] hover:text-[#525252]"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.adminPassword && (
                  <p className="mt-1 text-xs text-red-600">{errors.adminPassword.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Şifre Tekrar
                </label>
                <div className="relative mt-1">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("confirmPassword")}
                    className={`w-full rounded-[12px] border bg-white px-5 pr-12 py-4 text-[#141414] placeholder-[#A3A3A3] shadow-sm ${
                      errors.confirmPassword ? "border-red-500" : "border-[#E5E5E5]"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-4 text-[#A3A3A3] hover:text-[#525252]"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full justify-center rounded-[12px] border border-transparent px-8 py-4 text-[18px] font-medium text-white shadow-sm hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-[#2E9055] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
                style={{ backgroundImage: "linear-gradient(180deg, #35C56E 0%, #2E9055 100%)" }}
              >
                {isSubmitting ? "Hesap Oluşturuluyor..." : "Hesabı Oluştur"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
