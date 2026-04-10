import { useTheme } from "next-themes";

export function useThemeTransition() {
  const { setTheme, theme } = useTheme();

  const changeTheme = (theme: string) => {
    if (!document.startViewTransition) {
      setTheme(theme);
      return;
    }

    document.startViewTransition(() => {
      setTheme(theme);
    });
  };
  return { changeTheme, theme };
}
