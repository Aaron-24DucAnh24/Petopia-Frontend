'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IBlogAd } from '@/src/interfaces/blog';
import { IApiResponse } from '@/src/interfaces/common';
import { getBlogAd } from '@/src/services/blog.api';
import { QUERY_KEYS } from '@/src/utils/constants';
import { useQuery } from '@/src/utils/hooks';
import { QueryProvider } from '../providers/QueryProvider';
import { ValueTextManager } from '@/src/utils/ValueTextManager';
import { FaStar } from 'react-icons/fa';

interface AdvertisedBlogSectionProps {
  variant: 'landing' | 'search' | 'blog';
}

const AdBlogCard = ({ ad }: { ad: IBlogAd }) => (
  <Link href={`/blog/${ad.id}`} className="block">
    <div className="rounded-xl overflow-hidden bg-white border border-yellow-300 shadow-sm hover:shadow-md transition-shadow flex gap-2.5 h-20">
      <div className="relative w-20 h-20 flex-shrink-0">
        <Image
          src={ad.image}
          alt={ad.title}
          fill
          sizes="80px"
          className="object-cover"
        />
      </div>
      <div className="py-1.5 pr-2 flex flex-col justify-center min-w-0">
        <span className="text-[10px] font-bold uppercase text-amber-600 mb-0.5">
          {ValueTextManager.BlogCategory.GetText(ad.category.toString())}
        </span>
        <h3 className="text-xs font-semibold text-gray-900 line-clamp-1 leading-tight">
          {ad.title}
        </h3>
        <p className="text-[10px] text-gray-400 line-clamp-1 mt-0.5 leading-tight">
          {ad.excerpt}
        </p>
      </div>
    </div>
  </Link>
);

export const AdvertisedBlogSection = QueryProvider(
  ({ variant }: AdvertisedBlogSectionProps) => {
    const { data } = useQuery<IApiResponse<IBlogAd[]>>(
      [QUERY_KEYS.GET_BLOG_AD],
      getBlogAd,
      { staleTime: 5 * 60 * 1000, refetchOnWindowFocus: false }
    );

    const ads = data?.data.data ?? [];
    const count = variant === 'landing' ? 1 : 3;

    const [index, setIndex] = useState(0);
    const [visible, setVisible] = useState(true);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isRotatingRef = useRef(false);

    const rotate = useCallback(() => {
      if (ads.length <= count) return;
      if (isRotatingRef.current) return;
      isRotatingRef.current = true;
      setVisible(false);
    }, [ads.length, count]);

    const handleTransitionEnd = useCallback(() => {
      if (!visible) {
        setIndex((prev) => (prev + 1) % ads.length);
        setVisible(true);
        isRotatingRef.current = false;
      }
    }, [visible, ads.length]);

    useEffect(() => {
      if (ads.length <= count) return;
      const timer = setInterval(rotate, 5000);

      const handleVisibilityChange = () => {
        if (document.hidden) {
          clearInterval(timer);
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);

      return () => {
        clearInterval(timer);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }, [rotate, ads.length, count]);

    if (ads.length === 0) return <></>;

    const visibleAds: IBlogAd[] = [];
    for (let i = 0; i < Math.min(count, ads.length); i++) {
      visibleAds.push(ads[(index + i) % ads.length]);
    }

    return (
      <div className="bg-amber-50/50 border border-amber-200/50 rounded-xl p-3">
        <div className="flex items-center gap-1.5 mb-2">
          <FaStar className="text-amber-400" size={12} />
          <span className="text-xs font-semibold text-amber-700">
            Bài viết nổi bật
          </span>
        </div>

        <div
          onTransitionEnd={handleTransitionEnd}
          className={`transition-all duration-300 ${visible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-1'
            }`}
        >
          {variant === 'landing' ? (
            <AdBlogCard ad={visibleAds[0]} />
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {visibleAds.map((ad) => (
                <AdBlogCard key={ad.id} ad={ad} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
);
