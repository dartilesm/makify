import { type Message } from "ai";
import { type LucideProps } from "lucide-react";
import { type ForwardRefExoticComponent, type RefAttributes } from "react";

export interface MessageActions {
  Icon: ForwardRefExoticComponent<LucideProps & RefAttributes<SVGSVGElement>>;
  SucessIcon?: ForwardRefExoticComponent<
    LucideProps & RefAttributes<SVGSVGElement>
  >;
  active?: {
    Icon: ForwardRefExoticComponent<LucideProps & RefAttributes<SVGSVGElement>>;
    condition: (message: Message) => boolean;
  };
  getLabel: (message: Message) => string;
  value: string;
  onlyLastMessage?: boolean;
}
