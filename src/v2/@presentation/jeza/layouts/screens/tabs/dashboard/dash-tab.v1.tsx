import type { FC, HtmlHTMLAttributes } from "react";

interface MTabDashboardProps {}

export const MTabDashboard: FC<
  HtmlHTMLAttributes<unknown> & MTabDashboardProps
> = (props) => {
  const { ...rest } = props;

  return (
    <div {...rest}>
      <h1>MTabDashboard</h1>
    </div>
  );
};
