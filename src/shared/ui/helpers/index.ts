export const convertThemeToColorWhiteDefault = (theme: string | undefined) => {
  if (!theme) return '#ffffff';
  switch (theme) {
    case 'white':
      return '#ffffff';
    case 'slate':
      return '#64748b';
    case 'blue':
      return '#3b82f6';
    case 'sky':
      return '#0ea5e9';
    case 'teal':
      return '#14b8a6';
    case 'lime':
      return '#84cc16';
    case 'green':
      return '#22c55e';
    case 'yellow':
      return '#eab308';
    case 'amber':
      return '#f59e0b';
    case 'orange':
      return '#f97316';
    case 'pink':
      return '#ec4899';
    case 'fuchsia':
      return '#d946ef';
    case 'purple':
      return '#a855f7';
    case 'indigo':
      return '#6366f1';
    case 'rose':
      return '#f43f5e';
    case 'red':
      return '#ef4444';
    case 'black':
      return '#000000';
  }
  return '#ffffff';
};

export const convert800ThemeToColorGrayDefault = (theme: string | undefined) => {
  if (!theme) return '#9294a1';
  switch (theme) {
    case 'white':
      return '#ffffff';
    case 'slate':
      return '#1e293b';
    case 'blue':
      return '#1e40af';
    case 'sky':
      return '#075985';
    case 'teal':
      return '#115e59';
    case 'lime':
      return '#3f6212';
    case 'green':
      return '#166534';
    case 'yellow':
      return '#854d0e';
    case 'amber':
      return '#92400e';
    case 'orange':
      return '#9a3412';
    case 'pink':
      return '#9d174d';
    case 'fuchsia':
      return '#86198f';
    case 'purple':
      return '#6b21a8';
    case 'indigo':
      return '#3730a3';
    case 'rose':
      return '#9f1239';
    case 'red':
      return '#991b1b';
    case 'black':
      return '#000000';
  }
  return '#9294a1';
};

export const convertThemeToColorBlackDefault = (theme: string | undefined) => {
  if (!theme) return '#000000';
  switch (theme) {
    case 'white':
      return '#ffffff';
    case 'slate':
      return '#64748b';
    case 'blue':
      return '#3b82f6';
    case 'sky':
      return '#0ea5e9';
    case 'teal':
      return '#14b8a6';
    case 'lime':
      return '#84cc16';
    case 'green':
      return '#22c55e';
    case 'yellow':
      return '#eab308';
    case 'amber':
      return '#f59e0b';
    case 'orange':
      return '#f97316';
    case 'pink':
      return '#ec4899';
    case 'fuchsia':
      return '#d946ef';
    case 'purple':
      return '#a855f7';
    case 'indigo':
      return '#6366f1';
    case 'rose':
      return '#f43f5e';
    case 'red':
      return '#ef4444';
    case 'black':
      return '#000000';
  }
  return '#000000';
};
