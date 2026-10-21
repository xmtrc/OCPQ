import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "@/components/ui/context-menu.tsx";
import PredicateLabel from "@/routes/visual-editor-2/helper/common/PredicateLabel.tsx";
import { predicateTypeShortLabels } from "@/routes/visual-editor-2/helper/const.ts";
import { LuTrash } from "react-icons/lu";
import type { NodePredicateTypes } from "@/routes/visual-editor-2/helper/flowTypes.ts";
import { PredicateType } from "@/routes/visual-editor-2/helper/types.ts";

interface NodePredicateLabelProps {
	predicate: NodePredicateTypes;
	disableEdit: boolean;
	onEdit: () => void;
	onDelete: () => void;
}

function getPredicateLabel(predicate: NodePredicateTypes) {
	switch (predicate.type) {
		case PredicateType.EventAttributeRange:
			return predicate.attribute;
		case PredicateType.ObjectAttributeRange:
			return predicate.attribute;
		case PredicateType.ChildBindingSetSize:
			if (predicate.min !== null && predicate.max !== null) {
				return `[${predicate.min} - ${predicate.max}]`;
			} else if (predicate.min === null && predicate.max !== null) {
				return `[max ${predicate.max}]`;
			} else if (predicate.min !== null && predicate.max === null) {
				return `[min ${predicate.min}]`;
			}
			return undefined;
		default:
			return undefined;
	}
}

function getFlavor(predicate: NodePredicateTypes) {
	switch (predicate.type) {
		case PredicateType.EventAttributeRange:
			return "ear";
		case PredicateType.ObjectAttributeRange:
			return "oar";
		case PredicateType.ChildBindingSetSize:
			return "cbs";
		case PredicateType.AllSatisfied:
			return "allsat";
		case PredicateType.AnySatisfied:
			return "anysat";
		case PredicateType.NoneSatisfied:
			return "nonesat";
		default:
			return undefined;
	}
}

export default function NodePredicateLabel({
	predicate,
	disableEdit,
	onEdit,
	onDelete,
}: NodePredicateLabelProps) {
	return (
		<ContextMenu>
			<ContextMenuTrigger>
				<button
					onClick={() => {
						!disableEdit &&
							setTimeout(() => {
								onEdit();
							}, 100);
					}}
				>
					<PredicateLabel
						type={predicate.type}
						mode={predicate.mode}
						color={predicate.color}
						label={getPredicateLabel(predicate)}
						flavor={getFlavor(predicate)}
					/>
				</button>
			</ContextMenuTrigger>
			<ContextMenuContent>
				{!disableEdit && (
					<>
						<ContextMenuItem
							onSelect={() => {
								setTimeout(() => {
									onEdit();
								}, 100);
							}}
						>
							Edit {predicateTypeShortLabels[predicate.type]} {predicate.mode}
						</ContextMenuItem>
						<div className="border-t my-1 mx-2"></div>
					</>
				)}
				<ContextMenuItem>Cancel</ContextMenuItem>
				<ContextMenuItem
					className="font-semibold text-red-400 focus:text-red-500"
					onSelect={() => {
						setTimeout(() => {
							onDelete();
						}, 100);
					}}
				>
					<LuTrash className="mr-1" /> Delete {predicateTypeShortLabels[predicate.type]}{" "}
					{predicate.mode}
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
}
