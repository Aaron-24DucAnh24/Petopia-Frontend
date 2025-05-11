export class StringUtil {
  static IsPassword(value: string | undefined | null): boolean {
    if (!value) return false;
    const passwordPattern = /^.{8,}$/;
    return passwordPattern.test(value);
  }

  static IsEmail(value: string | undefined | null): boolean {
    if (!value) return false;
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    return emailPattern.test(value);
  }

  static IsEmpty(value: string | undefined | null | Date): boolean {
    if (!value) return true;
    if (typeof value !== 'string') return false;
    return value.trim() === '';
  }

  static IsVietnamesePhone(value: string | undefined | null): boolean {
    if (!value) return false;
    const vietnamPhonePattern = /^(0|\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-9])[0-9]{7}$/;
    return vietnamPhonePattern.test(value);
  }

  static IsDatetime(value: string | undefined | null): boolean {
    if (!value) return false;
    return isNaN(new Date(value).getDate());
  }

  static IsValidUrl(value: string | undefined | null) {
    if (!value) return false;
    try {
      new URL(value);
      return true;
    } catch (e) {
      return false;
    }
  }

  static GetDomainName(value: string | undefined | null) {
    if (!value) return '';
    try {
      return new URL(value).hostname;
    } catch (e) {
      return '';
    }
  }
};