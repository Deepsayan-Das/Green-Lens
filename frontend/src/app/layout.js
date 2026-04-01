// app/layout.js
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';

export const metadata = {
  title: 'GreenLens',
  description: 'Track Your Carbon Footprint with GreenLens',
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
