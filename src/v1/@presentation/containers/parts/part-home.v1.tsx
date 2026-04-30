import type { FC } from "react";

export const PartHome: FC<IPartProps> = (props) => {
  const { className } = props;

  return (
    <div className={className}>
      <h1>PartHome</h1>
    </div>
  );
};
