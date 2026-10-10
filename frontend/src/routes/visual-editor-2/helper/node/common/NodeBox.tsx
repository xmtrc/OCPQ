import type { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import NodeHandle from "@/routes/visual-editor-2/helper/node/common/NodeHandle.tsx";
import { cn } from "@/lib/utils.ts";

const nodeBoxVariants = cva(
	"border-2 shadow-lg text-sm text-start z-10 flex flex-col rounded-md relative min-h-20 transition duration-200",
	{
		variants: {
			flavor: {
				event: "bg-blue-50",
				object: "bg-green-50",
				subquery: "bg-red-50",
			},
			selected: {
				true: "border-dashed",
			},
		},
	},
);

interface NodeBoxProps extends VariantProps<typeof nodeBoxVariants> {
	id: string;
	color?: string;
	isDisabled: boolean;
	isHandleOnTop: boolean;
	className?: string;
	children: ReactNode;
}

export default function NodeBox({
	id,
	flavor,
	selected,
	isDisabled,
	color,
	isHandleOnTop,
	className,
	children,
}: NodeBoxProps) {
	return (
		<div
			className={cn(
				nodeBoxVariants({ flavor, selected }),
				color,
				isDisabled && "bg-gray-200",
				className,
			)}
		>
			<NodeHandle id={id} isOnTop={isHandleOnTop} />
			{children}
		</div>
	);
}
