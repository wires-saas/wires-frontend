import { Injectable, effect, signal } from '@angular/core';
import { Subject } from 'rxjs';

export type MenuMode =
    | 'static'
    | 'overlay'
    | 'horizontal'
    | 'slim'
    | 'slim-plus'
    | 'reveal'
    | 'drawer';

export type ColorScheme = 'light' | 'dark' | 'dim';

export type MenuColorScheme = 'colorScheme' | 'primaryColor' | 'transparent';

export interface AppConfig {
    inputStyle: string;
    colorScheme: ColorScheme;
    theme: string;
    ripple: boolean;
    menuMode: MenuMode;
    scale: number;
    menuTheme: MenuColorScheme;
}

interface LayoutState {
    staticMenuDesktopInactive: boolean;
    overlayMenuActive: boolean;
    profileSidebarVisible: boolean;
    configSidebarVisible: boolean;
    staticMenuMobileActive: boolean;
    menuHoverActive: boolean;
    sidebarActive: boolean;
    anchored: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class LayoutService {

    _config: AppConfig = {
        ripple: false,
        inputStyle: 'outlined',
        menuMode: 'static',
        colorScheme: 'light',
        theme: 'indigo',
        scale: 14,
        menuTheme: 'colorScheme',
    };

    config = signal<AppConfig>(this._config);

    state: LayoutState = {
        staticMenuDesktopInactive: false,
        overlayMenuActive: false,
        profileSidebarVisible: false,
        configSidebarVisible: false,
        staticMenuMobileActive: false,
        menuHoverActive: false,
        sidebarActive: false,
        anchored: false,
    };

    private configUpdate = new Subject<AppConfig>();

    private overlayOpen = new Subject<any>();

    configUpdate$ = this.configUpdate.asObservable();

    overlayOpen$ = this.overlayOpen.asObservable();

    constructor() {
        effect(() => {
            const config = this.config();
            if (this.updateStyle(config)) {
                this.changeTheme();
            }
            this.changeScale(config.scale);
            this.onConfigUpdate();
        });

        // Switch to dark theme if night
        const hours = new Date().getHours();

        const schemePreferenceFromStorage = localStorage.getItem('color-scheme-preference');

        let colorScheme: ColorScheme;

        if (schemePreferenceFromStorage && ['light', 'dim', 'dark'].indexOf(schemePreferenceFromStorage) > -1) {
            colorScheme = schemePreferenceFromStorage as ColorScheme;
        } else {
            if (hours > 10 && hours <= 20) {
                colorScheme = 'light';
            } else {
                colorScheme = 'dim';
            }
        }

        switch (colorScheme) {
            case 'light':
                setTimeout(() => this.switchToLightMode(), 1);
                break;
            case 'dark':
                setTimeout(() => this.switchToDarkMode(), 1);
                break;
            case 'dim':
                setTimeout(() => this.switchToDimMode(), 1);
                break;
        }
    }

    updateStyle(config: AppConfig) {
        return (
            config.theme !== this._config.theme ||
            config.colorScheme !== this._config.colorScheme
        );
    }

    onMenuToggle() {
        if (this.isOverlay()) {
            this.state.overlayMenuActive = !this.state.overlayMenuActive;

            if (this.state.overlayMenuActive) {
                this.overlayOpen.next(null);
            }
        }

        if (this.isDesktop()) {
            this.state.staticMenuDesktopInactive =
                !this.state.staticMenuDesktopInactive;
        } else {
            this.state.staticMenuMobileActive =
                !this.state.staticMenuMobileActive;

            if (this.state.staticMenuMobileActive) {
                this.overlayOpen.next(null);
            }
        }
    }

    onOverlaySubmenuOpen() {
        this.overlayOpen.next(null);
    }

    showProfileSidebar() {
        this.state.profileSidebarVisible = true;
    }

    hideProfileSidebar() {
        this.state.profileSidebarVisible = false;
    }

    showConfigSidebar() {
        this.state.configSidebarVisible = true;
    }

    isOverlay() {
        return this.config().menuMode === 'overlay';
    }

    isDesktop() {
        return window.innerWidth > 991;
    }

    isLightMode() {
        return this.config().colorScheme === 'light';
    }

    isSlim() {
        return this.config().menuMode === 'slim';
    }

    isSlimPlus() {
        return this.config().menuMode === 'slim-plus';
    }

    isHorizontal() {
        return this.config().menuMode === 'horizontal';
    }

    isMobile() {
        return !this.isDesktop();
    }

    onConfigUpdate() {
        this._config = { ...this.config() };
        this.configUpdate.next(this.config());
    }

    changeTheme() {
        const config = this.config();
        const themeLink = <HTMLLinkElement>(
            document.getElementById('theme-link')
        );
        const themeLinkHref = themeLink.getAttribute('href')!;
        const newHref = themeLinkHref
            .split('/')
            .map((el) =>
                el == this._config.theme
                    ? (el = config.theme)
                    : el == `theme-${this._config.colorScheme}`
                    ? (el = `theme-${config.colorScheme}`)
                    : el
            )
            .join('/');

        this.replaceThemeLink(newHref);
    }

    replaceThemeLink(href: string) {
        const id = 'theme-link';
        let themeLink = <HTMLLinkElement>document.getElementById(id);
        const cloneLinkElement = <HTMLLinkElement>themeLink.cloneNode(true);

        cloneLinkElement.setAttribute('href', href);
        cloneLinkElement.setAttribute('id', id + '-clone');

        themeLink.parentNode!.insertBefore(
            cloneLinkElement,
            themeLink.nextSibling
        );
        cloneLinkElement.addEventListener('load', () => {
            themeLink.remove();
            cloneLinkElement.setAttribute('id', id);
        });
    }

    switchToLightMode() {
        localStorage.setItem('color-scheme-preference', 'light');
        this.config.update((config: AppConfig) => ({
            ...config,
            theme: 'teal',
            colorScheme: 'light',
        }));
    }

    switchToDarkMode() {
        localStorage.setItem('color-scheme-preference', 'dark');
        this.config.update((config: AppConfig) => ({
            ...config,
            theme: 'indigo',
            colorScheme: 'dark',
        }));
    }

    switchToDimMode() {
        localStorage.setItem('color-scheme-preference', 'dim');
        this.config.update((config: AppConfig) => ({
            ...config,
            theme: 'indigo',
            colorScheme: 'dim',
        }));
    }

    changeScale(value: number) {
        document.documentElement.style.fontSize = `${value}px`;
    }
}
