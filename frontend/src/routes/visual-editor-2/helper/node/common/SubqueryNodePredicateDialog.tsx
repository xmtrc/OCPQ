import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog.tsx";
import type {
	EdgeDataTypes,
	NodeDataTypes,
	SubqueryNodePredicate,
} from "@/routes/visual-editor-2/helper/flowTypes.ts";
import { PredicateMode, PredicateType } from "@/routes/visual-editor-2/helper/types.ts";
import {
	defaultNodePredicateData,
	EVENT_NODE_TYPE,
	OBJECT_NODE_TYPE,
	predicateTypeLabels,
	predicateTypeShortLabels,
} from "@/routes/visual-editor-2/helper/const.ts";
import {
	CardTypeSelector,
	type CardTypeSelectorOption,
} from "@/components/ui/card-type-selector.tsx";
import { LuCheckCheck, LuHash } from "react-icons/lu";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Combobox } from "@/components/ui/combobox.tsx";
import { type Edge, type Node, useReactFlow } from "@xyflow/react";

interface SubqueryNodePredicateDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSave: () => void;
	nodePredicateDraft: SubqueryNodePredicate;
	setNodePredicateDraft: (nodePredicate: SubqueryNodePredicate) => void;
}

function disableSaveButton(nodePredicateDraft: SubqueryNodePredicate) {
	if (nodePredicateDraft.type === PredicateType.ChildBindingSetSize) {
		if (
			nodePredicateDraft.min !== null &&
			nodePredicateDraft.max !== null &&
			nodePredicateDraft.min > nodePredicateDraft.max
		) {
			return true;
		}
		if (nodePredicateDraft.min !== null && nodePredicateDraft.min < 0) {
			return true;
		}
		if (nodePredicateDraft.max !== null && nodePredicateDraft.max < 0) {
			return true;
		}
		if (nodePredicateDraft.projected && !nodePredicateDraft.projectedNodeId) {
			return true;
		}
	}
	return false;
}

