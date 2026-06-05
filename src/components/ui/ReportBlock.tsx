'use client';
import { ConfirmCloseModal } from './ConfirmCloseModal';
import ReportForm from './ReportForm';
import { MdOutlineFlag } from 'react-icons/md';
import { useState } from 'react';
import { useQuery } from '@/src/utils/hooks';
import { IApiResponse } from '@/src/interfaces/common';
import { QUERY_KEYS, REPORT_ENTITY } from '@/src/utils/constants';
import { getPreReport } from '@/src/services/user.api';
import { Alert } from './Alert';
import { QueryProvider } from '../providers/QueryProvider';

interface IReportBlock {
  id: string,
  type: REPORT_ENTITY,
}

const ReportBlockInner = (props: IReportBlock) => {
  const { id, type } = props;

  const [showReport, setShowReport] = useState(false);
  const [alertShow, setAlertShow] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [alertFailed, setAlertFailed] = useState<boolean>(false);

  // QUERY
  const getPreReportQuery = useQuery<IApiResponse<boolean>>(
    [QUERY_KEYS.GET_PRE_REPORT],
    () => getPreReport({ id: id, entity: type }),
    {
      onSuccess: (res) => {
        const data = res.data.data;
        if (data) {
          setShowReport(true);
        } else {
          setAlertShow(true);
          setAlertFailed(true);
          setAlertMessage('Bạn không thể report nội dung này.');
        }
      },
      refetchOnWindowFocus: false,
      enabled: false,
    }
  );

  return (
    <>
      <ConfirmCloseModal
        open={showReport}
        onClose={() => setShowReport(false)}
        contentStyle={{ width: '90vw', maxWidth: '440px', borderRadius: '16px' }}
      >
        <ReportForm
          id={id}
          type={type}
          handleClose={() => setShowReport(false)} />
      </ConfirmCloseModal>

      <button
        className="flex items-center gap-1.5 text-sm font-medium text-red-500 border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-full transition-colors"
        onClick={() => getPreReportQuery.refetch()}
      >
        <MdOutlineFlag size={16} />
        Báo cáo
      </button>

      <Alert
        message={alertMessage}
        show={alertShow}
        setShow={setAlertShow}
        failed={alertFailed} />
    </>
  );
};

export const ReportBlock = QueryProvider(ReportBlockInner);