import {
  useEffect,
  useMemo,
  useState,
  type ComponentProps,
  type FC,
} from "react";
import type { IconType } from "react-icons";
import {
  IoSunny,
  IoMoon,
  IoPartlySunny,
  IoCloud,
  IoRainy,
  IoThunderstorm,
  IoSnow,
} from "react-icons/io5";
import { TbWindmillFilled } from "react-icons/tb";
import { format } from "date-fns";
import { FaDroplet } from "react-icons/fa6";
import { GrUpdate } from "react-icons/gr";
import { WiSunrise, WiSunset } from "react-icons/wi";
import { useMApp } from "@jeza-v2/presentation/jeza/contexts";

type WeatherIconCode =
  | "01d"
  | "01n"
  | "02d"
  | "02n"
  | "03d"
  | "03n"
  | "04d"
  | "04n"
  | "09d"
  | "09n"
  | "10d"
  | "10n"
  | "11d"
  | "11n"
  | "13d"
  | "13n"
  | "50d"
  | "50n";

type WeatherTheme = {
  background: string;
  text: string;
  mutedText: string;
  icon: string;
  panelBg: string;
  panelBorder: string;
  sunTrack: string;
  sunFill: string;
  updateIcon: string;
  windIcon: string;
  humidityIcon: string;
};

