import {
    Permission,
    PermissionAction,
    PermissionSubject,
} from '../services/permission.service';

export const UpdateOrganization = new Permission(
    PermissionSubject.Organization,
    PermissionAction.Update,
);

export const UpdateUserRole = new Permission(
    PermissionSubject.UserRole,
    PermissionAction.Update,
);

export const CreateRole = new Permission(
    PermissionSubject.Role,
    PermissionAction.Create,
);
export const UpdateRole = new Permission(
    PermissionSubject.Role,
    PermissionAction.Update,
);

export const CreateUser = new Permission(
    PermissionSubject.User,
    PermissionAction.Create,
);
export const ReadUser = new Permission(
    PermissionSubject.User,
    PermissionAction.Read,
);
export const UpdateUser = new Permission(
    PermissionSubject.User,
    PermissionAction.Update,
);
export const DeleteUser = new Permission(
    PermissionSubject.User,
    PermissionAction.Delete,
);

export const ReadBilling = new Permission(
    PermissionSubject.Billing,
    PermissionAction.Read,
);
export const UpdateBilling = new Permission(
    PermissionSubject.Billing,
    PermissionAction.Update,
);
export const DeleteBilling = new Permission(
    PermissionSubject.Billing,
    PermissionAction.Delete,
);

export const CreateFeed = new Permission(
    PermissionSubject.Feed,
    PermissionAction.Create,
);
export const UpdateFeed = new Permission(
    PermissionSubject.Feed,
    PermissionAction.Update,
);
export const DeleteFeed = new Permission(
    PermissionSubject.Feed,
    PermissionAction.Delete,
);

export const CreateFeedRun = new Permission(
    PermissionSubject.FeedRun,
    PermissionAction.Create,
);
export const ReadFeedRun = new Permission(
    PermissionSubject.FeedRun,
    PermissionAction.Read,
);

export const ReadArticle = new Permission(
    PermissionSubject.Article,
    PermissionAction.Read,
);

export const ReadBlock = new Permission(
    PermissionSubject.Block,
    PermissionAction.Read,
);
export const CreateBlock = new Permission(
    PermissionSubject.Block,
    PermissionAction.Create,
);
export const UpdateBlock = new Permission(
    PermissionSubject.Block,
    PermissionAction.Update,
);

export const CreateFolder = new Permission(
    PermissionSubject.Folder,
    PermissionAction.Create,
);
export const UpdateFolder = new Permission(
    PermissionSubject.Folder,
    PermissionAction.Update,
);
export const DeleteFolder = new Permission(
    PermissionSubject.Folder,
    PermissionAction.Delete,
);

export const CreateContactsProvider = new Permission(
    PermissionSubject.ContactsProvider,
    PermissionAction.Create,
);
export const ReadContactsProvider = new Permission(
    PermissionSubject.ContactsProvider,
    PermissionAction.Read,
);
export const UpdateContactsProvider = new Permission(
    PermissionSubject.ContactsProvider,
    PermissionAction.Update,
);
export const DeleteContactsProvider = new Permission(
    PermissionSubject.ContactsProvider,
    PermissionAction.Delete,
);

export const CreateEmailsProvider = new Permission(
    PermissionSubject.EmailsProvider,
    PermissionAction.Create,
);
export const ReadEmailsProvider = new Permission(
    PermissionSubject.EmailsProvider,
    PermissionAction.Read,
);
export const UpdateEmailsProvider = new Permission(
    PermissionSubject.EmailsProvider,
    PermissionAction.Update,
);
export const DeleteEmailsProvider = new Permission(
    PermissionSubject.EmailsProvider,
    PermissionAction.Delete,
);
