import { STATIC_URLS } from '@/src/utils/constants';
import Image from 'next/image';


interface INoResultBackground {
  show?: boolean;
  className?: string;
}

export const NoResultBackground = (props: INoResultBackground) => {
  const { show = true, className = '' } = props;

  return show ? (
    <div className={`flex justify-center ${className}`}>
      <Image
        src={STATIC_URLS.NO_RESULT}
        alt={'noresult'}
        height={300}
        width={300}
      />
    </div>
  ) : (
    <></>
  );
};
