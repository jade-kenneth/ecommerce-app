'use client';
import { useSession } from '@portal/auth';
import { ColorModeButton } from '@portal/theme';

export default function Index() {
  const data = useSession();
  console.log(data, 'data');
  return (
    <div>
      HELLO apps
      <ColorModeButton />
    </div>
  );
}
