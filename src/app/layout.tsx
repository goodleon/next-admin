import {ReactNode} from 'react';
import { TabProvider } from '@/contexts/TabContext';

type Props = {
  children: ReactNode;
};

export default function RootLayout({children}: Props) {
  return (
    <TabProvider>
      {children}
    </TabProvider>
  );
}