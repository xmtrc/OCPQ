import { cva, type VariantProps } from "class-variance-authority";
import { LuPencil } from "react-icons/lu";
import { cn } from "@/lib/utils.ts";

const nodeEditButtonVariants = cva(
	"flex ml-auto self-end justify-center items-center size-6 rounded-full p-1.5 transition duration-200",
	{
		variants: {
			flavor: {
				event: "bg-blue-100 hover:bg-blue-200",
				object: "bg-green-100 hover:bg-green-200",
			},
			isDisabled: {
				true: "bg-gray-300",
			},
		},
	},
);

interface NodeEditButtonProps extends VariantProps<typeof nodeEditButtonVariants> {
	onClick: () => void;
}

export default function NodeEditButton({ flavor, onClick, isDisabled }: NodeEditButtonProps) {
	return (
		<button
			className={cn(nodeEditButtonVariants({ flavor, isDisabled }))}
			onClick={() => {
				setTimeout(() => {
					onClick();
				}, 100);
			}}
		>
			<LuPencil className="text-gray-600" />
		</button>
	);
}
