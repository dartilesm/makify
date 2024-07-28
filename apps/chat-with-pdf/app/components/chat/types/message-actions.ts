import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export type MessageActions = {
  Icon: ForwardRefExoticComponent<LucideProps & RefAttributes<SVGSVGElement>>;
  SucessIcon?: ForwardRefExoticComponent<
    LucideProps & RefAttributes<SVGSVGElement>
  >;
  label: string;
  value: string;
  onlyLastMessage?: boolean;
};
