'use client'

import React from 'react';
import twitterWidgetJs from './twiter-widget-url';

declare global {
  interface Window {
    twttr: any;
  }
}

interface JSONObject {
  [k: string]: any;
}

export interface TwitterDMButtonProps {
  /**
   * Twitter user id for DM button
   */
  id: number;
  /**
   * Additional options to be added to the button
   */
  options?: JSONObject;
  /**
   * Placeholder while tweet is loading
   */
  placeholder?: string | React.ReactNode;
  /**
   * Function to execute after load, return html element
   */
  onLoad?: (element: any) => void;
}

const methodName = 'createDMButton';

const TwitterDMButton = (props: TwitterDMButtonProps): any => {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let isComponentMounted = true;
    const script = require('scriptjs');
    script(twitterWidgetJs, 'twitter-embed', () => {
      if (!window.twttr) {
        console.error('Failure to load window.twttr, aborting load');
        return;
      }
      if (isComponentMounted) {
        if (!window.twttr.widgets[methodName]) {
          console.error(
            `Method ${methodName} is not present anymore in twttr.widget api`
          );
          return;
        }

        window.twttr.widgets[methodName](
          props.id,
          ref?.current,
          props.options
        ).then((element: any) => {
          if (isComponentMounted) {
            setLoading(false);
            if (props.onLoad) {
              props.onLoad(element);
            }
          }
        });
      }
    });

    // cleaning up
    return () => {
      isComponentMounted = false;
    };
  }, []);

  return (
    <React.Fragment>
      {loading && <React.Fragment>{props.placeholder}</React.Fragment>}
      <div ref={ref} />
    </React.Fragment>
  );
};

export default TwitterDMButton;
