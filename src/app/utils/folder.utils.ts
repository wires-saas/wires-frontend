import { MenuItem } from 'primeng/api';
import { Folder } from '../services/folder.service';

export class FolderUtils {

    static foldersToMenuItems = (folders: Folder[]): MenuItem[] => {
        return folders.map((folder) => {
            return {
                label: folder.label,
                id: folder.id,
                items: FolderUtils.foldersToMenuItems(folders.filter((f) => f.parentId === folder.id)),
            };
        });
    }


}
