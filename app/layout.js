import './globals.css';
import { AuthProvider } from './contexts/AuthContext';

export const metadata = {
  title: 'China Palace Takeaway Crowland | Chinese Food in Peterborough',
  description: 'Online ordering system for authentic Chinese cuisine',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}