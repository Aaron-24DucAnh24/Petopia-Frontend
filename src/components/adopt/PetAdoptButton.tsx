'use client'; // Assuming this is for client-side code

import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import { PetAdoptForm } from './PetAdoptForm';
import { observer } from 'mobx-react-lite';
import { useStores } from '@/src/stores';
import { Alert } from '../common/general/Alert';
import { setCookie } from 'cookies-next';
import { COOKIES_NAME } from '@/src/utils/constants';
import { usePathname } from 'next/navigation';
import { PiPawPrintFill } from 'react-icons/pi';

export const PetAdoptButton = observer(() => {
  // States
  const [open, setOpen] = useState(false);
  const [alertShow, setAlertShow] = useState(false);
  const { userStore } = useStores();
  const pathname = usePathname();

  const checkLoggedIn = () => {
    if (!userStore.userContext) setAlertShow(true);
    else setOpen(true);
  };

  return (
    <div>
      <Alert
        failed
        message="Vui lòng đăng nhập để nhận nuôi"
        show={alertShow}
        title="Đăng nhập"
        setShow={setAlertShow}
        action={() => {
          setCookie(COOKIES_NAME.REDIRECT, pathname);
          window.location.replace('/login');
        }} />
      <button
        test-id="adopt-pet-button"
        className="w-fit flex items-center p-3 px-8 rounded-full font-bold shadow-md bg-yellow-300 hover:bg-yellow-400 my-5"
        onClick={checkLoggedIn}>
        <span className="mr-2">
          <PiPawPrintFill size={30} />
        </span>
        Nhận nuôi
      </button>
      <Popup
        modal
        overlayStyle={{ background: 'rgba(0, 0, 0, 0.5)' }}
        open={open}
        onClose={() => setOpen(false)}
        onOpen={checkLoggedIn}>
        <PetAdoptForm handleClose={() => setOpen(false)} />
      </Popup>
    </div>
  );
});
