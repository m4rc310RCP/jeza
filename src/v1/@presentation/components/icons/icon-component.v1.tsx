import type { FC, HtmlHTMLAttributes } from "react";
import velooLogo from "@assets/veloo_logo.png";

interface IconProps {
  id: "VELOX_LOGO";
}

export const Icon: FC<HtmlHTMLAttributes<unknown> & IconProps> = (props) => {
  const { ...rest } = props;

  return <img {...rest} src={velooLogo} alt="Logo da Veloo" />;
};
