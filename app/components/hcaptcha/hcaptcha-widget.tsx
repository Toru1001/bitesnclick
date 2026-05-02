"use client";

import HCaptcha from "@hcaptcha/react-hcaptcha";
import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";

export type HCaptchaWidgetHandle = {
  reset: () => void;
};

type HCaptchaWidgetProps = {
  onTokenChange: (token: string | null) => void;
  className?: string;
  theme?: "light" | "dark";
  size?: "normal" | "compact";
  siteKey?: string;
  hasError?: boolean;
};

const HCaptchaWidget = forwardRef<HCaptchaWidgetHandle, HCaptchaWidgetProps>(
  (
    {
      onTokenChange,
      className,
      theme = "light",
      size = "normal",
      siteKey,
      hasError = false,
    },
    ref
  ) => {
    const widgetRef = useRef<HCaptcha>(null);

    const resolvedSiteKey = useMemo(
      () => siteKey ?? process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY ?? "",
      [siteKey]
    );

    useImperativeHandle(ref, () => ({
      reset: () => widgetRef.current?.resetCaptcha(),
    }));

    if (!resolvedSiteKey) {
      return (
        <p className={"text-sm text-red-500 " + (className ?? "")}>
          hCaptcha site key is missing. Set `NEXT_PUBLIC_HCAPTCHA_SITEKEY`.
        </p>
      );
    }

    return (
      <div className={className}>
        <HCaptcha
          ref={widgetRef}
          sitekey={resolvedSiteKey}
          theme={theme}
          size={size}
          onVerify={(token) => onTokenChange(token)}
          onExpire={() => onTokenChange(null)}
          onError={() => onTokenChange(null)}
        />
      </div>
    );
  }
);

HCaptchaWidget.displayName = "HCaptchaWidget";

export default HCaptchaWidget;
