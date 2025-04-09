import { useEffect } from 'react';

const initializeExternalStylesheet = (url = '') => {
  const link = globalThis.document.getElementById(url);

  if (!link) {
    const newLink = globalThis.document.createElement('link');
    newLink.href = url;
    newLink.id = url;
    newLink.rel = 'stylesheet';

    globalThis.document.head.appendChild(newLink);
  }
};

export const useIFrameMode = () => {
  const isFrame = globalThis.location !== globalThis?.top?.location;
  const height = globalThis.document?.body?.scrollHeight;
  const params = new URLSearchParams(decodeURIComponent(globalThis.location?.search));

  const styles = params.get('styles');
  if (styles) {
    initializeExternalStylesheet(styles);
  }

  useEffect(() => {
    if (isFrame) {
      globalThis.parent.postMessage({ height: document.body.scrollHeight }, '*');
    }
  }, [height, isFrame]);

  useEffect(() => {
    const handlePostMessage = (event: MessageEvent<{ location: string }>) => {
      if (!event.data?.location) {
        return;
      }

      globalThis.sessionStorage.setItem('frameLocation', event.data?.location)
    };
    if (isFrame) {
      globalThis.addEventListener('message', handlePostMessage);
    }

    return () => {
      if (isFrame) {
        globalThis.removeEventListener('message', handlePostMessage);
      }
    };
  }, [isFrame]);
};