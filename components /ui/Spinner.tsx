import Lottie from "lottie-react";
import spinnerLight from "@/assets/animations/spinner-light.json";
import spinnerDark from "@/assets/animations/spinner-dark.json";

type SpinnerProps = {
  variant?: "light" | "dark"
  className?: string,
}

const spinnerVariants = {
  light: spinnerLight,
  dark: spinnerDark,
}

export function Spinner({className, variant = "light"}: SpinnerProps) {
  return (
    <Lottie
            animationData={spinnerVariants[variant]}
            loop
            autoplay
            className={className}
          />
  )
}