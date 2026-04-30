import { type FC, type HtmlHTMLAttributes } from "react";

export const MainContainer: FC<HtmlHTMLAttributes<unknown>> = (props) => {
  const { ...rest } = props;

  return (
    <div
      {...rest}
      className={`text-principal bg-primary w-screen h-screen overflow-hidden ${rest.className ?? ""}`}
    />
  );
};
