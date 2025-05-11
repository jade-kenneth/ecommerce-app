'use client';
import { useParams } from 'next/navigation';
import ManageProducts from '../page';

export default function Page() {
  const params = useParams();
  const { slug } = params;

  switch (slug) {
    case 'manage-products':
      return <ManageProducts />;

    default:
      return <p>HMMMM what are you looking for?</p>;
  }
}
