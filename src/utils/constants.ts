import { IPetFilter, IPetSelect } from '../interfaces/pet';

export const STATIC_URLS = {
  GIRL_DOG: '/img/girl_dog.webp',
  GOLDEN_RETRIEVER: '/img/pexels-gilberto-reyes.png',
  GOOGLE_LOGIN: 'https://www.svgrepo.com/show/475656/google-color.svg',
  CAT_HERO: '/img/cat_hero.png',
  CAT_INTRO: '/img/cat_intro.png',
  ADOPT: '/img/Adopt.svg',
  RECEIVE: '/img/Receive.svg',
  BLOG: '/img/Blog.svg',
  CAT_AND_DOG: '/img/Cat_and_dog.png',
  CAT_ATRONAULT: '/img/Cat_astronaut.png',
  CAT_VASE: '/img/Cat_throwing_vase.png',
  NO_RESULT: '/img/no-result.png',
  NO_AVATAR: '/img/no-avatar.png',
  BLOG_CREATE_CARD: '/img/BlogCardCreate.jpg',
};

export const COOKIES_NAME = {
  ACCESS_TOKEN_SERVER: 'accessTokenServer',
  REFRESH_TOKEN_SERVER: 'accessTokenServer',
  REDIRECT: 'redirect',
};

export const DOMAIN_ERROR_MESSAGES = {
  '10000': 'Email không đúng.',
  '10001': 'Thông tin đăng nhập không chính xác',
  '10002': 'Email đã sử dụng để đăng ký',
  '10003': 'Link đăng ký đã hết hạn',
  '10004': 'Link khôi phục mật khẩu hết hạn.',
  '10005': 'Google captcha không hợp lệ.',
  '10006': 'Email được sử dụng cho phương thức đăng nhập khác.',
  '10007': 'Mật khẩu mới không được trùng với mật khẩu hiện tại',
  '10008': 'Không tìm thấy người dùng.',
  '10009': 'Mật khẩu không đúng.',
  '12002': 'Không thể nhận nuôi thú cưng của chính bạn.',
  '12003': 'Bạn đã gửi yêu cầu nhận nuôi thú cưng này rồi.',
  '10010': 'Vui lòng nhập địa chỉ.',
};

export const QUERY_KEYS = {
  GET_GOOGLE_RECAPTCHA_TOKEN: 'GET_GOOGLE_RECAPTCHA_TOKEN',
  GET_GOOGLE_AUTH_CLIENT_ID: 'GET_GOOGLE_AUTH_CLIENT_ID',
  GET_PETS: 'GET_PETS',
  GET_LOCATION: 'GET_LOCATION',
  GET_CURRENT_USER: 'GET_CURRENT_USER',
  GET_OTHER_USER: 'GET_OTHER_USER',
  GET_USER_INFO_FOR_ADOPTION: 'GET_USER_INFO_FOR_ADOPTION',
  PRE_CHECK_ADOPTION: 'PRE_CHECK_ADOPTION',
  GET_PET_DETAIL: 'GET_PET_DETAIL',
  GET_ADOPT_CARD: 'GET_ADOPT_CARD',
  GET_ADOPT_FORM_INFO: 'GET_ADOPT_FORM_INFO',
  GET_NOTIFICATION: 'GET_NOTIFICATION',
  GET_NOTIFICATION_COUNT: 'GET_NOTIFICATION_COUNT',
  GET_PRE_UPGRADE: 'GET_PRE_UPGRADE',
  GET_PET_BREEDS: 'GET_PET_BREEDS',
  GET_PET_POSTS: 'GET_PET_POSTS',
  GET_BREED_DETAIL: 'GET_BREED_DETAIL',
  GET_BLOGS: 'GET_BLOGS',
  GET_BLOG_DETAIL: 'GET_BLOG_DETAIL',
  GET_BLOGS_USER: 'GET_BLOGS_USER',
  GET_AD_TYPES: 'GET_ADVERTISEMENT_TYPES',
  GET_PAYMENT_TOKEN: 'GET_PAYMENT_TOKEN',
  GET_BLOG_AD: 'GET_BLOG_AD',
  GET_PRE_REPORT: 'GET_PRE_REPORT',
  GET_KEYWORDS: 'GET_KEYWORDS',
  GET_PET_BREED_AI: 'GET_PET_BREED_AI',
  GET_VACCINE: 'GET_VACCINE',
};

export const EVENT_NAMES = {
  RESET_RECAPTCHA: 'RESET_RECAPTCHA',
};

export const PAGE_SIZE = 9;

export enum PET_SEX {
  MALE = 0,
  FEMALE = 1,
  UNKNOWN = 2,
}

