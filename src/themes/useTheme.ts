import { useEffect,useState } from "react";
export type Theme = "light" | "dark";
const STORAGE_KEY = "jibon-guchao-theme";

export function getStartingTheme(): Theme{
    const saved = localStorage.getItem(STORAGE_KEY);
    if(saved === "light" || saved === "dark"){
        return saved; 
    }
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
}

export function useTheme(){
    const [theme, setTheme] = useState<Theme>(getStartingTheme);

    useEffect(() =>{
        document.documentElement.dataset.theme = theme;
        localStorage.setItem(STORAGE_KEY,theme);
    },[theme]);

    function toggleTheme(){
        setTheme((old) => (old === "light" ? "dark" : "light"));
    }

    return { theme, toggleTheme };
}