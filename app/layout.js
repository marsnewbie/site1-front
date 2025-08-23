import './globals.css';

export const metadata = {
  title: 'Takeaway Ordering',
  description: 'Online ordering system',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}