export default function SubqueryNodePredicateDialog({
	open,
	onOpenChange,
	onSave,
	nodePredicateDraft,
	setNodePredicateDraft,
}: SubqueryNodePredicateDialogProps) {
	type SubqueryPredicateType = SubqueryNodePredicate["type"];
	const instance = useReactFlow<Node<NodeDataTypes>, Edge<EdgeDataTypes>>();
	// TODO: Only allow nodes in same box or above
	const nodes = instance
		.getNodes()
		.filter((node) => node.type === EVENT_NODE_TYPE || node.type === OBJECT_NODE_TYPE);
	const nodeOptions = nodes.map((node) => ({
		value: node.id,
		label: node.data.displayName ?? node.id,
	}));

	const options: CardTypeSelectorOption<SubqueryPredicateType>[] = [
		{
			title: predicateTypeLabels[PredicateType.ChildBindingSetSize],
			value: PredicateType.ChildBindingSetSize,
			description: "Number of child bindings",
			icon: <LuHash className="w-4 h-4" />,
		},
		{
			title: predicateTypeLabels[PredicateType.AllSatisfied],
			value: PredicateType.AllSatisfied,
			description: "All child bindings satisfied",
			icon: <LuCheckCheck className="w-4 h-4" />,
		},
		{
			title: predicateTypeLabels[PredicateType.AnySatisfied],
			value: PredicateType.AnySatisfied,
			description: "At least one child binding satisfied",
			icon: <span className="w-4 h-4 font-bold text-xs">∨</span>,
		},
		{
			title: predicateTypeLabels[PredicateType.NoneSatisfied],
			value: PredicateType.NoneSatisfied,
			description: "No child bindings satisfied",
			icon: <span className="w-4 h-4 font-bold text-xs">!</span>,
		},
	];

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent
				onContextMenuCapture={(ev) => {
					ev.stopPropagation();
				}}
			>
				<AlertDialogHeader>
					<AlertDialogTitle>
						{!nodePredicateDraft.isInitialized ? "Add" : "Edit"} Predicate
					</AlertDialogTitle>
					<AlertDialogDescription>
						{!nodePredicateDraft.isInitialized
							? "Choose the type of predicate and configure it."
							: ""}
					</AlertDialogDescription>
					<div className="text-sm text-muted-foreground">
						{!nodePredicateDraft.isInitialized && (
							<CardTypeSelector
								options={options}
								value={nodePredicateDraft.type}
								onValueChange={(newPredicateType: SubqueryPredicateType) => {
									setNodePredicateDraft(defaultNodePredicateData[newPredicateType]());
								}}
							/>
						)}
						{nodePredicateDraft.type === PredicateType.ChildBindingSetSize ? (
							<>
								<span>
									Configure {predicateTypeShortLabels[nodePredicateDraft.type]}{" "}
									{nodePredicateDraft.mode}
								</span>
								<ToggleGroup
									className="justify-start mb-3 mt-1"
									type="single"
									value={nodePredicateDraft.mode}
									onValueChange={(v) => {
										if (v && nodePredicateDraft.type === PredicateType.ChildBindingSetSize) {
											setNodePredicateDraft({
												...nodePredicateDraft,
												mode: v as PredicateMode,
											});
										}
									}}
								>
									<ToggleGroupItem value={PredicateMode.Filter} variant={"outline"}>
										Filter
									</ToggleGroupItem>
									<ToggleGroupItem value={PredicateMode.Constraint} variant={"outline"}>
										Constraint
									</ToggleGroupItem>
								</ToggleGroup>
								<div className="flex items-center gap-2">
									<Input
										title="Minimum (Optional)"
										placeholder="Minimum (Optional)"
										type="number"
										step={1}
										min={0}
										value={nodePredicateDraft.min ?? ""}
										onChange={(ev) => {
											const val = ev.currentTarget.valueAsNumber;
											setNodePredicateDraft({
												...nodePredicateDraft,
												min: Number.isFinite(val) ? Math.round(val) : null,
											});
										}}
										className="user-invalid:border-red-500! user-invalid:bg-red-100!"
									/>
									{"-"}
									<Input
										title="Maximum (Optional)"
										placeholder="Maximum (Optional)"
										type="number"
										step={1}
										min={nodePredicateDraft.min ?? 0}
										value={nodePredicateDraft.max ?? ""}
										onChange={(ev) => {
											const val = ev.currentTarget.valueAsNumber;
											setNodePredicateDraft({
												...nodePredicateDraft,
												max: Number.isFinite(val) ? Math.round(val) : null,
											});
										}}
										className="user-invalid:border-red-500! user-invalid:bg-red-100!"
									/>
								</div>
								<span>Project this {nodePredicateDraft.mode} to a child set.</span>
								<ToggleGroup
									className="justify-start my-3"
									type="single"
									value={nodePredicateDraft.projected ? "true" : "false"}
									onValueChange={(v) =>
										setNodePredicateDraft({
											...nodePredicateDraft,
											projected: v === "true",
											projectedNodeId: undefined,
										})
									}
								>
									<ToggleGroupItem value={"true"} variant={"outline"}>
										Projected
									</ToggleGroupItem>
									<ToggleGroupItem value={"false"} variant={"outline"}>
										Not Projected
									</ToggleGroupItem>
								</ToggleGroup>
								<Combobox
									options={nodeOptions}
									disabled={!nodePredicateDraft.projected}
									onChange={(newNode) =>
										setNodePredicateDraft({
											...nodePredicateDraft,
											projectedNodeId: newNode || undefined,
										})
									}
									name={"Bind to Node"}
									value={nodePredicateDraft.projectedNodeId ?? ""}
								/>
							</>
						) : (
							<span>
								The {predicateTypeLabels[nodePredicateDraft.type]} predicate is only available as a{" "}
								{nodePredicateDraft.mode}.
							</span>
						)}
					</div>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction disabled={disableSaveButton(nodePredicateDraft)} onClick={onSave}>
						Save
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
