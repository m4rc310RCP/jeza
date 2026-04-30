import type { FC, HtmlHTMLAttributes } from "react";
import { useStoreLocal } from "@core/storage/zustand/zustand-storage.v1";

export const MenuPrincipal: FC<HtmlHTMLAttributes<unknown>> = (props) => {
  const { ...rest } = props;

  const content = useStoreLocal((s) => s.content);

  return (
    <div {...rest}>
      {content &&
        content.parts.map((part) => {
          return (
            <a key={part.id} href={part.textLink} className="">
              {part.title}
            </a>
          );
        })}
    </div>
  );
};
