'use client'
// import { useTranslations} from 'next-intl';
import { useRouter } from 'next/navigation';
import Editor from './Editor';

export default function Order() {
  const router = useRouter();
  return (
    <main style={{minHeight: 'calc(100vh - 260px)'}}>
        <Editor />
    </main>
  );
}