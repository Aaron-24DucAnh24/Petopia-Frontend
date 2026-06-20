export enum NotificationType {
  UpdateAccount = 0,
  ContentDeactivated = 1,
  ReportCreated = 2,
  ReportResolved = 3,
  UpgradeRequestCreated = 4,
  UpgradeRequestApproved = 5,
  UpgradeRequestRejected = 6,
  UpgradeRequestCancelled = 7,
}

export enum ReferenceType {
  Blog = 0,
  Pet = 1,
  Post = 2,
  User = 3,
  UpgradeForm = 4,
  Report = 5,
}

export interface INotificationResponse {
  id: string;
  referenceId: string;
  referenceType: ReferenceType;
  title: string;
  content: string;
  isChecked: boolean;
  type: NotificationType;
  userId: string;
  isCreatedAt: string;
}
