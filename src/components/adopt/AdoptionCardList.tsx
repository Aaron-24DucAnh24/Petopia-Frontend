import { IAdoptCardResponse } from '@/src/interfaces/adopt';
import { IApiResponse } from '@/src/interfaces/common';
import { getAdoptCard } from '@/src/services/adopt.api';
import { QUERY_KEYS } from '@/src/utils/constants';
import { useQuery } from '@/src/utils/hooks';
import { Dispatch, SetStateAction, useState } from 'react';
import { AdoptionCard } from './AdoptionCard';

interface IAdoptionCardList {
  type: string;
  notifyCount?: Dispatch<SetStateAction<number>>;
  filter?: string;
}

export default function AdoptionCardList(props: IAdoptionCardList) {
  const { type, notifyCount, filter } = props;

  // States
  const [adoptCard, setAdoptCard] = useState<IAdoptCardResponse[]>([]);

  // Handlers
  const handleIsSeen = () => {
    getAdoptCardQuery.refetch();
  };

  // Queries
  const getAdoptCardQuery = useQuery<IApiResponse<IAdoptCardResponse[]>>(
    [QUERY_KEYS.GET_ADOPT_CARD, filter],
    () => getAdoptCard(type),
    {
      onSuccess: (res) => {
        if (filter === 'Accepted') {
          res.data.data = res.data.data.filter((card) => card.status === 1);
        }
        if (filter === 'Waiting') {
          res.data.data = res.data.data.filter((card) => card.status === 0);
        }
        if (filter === 'Rejected') {
          res.data.data = res.data.data.filter((card) => card.status === 2);
        }
        setAdoptCard(res.data.data);
        if (type == 'Incoming') {
          notifyCount &&
            notifyCount(res.data.data.filter((card) => !card.isSeen).length);
        }
      },
      refetchOnWindowFocus: false,
    }
  );

  return (
    <div>
      <div>
        {
          getAdoptCardQuery.isLoading && <div>Loading...</div>
        }
        {
          !getAdoptCardQuery.isLoading
          && adoptCard.length > 0
          && <div className="flex flex-col gap-2">
            {
              adoptCard.map((card) => <AdoptionCard
                key={card.id}
                card={card}
                refetch={handleIsSeen}
                type={type} />
              )
            }
          </div>
        }
      </div>
    </div>
  );
}