const weatherThemeByIcon: Record<WeatherIconCode, WeatherTheme> = {
  "01d": {
    background: "linear-gradient(180deg, #4FC3F7 0%, #81D4FA 100%)",
    text: "#0F172A",
    mutedText: "#334155",
    icon: "#0F172A",
    panelBg: "rgba(255,255,255,0.18)",
    panelBorder: "rgba(15,23,42,0.18)",
    sunTrack: "rgba(15,23,42,0.18)",
    sunFill: "#FACC15",
    updateIcon: "#EAB308",
    windIcon: "#EAB308",
    humidityIcon: "#60A5FA",
  },
  "01n": {
    background: "linear-gradient(180deg, #1E293B 0%, #020617 100%)",
    text: "#F8FAFC",
    mutedText: "#CBD5E1",
    icon: "#F8FAFC",
    panelBg: "rgba(0,0,0,0.28)",
    panelBorder: "rgba(255,255,255,0.12)",
    sunTrack: "rgba(255,255,255,0.18)",
    sunFill: "#FACC15",
    updateIcon: "#FACC15",
    windIcon: "#FACC15",
    humidityIcon: "#93C5FD",
  },
  "02d": {
    background: "linear-gradient(180deg, #64B5F6 0%, #B0BEC5 100%)",
    text: "#0F172A",
    mutedText: "#334155",
    icon: "#0F172A",
    panelBg: "rgba(255,255,255,0.18)",
    panelBorder: "rgba(15,23,42,0.18)",
    sunTrack: "rgba(15,23,42,0.18)",
    sunFill: "#FACC15",
    updateIcon: "#EAB308",
    windIcon: "#EAB308",
    humidityIcon: "#60A5FA",
  },
  "02n": {
    background: "linear-gradient(180deg, #334155 0%, #0F172A 100%)",
    text: "#F8FAFC",
    mutedText: "#CBD5E1",
    icon: "#F8FAFC",
    panelBg: "rgba(0,0,0,0.28)",
    panelBorder: "rgba(255,255,255,0.12)",
    sunTrack: "rgba(255,255,255,0.18)",
    sunFill: "#FACC15",
    updateIcon: "#FACC15",
    windIcon: "#FACC15",
    humidityIcon: "#93C5FD",
  },
  "03d": {
    background: "linear-gradient(180deg, #90A4AE 0%, #607D8B 100%)",
    text: "#FFFFFF",
    mutedText: "#E2E8F0",
    icon: "#FFFFFF",
    panelBg: "rgba(0,0,0,0.20)",
    panelBorder: "rgba(255,255,255,0.14)",
    sunTrack: "rgba(255,255,255,0.20)",
    sunFill: "#FACC15",
    updateIcon: "#FACC15",
    windIcon: "#FACC15",
    humidityIcon: "#93C5FD",
  },
  "03n": {
    background: "linear-gradient(180deg, #475569 0%, #1E293B 100%)",
    text: "#F8FAFC",
    mutedText: "#CBD5E1",
    icon: "#F8FAFC",
    panelBg: "rgba(0,0,0,0.28)",
    panelBorder: "rgba(255,255,255,0.12)",
    sunTrack: "rgba(255,255,255,0.18)",
    sunFill: "#FACC15",
    updateIcon: "#FACC15",
    windIcon: "#FACC15",
    humidityIcon: "#93C5FD",
  },
  "04d": {
    background: "linear-gradient(180deg, #78909C 0%, #455A64 100%)",
    text: "#FFFFFF",
    mutedText: "#E2E8F0",
    icon: "#FFFFFF",
    panelBg: "rgba(0,0,0,0.20)",
    panelBorder: "rgba(255,255,255,0.14)",
    sunTrack: "rgba(255,255,255,0.20)",
    sunFill: "#FACC15",
    updateIcon: "#FACC15",
    windIcon: "#FACC15",
    humidityIcon: "#93C5FD",
  },
  "04n": {
    background: "linear-gradient(180deg, #37474F 0%, #263238 100%)",
    text: "#F8FAFC",
    mutedText: "#CBD5E1",
    icon: "#F8FAFC",
    panelBg: "rgba(0,0,0,0.28)",
    panelBorder: "rgba(255,255,255,0.12)",
    sunTrack: "rgba(255,255,255,0.18)",
    sunFill: "#FACC15",
    updateIcon: "#FACC15",
    windIcon: "#FACC15",
    humidityIcon: "#93C5FD",
  },
  "09d": {
    background: "linear-gradient(180deg, #607D8B 0%, #37474F 100%)",
    text: "#FFFFFF",
    mutedText: "#E2E8F0",
    icon: "#FFFFFF",
    panelBg: "rgba(0,0,0,0.22)",
    panelBorder: "rgba(255,255,255,0.14)",
    sunTrack: "rgba(255,255,255,0.20)",
    sunFill: "#FACC15",
    updateIcon: "#FACC15",
    windIcon: "#FACC15",
    humidityIcon: "#93C5FD",
  },
  "09n": {
    background: "linear-gradient(180deg, #455A64 0%, #263238 100%)",
    text: "#F8FAFC",
    mutedText: "#CBD5E1",
    icon: "#F8FAFC",
    panelBg: "rgba(0,0,0,0.28)",
    panelBorder: "rgba(255,255,255,0.12)",
    sunTrack: "rgba(255,255,255,0.18)",
    sunFill: "#FACC15",
    updateIcon: "#FACC15",
    windIcon: "#FACC15",
    humidityIcon: "#93C5FD",
  },
  "10d": {
    background: "linear-gradient(180deg, #42A5F5 0%, #546E7A 100%)",
    text: "#FFFFFF",
    mutedText: "#E2E8F0",
    icon: "#FFFFFF",
    panelBg: "rgba(0,0,0,0.22)",
    panelBorder: "rgba(255,255,255,0.14)",
    sunTrack: "rgba(255,255,255,0.20)",
    sunFill: "#FACC15",
    updateIcon: "#FACC15",
    windIcon: "#FACC15",
    humidityIcon: "#93C5FD",
  },
  "10n": {
    background: "linear-gradient(180deg, #1E3A5F 0%, #263238 100%)",
    text: "#F8FAFC",
    mutedText: "#CBD5E1",
    icon: "#F8FAFC",
    panelBg: "rgba(0,0,0,0.28)",
    panelBorder: "rgba(255,255,255,0.12)",
    sunTrack: "rgba(255,255,255,0.18)",
    sunFill: "#FACC15",
    updateIcon: "#FACC15",
    windIcon: "#FACC15",
    humidityIcon: "#93C5FD",
  },
  "11d": {
    background: "linear-gradient(180deg, #37474F 0%, #000000 100%)",
    text: "#FFFFFF",
    mutedText: "#CBD5E1",
    icon: "#FFFFFF",
    panelBg: "rgba(0,0,0,0.28)",
    panelBorder: "rgba(255,255,255,0.12)",
    sunTrack: "rgba(255,255,255,0.18)",
    sunFill: "#FACC15",
    updateIcon: "#FACC15",
    windIcon: "#FACC15",
    humidityIcon: "#93C5FD",
  },
  "11n": {
    background: "linear-gradient(180deg, #263238 0%, #000000 100%)",
    text: "#FFFFFF",
    mutedText: "#CBD5E1",
    icon: "#FFFFFF",
    panelBg: "rgba(0,0,0,0.28)",
    panelBorder: "rgba(255,255,255,0.12)",
    sunTrack: "rgba(255,255,255,0.18)",
    sunFill: "#FACC15",
    updateIcon: "#FACC15",
    windIcon: "#FACC15",
    humidityIcon: "#93C5FD",
  },
  "13d": {
    background: "linear-gradient(180deg, #FFFFFF 0%, #CFD8DC 100%)",
    text: "#0F172A",
    mutedText: "#475569",
    icon: "#0F172A",
    panelBg: "rgba(255,255,255,0.22)",
    panelBorder: "rgba(15,23,42,0.16)",
    sunTrack: "rgba(15,23,42,0.16)",
    sunFill: "#FACC15",
    updateIcon: "#EAB308",
    windIcon: "#EAB308",
    humidityIcon: "#3B82F6",
  },
  "13n": {
    background: "linear-gradient(180deg, #ECEFF1 0%, #90A4AE 100%)",
    text: "#0F172A",
    mutedText: "#334155",
    icon: "#0F172A",
    panelBg: "rgba(255,255,255,0.16)",
    panelBorder: "rgba(15,23,42,0.16)",
    sunTrack: "rgba(15,23,42,0.16)",
    sunFill: "#FACC15",
    updateIcon: "#EAB308",
    windIcon: "#EAB308",
    humidityIcon: "#3B82F6",
  },
  "50d": {
    background: "linear-gradient(180deg, #CFD8DC 0%, #90A4AE 100%)",
    text: "#0F172A",
    mutedText: "#334155",
    icon: "#0F172A",
    panelBg: "rgba(255,255,255,0.16)",
    panelBorder: "rgba(15,23,42,0.16)",
    sunTrack: "rgba(15,23,42,0.16)",
    sunFill: "#FACC15",
    updateIcon: "#EAB308",
    windIcon: "#EAB308",
    humidityIcon: "#3B82F6",
  },
  "50n": {
    background: "linear-gradient(180deg, #B0BEC5 0%, #546E7A 100%)",
    text: "#FFFFFF",
    mutedText: "#E2E8F0",
    icon: "#FFFFFF",
    panelBg: "rgba(0,0,0,0.20)",
    panelBorder: "rgba(255,255,255,0.14)",
    sunTrack: "rgba(255,255,255,0.20)",
    sunFill: "#FACC15",
    updateIcon: "#FACC15",
    windIcon: "#FACC15",
    humidityIcon: "#93C5FD",
  },
};

