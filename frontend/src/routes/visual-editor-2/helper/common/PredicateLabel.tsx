import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils.ts";
import { predicateTypeShortLabels } from "@/routes/visual-editor-2/helper/const.ts";
import type { PredicateMode, PredicateType } from "@/routes/visual-editor-2/helper/types.ts";

export const PredicateLabelVariants = cva(
	"flex items-center font-semibold text-sm w-fit min-w-6 h-6 px-2 rounded-full transition duration-200",
	{
		variants: {
			flavor: {
				e2o: "bg-blue-100 hover:bg-blue-200",
				o2o: "bg-green-100 hover:bg-green-200",
				tbe: "bg-yellow-100 hover:bg-yellow-200",
				ear: "bg-yellow-100 hover:bg-yellow-200",
				oar: "bg-yellow-100 hover:bg-yellow-200",
				cbs: "bg-yellow-100 hover:bg-yellow-200",
				cbe: "bg-orange-100 hover:bg-orange-200",
				allsat: "bg-yellow-100 hover:bg-yellow-200",
				anysat: "bg-yellow-100 hover:bg-yellow-200",
				nonesat: "bg-yellow-100 hover:bg-yellow-200",
				oranysat: "bg-yellow-100 hover:bg-yellow-200",
			},
		},
	},
);

interface PredicateLabelProps extends VariantProps<typeof PredicateLabelVariants> {
	type: PredicateType;
	mode?: PredicateMode;
	color?: string;
	label?: string;
}

export default function PredicateLabel({ type, mode, flavor, color, label }: PredicateLabelProps) {
	return (
		<div className={cn(PredicateLabelVariants({ flavor }), color)}>
			{predicateTypeShortLabels[type]} {mode}
			{label && `: ${label}`}
		</div>
	);
}