export enum PET_COLOR {
  BLACK = 0,
  WHITE = 1,
  BROWN = 2,
  YELLOW = 3,
  SILVER = 4,
  OTHER = 5,
}

export enum PET_SPECIES {
  DOG = 0,
  CAT = 1,
  OTHER = 2,
}

export enum PET_SIZE {
  SMALL = 0,
  MEDIUM = 1,
  BIG = 2,
}

export enum PET_AGE {
  LESS_THAN_ONE_YEAR = 0,
  ONE_TO_THREE_YEAR = 1,
  MORE_THAN_THREE_YEAR = 2,
}

export enum PET_SORT_CRITERIA {
  POPULAR = 0,
  HOT = 1,
  NEWEST = 2,
}

export enum PET_MEDICAL_STATUS {
  YES = 0,
  NO = 1,
  UNKNOWN = 2,
}

export enum HOUSE_TYPE {
  Apartment = 0,
  House = 1,
  Dormitory = 2,
  Shelter = 3,
  Other = 4,
}

export enum ADOPT_DELAY_DURATION {
  Immediately,
  FewDays,
  OneWeek,
  Other,
}

export enum BLOG_CATEGORIES {
  HEALTH,
  TRAINING,
  PRODUCT,
  ART,
}

export enum ORG_TYPE {
  RESCUE,
  BUSINESS,
  VET,
  OTHER,
}

export const PET_SPECIES_FILTER: IPetFilter = {
  id: 1,
  label: 'Loài',
  labelGetValues: 'species',
  items: [
    {
      id: 1,
      label: 'Chó',
      value: PET_SPECIES.DOG,
    },
    {
      id: 2,
      label: 'Mèo',
      value: PET_SPECIES.CAT,
    },
    {
      id: 3,
      label: 'Khác',
      value: PET_SPECIES.OTHER,
    },
  ],
};

export const PET_SEX_FILTER: IPetFilter = {
  id: 2,
  label: 'Giới tính',
  labelGetValues: 'sex',
  items: [
    {
      id: 1,
      label: 'Đực',
      value: PET_SEX.MALE,
    },
    {
      id: 2,
      label: 'Cái',
      value: PET_SEX.FEMALE,
    },
    {
      id: 3,
      label: 'Không rõ',
      value: PET_SEX.UNKNOWN,
    },
  ],
};

export const PET_COLOR_FILTER: IPetFilter = {
  id: 3,
  label: 'Màu sắc',
  labelGetValues: 'color',
  items: [
    {
      id: 1,
      label: 'Đen',
      value: PET_COLOR.BLACK,
    },
    {
      id: 2,
      label: 'Trắng',
      value: PET_COLOR.WHITE,
    },
    {
      id: 3,
      label: 'Vàng',
      value: PET_COLOR.YELLOW,
    },
    {
      id: 4,
      label: 'Nâu',
      value: PET_COLOR.BROWN,
    },
    {
      id: 5,
      label: 'Xám',
      value: PET_COLOR.SILVER,
    },
    {
      id: 6,
      label: 'Khác',
      value: PET_COLOR.OTHER,
    },
  ],
};

export const PET_SIZE_FILTER: IPetFilter = {
  id: 4,
  label: 'Kích thước',
  labelGetValues: 'size',
  items: [
    {
      id: 1,
      label: 'Nhỏ',
      value: PET_SIZE.SMALL,
    },
    {
      id: 2,
      label: 'Trung bình',
      value: PET_SIZE.MEDIUM,
    },
    {
      id: 3,
      label: 'Lớn',
      value: PET_SIZE.BIG,
    },
  ],
};

export const PET_AGE_FILTER: IPetFilter = {
  id: 5,
  label: 'Độ tuổi',
  labelGetValues: 'age',
  items: [
    {
      id: 1,
      label: 'Dưới 1 năm',
      value: PET_AGE.LESS_THAN_ONE_YEAR,
    },
    {
      id: 2,
      label: 'Từ 1 đến 3 năm',
      value: PET_AGE.ONE_TO_THREE_YEAR,
    },
    {
      id: 3,
      label: 'Hơn 3 năm',
      value: PET_AGE.MORE_THAN_THREE_YEAR,
    },
  ],
};

export const PET_VACCINATED_FILTER: IPetFilter = {
  id: 6,
  label: 'Tiêm chủng',
  labelGetValues: 'isVaccinated',
  items: [
    {
      id: 1,
      label: 'Đã tiêm',
      value: PET_MEDICAL_STATUS.YES,
    },
    {
      id: 2,
      label: 'Chưa tiêm',
      value: PET_MEDICAL_STATUS.NO,
    },
    {
      id: 3,
      label: 'Chưa rõ',
      value: PET_MEDICAL_STATUS.UNKNOWN,
    },
  ],
};

