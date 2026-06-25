import { IPetFilter, IPetFilterItem, IPetSelect } from '../interfaces/pet';
import { ValueTextManager } from './ValueTextManager';

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
  REFRESH_TOKEN_SERVER: 'refreshTokenServer',
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
  '11001': 'Thú cưng không hợp lệ.',
  '13001': 'Bài viết blog không hợp lệ.',
  '14003': 'Bạn đã lưu tối đa 5 thẻ. Vui lòng xóa thẻ cũ trước khi thêm mới.',
  '14004': 'Không thể lưu thẻ. Vui lòng thử lại.',
  '14005': 'Không thể xóa thẻ. Vui lòng thử lại.',
  '15001': 'Không tìm thấy bình luận.',
  '15002': 'Bạn không có quyền xóa bình luận này.',
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
  GET_UPGRADE_REQUEST_DETAIL: 'GET_UPGRADE_REQUEST_DETAIL',
  GET_PET_BREEDS: 'GET_PET_BREEDS',
  GET_PET_POSTS: 'GET_PET_POSTS',
  GET_USER_POSTS: 'GET_USER_POSTS',
  GET_ALL_POSTS: 'GET_ALL_POSTS',
  GET_BREED_DETAIL: 'GET_BREED_DETAIL',
  GET_BLOGS: 'GET_BLOGS',
  GET_BLOGS_USER: 'GET_BLOGS_USER',
  GET_AD_TYPES: 'GET_ADVERTISEMENT_TYPES',
  GET_PAYMENT_TOKEN: 'GET_PAYMENT_TOKEN',
  GET_BLOG_AD: 'GET_BLOG_AD',
  GET_PRE_REPORT: 'GET_PRE_REPORT',
  GET_KEYWORDS: 'GET_KEYWORDS',
  GET_VACCINE: 'GET_VACCINE',
  GET_PETS_BY_USER: 'GET_PETS_BY_USER',
  ADMIN_USERS: 'ADMIN_USERS',
  ADMIN_PETS: 'ADMIN_PETS',
  ADMIN_POSTS: 'ADMIN_POSTS',
  ADMIN_BLOGS: 'ADMIN_BLOGS',
  ADMIN_PAYMENTS: 'ADMIN_PAYMENTS',
  ADMIN_REPORTS: 'ADMIN_REPORTS',
  ADMIN_UPGRADES: 'ADMIN_UPGRADES',
  ADMIN_EMAIL_TEMPLATES: 'ADMIN_EMAIL_TEMPLATES',
  GET_SAVED_CARDS: 'GET_SAVED_CARDS',
  GET_CONVERSATIONS: 'GET_CONVERSATIONS',
  GET_MESSAGES: 'GET_MESSAGES',
};

export const EVENT_NAMES = {
  RESET_RECAPTCHA: 'RESET_RECAPTCHA',
};

export const PAGE_SIZE = 9;
export const ADMIN_PAGE_SIZE = 10;

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

const toFilterItems = (valueTexts: { value: string; text: string }[]): IPetFilterItem[] =>
  valueTexts.map((vt, i) => ({ id: i + 1, label: vt.text, value: Number(vt.value) }));

export const PET_SPECIES_FILTER: IPetFilter = {
  id: 1,
  label: 'Loài',
  labelGetValues: 'species',
  items: toFilterItems(ValueTextManager.PetSpecies.GetValueTexts()),
};

export const PET_FILTERS: IPetFilter[] = [
  PET_SPECIES_FILTER,
  { id: 5, label: 'Độ tuổi', labelGetValues: 'age', items: toFilterItems(ValueTextManager.PetAge.GetValueTexts()) },
  { id: 3, label: 'Màu sắc', labelGetValues: 'color', items: toFilterItems(ValueTextManager.PetColor.GetValueTexts()) },
  { id: 2, label: 'Giới tính', labelGetValues: 'sex', items: toFilterItems(ValueTextManager.PetSex.GetValueTexts()) },
  { id: 4, label: 'Kích thước', labelGetValues: 'size', items: toFilterItems(ValueTextManager.PetSize.GetValueTexts()) },
  { id: 6, label: 'Tiêm chủng', labelGetValues: 'isVaccinated', items: toFilterItems(ValueTextManager.PetVaccinated.GetValueTexts()) },
  { id: 7, label: 'Triệt sản', labelGetValues: 'isSterillized', items: toFilterItems(ValueTextManager.PetSterilized.GetValueTexts()) },
];

export const PET_SELECT: IPetSelect[] = [
  { id: 2, label: 'Giới tính', labelGetValues: 'sex', kind: 'sex', items: toFilterItems(ValueTextManager.PetSex.GetValueTexts()) },
  { id: 3, label: 'Màu sắc', labelGetValues: 'color', kind: 'color', items: toFilterItems(ValueTextManager.PetColor.GetValueTexts()) },
  { id: 4, label: 'Kích thước', labelGetValues: 'size', kind: 'size', items: toFilterItems(ValueTextManager.PetSize.GetValueTexts()) },
  { id: 5, label: 'Độ tuổi', labelGetValues: 'age', kind: 'age', items: toFilterItems(ValueTextManager.PetAge.GetValueTexts()) },
  { id: 7, label: 'Triệt sản', labelGetValues: 'isSterillized', kind: 'isSterillized', items: toFilterItems(ValueTextManager.PetSterilized.GetValueTexts()) },
  { id: 6, label: 'Tiêm chủng', labelGetValues: 'isVaccinated', kind: 'isVaccinated', items: toFilterItems(ValueTextManager.PetVaccinated.GetValueTexts()) },
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

export enum UPGRADE_STATUS {
  PENDING = 0,
  REJECTED = 1,
  APPROVED = 2,
  CANCELLED = 3,
}