import { Message } from "ai";
import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export type MessageActions = {
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
};
