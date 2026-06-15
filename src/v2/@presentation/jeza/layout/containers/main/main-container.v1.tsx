import { MBottonSide, MMainSide, MTabProvider, MTopSide } from "@jeza-v2/presentation/jeza";
import type { FC, HtmlHTMLAttributes } from "react";

export const MMainContainer: FC<HtmlHTMLAttributes<unknown>> = (props) => {
  const { ...rest } = props;
  
  return (
    <div
      {...rest}
      className={`
				w-full h-full flex flex-col
			`}
    >
			<div className="flex">
      	<MTopSide />
			</div>
			<div className="flex flex-1">
				<MTabProvider>
      		<MMainSide />
				</MTabProvider>
			</div>
			<div className="flex">
      	<MBottonSide />
			</div>
    </div>
  );
};
