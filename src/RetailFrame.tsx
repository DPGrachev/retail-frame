import React, { useEffect, useRef } from 'react';

type RetailFrameProps = {
    id: string;
    title: string;
    src: string;
    frameOrigin: string;
    styles?: string;
};

export const RetailFrame: React.FC<RetailFrameProps> = ({
    src, id, title, frameOrigin, styles
}) => {
    const frame = useRef<HTMLIFrameElement>(null);
    const queryParams = globalThis.location.search;

    useEffect(() => {
        globalThis.addEventListener('message', (event) => {
            if (event.origin !== frameOrigin) return;

            if (event.data?.height) {
                frame.current.style.height = `${event.data.height + 10}px`;
                frame.current.contentWindow.postMessage({ location: globalThis.location.href }, frameOrigin);
            }
            if (event.data?.redirectUri) {
                globalThis.location.href = event.data?.redirectUri;
            }
        });
    }, [frameOrigin]);

    return (
        <iframe
            ref={frame}
            id={id}
            title={title}
            src={`${src}${checkEsiaAuth(queryParams) ? `${queryParams}&` : '?'}${styles ? `styles=${styles}` : ''}`}
        />
    );
};

const checkEsiaAuth = (params: string):boolean => {
    const queryStorage = new URLSearchParams(decodeURIComponent(params));
    const code = queryStorage.get('code');
    const state = queryStorage.get('state');

    return Boolean(code && state);
};
