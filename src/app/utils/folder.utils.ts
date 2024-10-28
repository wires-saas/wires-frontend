import { MenuItem, MenuItemCommandEvent } from 'primeng/api';
import { Folder } from '../services/folder.service';

export class FolderUtils {
    static foldersToMenuItems = (
        parentFolder: Folder | null,
        folders: Folder[],
        command?: (event: MenuItemCommandEvent) => void,
    ): MenuItem[] => {
        return folders.reduce((menuItems, folder) => {
            // if parentFolder is null, then we are at the root level

            if (parentFolder === null && folder.parentFolder !== null)
                return menuItems;
            else if (
                parentFolder !== null &&
                folder.parentFolder !== parentFolder.id
            )
                return menuItems;
            else {
                return [
                    ...menuItems,
                    {
                        label: folder.displayName,
                        id: folder.id,
                        items: FolderUtils.foldersToMenuItems(
                            folder,
                            folders,
                            command,
                        ),
                        command,
                        data: folder,
                    },
                ];
            }
        }, [] as MenuItem[]);
    };
}
