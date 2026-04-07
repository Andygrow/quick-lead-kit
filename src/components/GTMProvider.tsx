import { useGTM } from '@/hooks/useGTM';

interface GTMProviderProps {
  children: React.ReactNode;
}

const GTMProvider = ({ children }: GTMProviderProps) => {
  // Initialize GTM on app load
  useGTM();
  
  return <>{children}</>;
};

export default GTMProvider;
