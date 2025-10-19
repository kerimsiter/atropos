// frontend/src/app/(auth)/layout.tsx

// Bu layout, (auth) grubundaki sayfaların (login, register vb.)
// ana uygulamanın sidebar veya header gibi bileşenlerinden
// bağımsız, temiz bir sayfada render edilmesini sağlar.
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
