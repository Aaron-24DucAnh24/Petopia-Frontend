export class ValueText {
  public valueTextMap: { value: string; text: string }[];

  public constructor(valueTextMap: { value: string; text: string }[]) {
    this.valueTextMap = valueTextMap;
  }

  public GetText(value: string): string | undefined {
    return this.valueTextMap.find(item => item.value === value)?.text;
  }

  public GetValueTexts(): { value: string; text: string }[] {
    return this.valueTextMap;
  }
}