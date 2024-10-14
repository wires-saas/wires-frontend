import { Permission, PermissionAction, PermissionSubject } from '../services/permission.service';




export const UpdateOrganization = new Permission(PermissionSubject.Organization, PermissionAction.Update);

export const UpdateUserRole = new Permission(PermissionSubject.UserRole, PermissionAction.Update);

export const CreateRole = new Permission(PermissionSubject.Role, PermissionAction.Create);
export const UpdateRole = new Permission(PermissionSubject.Role, PermissionAction.Update);

export const UpdateUser = new Permission(PermissionSubject.User, PermissionAction.Update);

export const ReadBilling = new Permission(PermissionSubject.Billing, PermissionAction.Read);

export const CreateFeed = new Permission(PermissionSubject.Feed, PermissionAction.Create);
export const UpdateFeed = new Permission(PermissionSubject.Feed, PermissionAction.Update);
export const DeleteFeed = new Permission(PermissionSubject.Feed, PermissionAction.Delete);

export const ReadFeedRun = new Permission(PermissionSubject.FeedRun, PermissionAction.Read);

export const ReadArticle = new Permission(PermissionSubject.Article, PermissionAction.Read);

export const ReadBlock = new Permission(PermissionSubject.Block, PermissionAction.Read);
export const CreateBlock = new Permission(PermissionSubject.Block, PermissionAction.Create);
export const UpdateBlock = new Permission(PermissionSubject.Block, PermissionAction.Update);

export const CreateFolder = new Permission(PermissionSubject.Folder, PermissionAction.Create);
export const UpdateFolder = new Permission(PermissionSubject.Folder, PermissionAction.Update);
export const DeleteFolder = new Permission(PermissionSubject.Folder, PermissionAction.Delete);

