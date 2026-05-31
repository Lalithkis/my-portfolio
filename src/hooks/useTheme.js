import { useState, useEffect } from 'react';

export const useTheme = () => {
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        const savedTheme = localStorage.theme;
        if (savedTheme === 'light') {
            setTheme('light');
            document.documentElement.classList.remove('dark');
        } else {
            setTheme('dark');
            document.documentElement.classList.add('dark');
            if (!savedTheme) {
                localStorage.theme = 'dark';
            }
        }
    }, []);

    const toggleTheme = () => {
        if (theme === 'light') {
            setTheme('dark');
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
        } else {
            setTheme('light');
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
        }
    };

    return { theme, toggleTheme };
};
