import { STATIC_URLS } from '@/src/utils/constants';
import Image from 'next/image';

export default function NotFoundPage() {
  return (
    <div className='flex flex-col justify-center items-center space-y-1 h-full'>
      <div className='font-bold'>
        404 - PAGE NOT FOUND
      </div>
      <a className='text-yellow-500 font-bold' href='/'>
        Homepage
      </a>
      <Image
        src={STATIC_URLS.NO_RESULT}
        alt={'noresult'}
        height={600}
        width={600} />
    </div>
  );
};
