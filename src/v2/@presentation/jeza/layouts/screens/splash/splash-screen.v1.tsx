import type { FC, HtmlHTMLAttributes } from "react";
import { GiRadarSweep } from "react-icons/gi";
import { m } from "@jeza-v2/core/i18n/locale-i18n.v1";

export const MSplashScreen: FC<HtmlHTMLAttributes<unknown>> = (props) => {
	const {...rest} = props;
	
	return (
		<div {...rest} className={`flex w-[50ch] flex-col p-4 shadow-lg bg-black rounded-lg shadow-amber-300 m-auto ${rest.className ?? ''}`}>
			<div className="flex items-end justify-between leading-none">
				<div className="flex items-center gap-1">
					<GiRadarSweep className="size-5"/>
					<h1 className="text-2xl bg-linear-to-r from-red-500 via-yellow-500 to-blue-500 bg-clip-text text-transparent">
						{m.text_appname}
					</h1>
				</div>
				<h1 className="text-xs">{m.text_geza_slogan}</h1>
			</div>
			<div className="h-32">
				<h1 className=""></h1>
			</div>
			<div className="flex ">
				<h1 className="text-xs ml-auto">{m.text_copyright}</h1>
			</div>
		</div>
	);
};
