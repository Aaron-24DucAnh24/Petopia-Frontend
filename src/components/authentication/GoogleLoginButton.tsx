'use client';
import Image from 'next/image';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { STATIC_URLS } from '@/src/utils/constants';

interface Props {
  clientId: string;
  onSuccess: (tokenId: string) => void;
}

function Inner({ onSuccess }: { onSuccess: (tokenId: string) => void }) {
  const login = useGoogleLogin({
    onSuccess: (res) => onSuccess(res.access_token),
  });

  return (
    <div
      className="w-full cursor-pointer content-end py-2 border flex border-slate-200 rounded-lg text-slate-700 hover:border-slate-400 hover:text-slate-900 hover:shadow transition duration-150"
      onClick={() => login()}>
      <div className="flex gap-2 mx-auto">
        <Image
          width={24}
          height={24}
          src={STATIC_URLS.GOOGLE_LOGIN}
          loading="lazy"
          alt="google logo" />
        <span>Đăng nhập với Google</span>
      </div>
    </div>
  );
}

export function GoogleLoginButton({ clientId, onSuccess }: Props) {
  if (!clientId) return null;
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Inner onSuccess={onSuccess} />
    </GoogleOAuthProvider>
  );
}
