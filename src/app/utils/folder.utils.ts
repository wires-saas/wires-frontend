import { MenuItem, MenuItemCommandEvent } from 'primeng/api';
import { Folder } from '../services/folder.service';

export class FolderUtils {

    static foldersToMenuItems = (folders: Folder[], command?: (event: MenuItemCommandEvent) => void): MenuItem[] => {
        return folders.map((folder) => {
            return {
                label: folder.displayName,
                id: folder.id,
                items: FolderUtils.foldersToMenuItems(folders.filter((f) => f.parentFolder === folder.id)),
                command
            };
        });
    }


}
