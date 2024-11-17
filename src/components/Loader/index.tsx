import React from "react";
import Loader from "react-js-loader";

interface ILoaderProps {
    type:
        | "box-rotate-x"
        | "box-rotate-y"
        | "box-rotate-z"
        | "box-rectangular"
        | "ping-cube"
        | "heart"
        | "bubble-scale"
        | "bubble-top"
        | "bubble-ping"
        | "bubble-spin"
        | "spinner-cub"
        | "spinner-circle"
        | "spinner-default"
        | "ekvalayzer"
        | "hourglass"
        | "rectangular-ping";
    size: number;
    bgColor: string;
    color: string;
}

const CustomLoader: React.FC<ILoaderProps> = ({
    type = "spinner-defaul",
    size = 250,
    bgColor = "#009688",
    color = "#00968850",
}) => {
    return <Loader type={type} bgColor={bgColor} color={color} size={size} />;
};

export default CustomLoader;
