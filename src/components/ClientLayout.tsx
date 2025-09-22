'use client';
import { usePathname } from 'next/navigation';
import Layout from './Layout';

interface Props {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: Props) {
  const pathname = usePathname();
  
  return (
    <Layout curActive={pathname}>
      {children}
    </Layout>
  );
}
