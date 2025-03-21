import { useEffect } from 'react';
const MICROFRONTS = ['http://localhost:4001'];

export const useIFrameMode = () => {
  const isFrame = globalThis.location !== globalThis?.top?.location;
  const height = globalThis.document?.body?.scrollHeight;

  useEffect(() => {
    if (isFrame) {
      window.parent.postMessage({ height: document.body.scrollHeight }, '*');
    }
  }, [height, isFrame]);

  useEffect(() => {
    if (isFrame) {
      const handlePostMessage = (event: MessageEvent) => {
        if (!MICROFRONTS.includes(event.origin)) return;

        if (event.data?.location) {
          sessionStorage.setItem('frameLocation', event.data?.location);
        }
      };
      window.addEventListener('message', handlePostMessage);

      return () => window.removeEventListener('message', handlePostMessage)
    }
  }, [isFrame]);
};
