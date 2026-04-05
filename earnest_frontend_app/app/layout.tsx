import "./globals.css";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
        <body className="bg-gray-100" >
        {children}

        {/*Toast container (GLOBAL) */}
        <Toaster position="top-right" reverseOrder={false} />
        </body>
    </html>
  );
}