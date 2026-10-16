export const THEME_STORAGE_KEY = "theme";

/** Runs before paint so a stored theme choice never flashes the wrong colors. */
export const themeScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="light"||t==="dark"){document.documentElement.setAttribute("data-theme",t)}}catch(e){}})();`;
