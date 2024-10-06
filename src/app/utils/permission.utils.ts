import { Permission, PermissionAction, PermissionSubject } from '../services/permission.service';




export const UpdateOrganization = new Permission(PermissionSubject.Organization, PermissionAction.Update);

export const UpdateUserRole = new Permission(PermissionSubject.UserRole, PermissionAction.Update);

export const UpdateUser = new Permission(PermissionSubject.User, PermissionAction.Update);

export const ReadBilling = new Permission(PermissionSubject.Billing, PermissionAction.Read);

export const CreateFeed = new Permission(PermissionSubject.Feed, PermissionAction.Create);
export const UpdateFeed = new Permission(PermissionSubject.Feed, PermissionAction.Update);
export const DeleteFeed = new Permission(PermissionSubject.Feed, PermissionAction.Delete);

export const ReadFeedRun = new Permission(PermissionSubject.FeedRun, PermissionAction.Read);

export const ReadArticle = new Permission(PermissionSubject.Article, PermissionAction.Read);
