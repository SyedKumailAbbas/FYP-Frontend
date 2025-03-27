import { useEffect } from 'react';

const useDocTitle = (title) => {
    useEffect(() => {
        if (title) {
            document.title = `${title} - Bachat`;
        } else {
            document.title = 'Bachat';
        }
    }, [title]);

    return null;
};

export default useDocTitle;