const weatherIconsByIconCode: Record<WeatherIconCode, IconType> = {
  "01d": IoSunny,
  "01n": IoMoon,
  "02d": IoPartlySunny,
  "02n": IoPartlySunny,
  "03d": IoCloud,
  "03n": IoCloud,
  "04d": IoCloud,
  "04n": IoCloud,
  "09d": IoRainy,
  "09n": IoRainy,
  "10d": IoRainy,
  "10n": IoRainy,
  "11d": IoThunderstorm,
  "11n": IoThunderstorm,
  "13d": IoSnow,
  "13n": IoSnow,
  "50d": IoCloud,
  "50n": IoCloud,
};

interface IWeatherProps {
  weather: TWeather["oc_geo"] & TWeather["oc_atual"] & { dt_atualizacao: Date };
}

type Props = ComponentProps<"button"> & IWeatherProps;

function getWindAnimation(speedKmh: number) {
  if (speedKmh < 20) return "animate-spin-slow";
  if (speedKmh < 50) return "animate-spin-medium";
  return "animate-spin-fast";
}

export const MCardWeather: FC<Props> = ({
  weather,
  className,
  style,
  ...rest
}) => {
  const w = useMemo(() => weather, [weather]);

  const icon = w?.ls_clima?.[0]?.cd_icone as WeatherIconCode | undefined;
  const temp = Math.round(w?.qt_temperatura ?? 0);
  const humi = Math.round(w?.qt_umidade ?? 0);
  const windKmh = (w?.vl_vento ?? 0) * 3.6;
  const windLabel = windKmh.toFixed(1);
  const windAnimation = getWindAnimation(windKmh);
  const dateWeather = format(w?.dt_clima ?? new Date(), "dd/MM/yy HH:mm");
  const dateNextUpdateWeather = format(
    w?.dt_atualizacao ?? new Date(),
    "HH:mm:ss",
  );

	const { handleOpenWeatherTab } = useMApp();

  const weatherDescription = useMemo(() => {
    return w?.ls_clima?.map((i) => i.ds_clima).join(", ");
  }, [w]);

  const [now, setNow] = useState<Date>(new Date());

  const dayPerc = useMemo(() => {
    try {
      const sunrise = new Date(w.dt_nascersol).getTime();
      const sunset = new Date(w.dt_porsol).getTime();
      const _now = now.getTime();

      if (Number.isNaN(sunrise) || Number.isNaN(sunset) || Number.isNaN(_now)) {
        return undefined;
      }

      if (_now < sunrise || _now > sunset) {
        return undefined;
      }

      const total = sunset - sunrise;
      const elapsed = _now - sunrise;

      if (total <= 0) return undefined;

      return (elapsed / total) * 100;
    } catch {
      return undefined;
    }
  }, [w, now]);

  const { hSunrise, hSunset } = useMemo(() => {
    return {
      hSunrise: format(w?.dt_nascersol ?? new Date(), "HH:mm"),
      hSunset: format(w?.dt_porsol ?? new Date(), "HH:mm"),
    };
  }, [w]);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const theme = (icon && weatherThemeByIcon[icon]) ?? {
    background: "linear-gradient(180deg, #64748B 0%, #334155 100%)",
    text: "#F8FAFC",
    mutedText: "#CBD5E1",
    icon: "#F8FAFC",
    panelBg: "rgba(0,0,0,0.28)",
    panelBorder: "rgba(255,255,255,0.12)",
    sunTrack: "rgba(255,255,255,0.18)",
    sunFill: "#FACC15",
    updateIcon: "#FACC15",
    windIcon: "#FACC15",
    humidityIcon: "#93C5FD",
  };

  const MIcon = (icon && weatherIconsByIconCode[icon]) ?? IoCloud;

  return (
    <button
      {...rest}
			onClick={handleOpenWeatherTab}
      className={`flex w-full h-full p-2 select-none cursor-pointer  ${className ?? ""}`}
      style={{
        ...style,
        background: theme.background,
        color: theme.text,
      }}
    >
      <div className="flex flex-col w-full h-full items-center justify-between gap-3">
        <div className="flex flex-col gap-1 leading-none items-center">
          <h1
            className="text-sm font-bold leading-none text-center"
            style={{ color: theme.text }}
          >
            {`${w?.nm_cidade} - ${w?.nm_estado}`}
          </h1>

          <div
            className="flex text-xs leading-none items-center"
            style={{ color: theme.mutedText }}
          >
            <h2>{dateWeather}</h2>
            <div className="mx-1">|</div>
            <GrUpdate style={{ color: theme.updateIcon }} />
            <h2 className="font-bold ml-1">{dateNextUpdateWeather}</h2>
          </div>
        </div>

        <div className="flex-1 flex w-full flex-row justify-between">
          <div className="flex gap-1 w-full leading-none items-end">
            <div
              className="flex p-2 rounded-full"
              style={{
                background: theme.panelBg,
                border: `1px solid ${theme.panelBorder}`,
              }}
            >
              <MIcon className="size-6" style={{ color: theme.icon }} />
            </div>

            <div className="flex flex-col w-full leading-none">
              <div className="flex w-full">
                <h1
                  className="leading-none  font-bold text-2xl"
                  style={{ color: theme.text }}
                >
                  {temp}
                </h1>

                <h2 className="text-xs" style={{ color: theme.mutedText }}>
                  ºC
                </h2>

                <div className="flex flex-col w-full ml-2 ">
                  <div className="flex w-full leading-none text-xxs justify-between items-center px-1">
                    <h1>{hSunrise}</h1>
                    <h1>{hSunset}</h1>
                  </div>

                  <div className="flex my-auto w-full justify-between items-center">
                    <WiSunrise
                      className={`size-6 ${dayPerc === undefined ? "opacity-20" : ""}`}
                      style={{ color: theme.icon }}
                    />

                    <div
                      className={`relative w-full h-1 ${dayPerc === undefined ? "opacity-20" : ""}`}
                    >
                      <div
                        className="absolute h-full w-full rounded-full"
                        style={{ background: theme.sunTrack }}
                      />
                      <div
                        className="absolute h-full rounded-full"
                        style={{
                          background: theme.sunFill,
                          width: `${dayPerc ?? 0}%`,
                        }}
                      />
                    </div>

                    <WiSunset
                      className={`size-6 ${dayPerc === undefined ? "opacity-20" : ""}`}
                      style={{ color: theme.icon }}
                    />
                  </div>
                </div>
              </div>

              <span
                className="text-xxs uppercase mr-auto"
                style={{ color: theme.mutedText }}
              >
                {weatherDescription}
              </span>
            </div>
          </div>
        </div>

        <div className="flex w-full justify-between gap-2">
          <div
            className="flex leading-none py-0.5 px-1.5 rounded"
            style={{
              background: theme.panelBg,
              border: `1px solid ${theme.panelBorder}`,
              color: theme.text,
            }}
          >
            <TbWindmillFilled
              className={`size-4 mt-auto ${windAnimation}`}
              style={{ color: theme.windIcon }}
            />
            <div className="w-3" />
            <h1 className="mt-auto font-bold leading-none">{windLabel}</h1>
            <h2
              className="mt-auto text-xs leading-none ml-0.5"
              style={{ color: theme.mutedText }}
            >
              km/h
            </h2>
          </div>

          <div
            className="flex leading-none py-0.5 px-1.5 rounded"
            style={{
              background: theme.panelBg,
              border: `1px solid ${theme.panelBorder}`,
              color: theme.text,
            }}
          >
            <FaDroplet
              className="size-3 my-auto"
              style={{ color: theme.humidityIcon }}
            />
            <div className="w-3" />
            <h1 className="mt-auto font-bold leading-none">{humi}</h1>
            <h2
              className="mt-auto text-xs leading-none ml-0.5"
              style={{ color: theme.mutedText }}
            >
              %
            </h2>
          </div>
        </div>
      </div>
    </button>
  );
};
