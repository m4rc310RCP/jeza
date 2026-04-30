import type { FC, HtmlHTMLAttributes } from "react";
export const MMainScreen: FC<HtmlHTMLAttributes<unknown>> = (
  props,
) => {
  const { ...rest } = props;

  return (
    <div {...rest}>
      <h1>MMainScreen</h1>
    </div>
  );
};
