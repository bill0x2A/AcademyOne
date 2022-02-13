import * as React from 'react';

export type Optional<T> = T | undefined;

export const usePrevious = <T>(value: T): Optional<T> => {
    const ref = React.useRef<T>();

    React.useEffect(() => {
        ref.current = value;
    }, [value]);

    return ref.current;
};
