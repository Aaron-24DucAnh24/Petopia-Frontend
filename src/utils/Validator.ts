import { IValidatingResult } from '../interfaces/common';
import { StringUtil } from './StringUtil';

export type RuleSet = {
  [field: string]: {
    required?: boolean;
    type?: string;
    minLength?: number;
    maxLength?: number;
    length?: number;
    confirm?: string;
  };
};

export class Validator {
  private rules: RuleSet;

  constructor(rules: RuleSet) {
    this.rules = rules;
  }

  validate(data: Record<string, any>): IValidatingResult {
    const errors: Record<string, string> = {};

    for (const field in this.rules) {
      const rule = this.rules[field];
      const value = data[field];

      // Requirement checking
      if (rule.required && StringUtil.IsEmpty(value)) {
        errors[field] = 'Vui lòng nhập trường này';
        continue;
      }

      // Type checking
      switch (rule.type) {
        case 'phone':
          if (!StringUtil.IsVietnamesePhone(value)) {
            errors[field] = 'Vui lòng nhập số điện thoại hợp lệ';
            continue;
          }
          break;

        case 'email':
          if (!StringUtil.IsEmail(value)) {
            errors[field] = 'Vui lòng nhập địa chỉ mail hợp lệ';
            continue;
          }
          break;

        case 'url':
          if (!StringUtil.IsValidUrl(value)) {
            errors[field] = 'Vui lòng nhập url hợp lệ';
            continue;
          }
          break;
      }

      // Length checking
      if (rule.minLength && (value.length < rule.minLength)) {
        errors[field] = `Vui lòng nhập tối thiểu ${rule.minLength} ký tự`;
        continue;
      }
      if (rule.maxLength && (value.length > rule.maxLength)) {
        errors[field] = `Vui lòng nhập tối đa ${rule.maxLength} ký tự`;
        continue;
      }
      if (rule.length && (value.length !== rule.length)) {
        errors[field] = `Vui lòng nhập ${rule.maxLength} ký tự`;
        continue;
      }

      // Confirmation checking
      if (rule.confirm
        && data[rule.confirm]
        && (data[rule.confirm] !== value)) {
        errors[field] = 'Vui lòng nhập lại';
        continue;
      }
    }

    return { isValid: Object.keys(errors).length === 0, errors };
  }
}