export const PET_STERILIZED_FILTER: IPetFilter = {
  id: 7,
  label: 'Triệt sản',
  labelGetValues: 'isSterillized',
  items: [
    {
      id: 1,
      label: 'Đã triệt sản',
      value: PET_MEDICAL_STATUS.YES,
    },
    {
      id: 2,
      label: 'Chưa triệt sản',
      value: PET_MEDICAL_STATUS.NO,
    },
    {
      id: 3,
      label: 'Chưa rõ',
      value: PET_MEDICAL_STATUS.UNKNOWN,
    },
  ],
};

export const PET_FILTERS: IPetFilter[] = [
  PET_SPECIES_FILTER,
  PET_AGE_FILTER,
  PET_COLOR_FILTER,
  PET_SEX_FILTER,
  PET_SIZE_FILTER,
  PET_VACCINATED_FILTER,
  PET_STERILIZED_FILTER,
];

export const PET_SELECT: IPetSelect[] = [
  { ...PET_SEX_FILTER, kind: 'sex' },
  { ...PET_COLOR_FILTER, kind: 'color' },
  { ...PET_SIZE_FILTER, kind: 'size' },
  { ...PET_AGE_FILTER, kind: 'age' },
  { ...PET_STERILIZED_FILTER, kind: 'isSterillized' },
  { ...PET_VACCINATED_FILTER, kind: 'isVaccinated' },
];

export const SEARCH_PARAMS = {
  EMAIL: 'email',
  VALIDATE_REGISTER_TOKEN: 'validateRegisterToken',
  PASSWORD_TOKEN: 'passwordToken',
};

export enum USER_ROLE {
  STANDARD_USER = 0,
  SYSTEM_ADMIN = 1,
  ORGANIZATION = 2,
}

export const HOUSE_TYPE_OPTION = [
  {
    label: 'Chung cư',
    value: HOUSE_TYPE.Apartment,
  },
  {
    label: 'Nhà riêng',
    value: HOUSE_TYPE.House,
  },
  {
    label: 'Kí túc xá',
    value: HOUSE_TYPE.Dormitory,
  },
  {
    label: 'Trạm cứu hộ',
    value: HOUSE_TYPE.Shelter,
  },
  {
    label: 'Khác',
    value: HOUSE_TYPE.Other,
  },
];

export const ADOPT_TIME_OPTION = [
  {
    label: 'Ngay lập tức',
    value: ADOPT_DELAY_DURATION.Immediately,
  },
  {
    label: 'Vài ngày',
    value: ADOPT_DELAY_DURATION.FewDays,
  },
  {
    label: '1 tuần',
    value: ADOPT_DELAY_DURATION.OneWeek,
  },
  {
    label: 'Chưa rõ',
    value: ADOPT_DELAY_DURATION.Other,
  },
];

export const ADOPT_ACTION = {
  ACCEPT: 'Accept',
  REJECT: 'Reject',
  CONFIRM: 'Confirm',
  CANCEL: 'Cancel',
};

export enum ADOPT_STATUS {
  Pending = 0,
  Accepted = 1,
  Rejected = 2,
  Adopted = 3,
  Cancel = 4,
}

export const BLOG_CATEGORIES_OPTION = [
  {
    label: 'Tất cả',
    value: undefined,
  },
  {
    label: 'Sức khỏe',
    value: BLOG_CATEGORIES.HEALTH,
  },
  {
    label: 'Huấn luyện',
    value: BLOG_CATEGORIES.TRAINING,
  },
  {
    label: 'Sản phẩm',
    value: BLOG_CATEGORIES.PRODUCT,
  },
  {
    label: 'Nghệ thuật',
    value: BLOG_CATEGORIES.ART,
  },
];
export const PET_ORG_TYPE_OPTION = [
  {
    label: 'Giải cứu động vật',
    value: ORG_TYPE.RESCUE,
  },
  {
    label: 'Doanh nghiệp',
    value: ORG_TYPE.BUSINESS,
  },
  {
    label: 'Thú Y',
    value: ORG_TYPE.VET,
  },
  {
    label: 'Khác',
    value: ORG_TYPE.OTHER,
  },
];

export const REPORT_TYPE = {
  SPAM: 0,
  SCAM: 1,
  INAPPROPRIATE_CONTENT: 2,
  OTHER: 3,
};

export enum REPORT_ENTITY {
  User,
  Pet,
  Blog,
}

export const GIVE_PET_STEP = {
  UPLOAD_IMAGE: 1,
  PET_DETAIL: 2,
  RULE: 3,
};

export enum LOCATION_LEVEL {
  PROVINCE = 1,
  DISTRICT = 2,
  WARD = 3,
}