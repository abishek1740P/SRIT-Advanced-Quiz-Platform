import Header from '../Header';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeProvider';

export default function HeaderExample() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Header />
      </AuthProvider>
    </ThemeProvider>
  );
}
