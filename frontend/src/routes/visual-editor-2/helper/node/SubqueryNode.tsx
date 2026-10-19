import { type Node, type NodeProps, NodeResizeControl } from "@xyflow/react";
import type {
	SubqueryNodeData,
	SubqueryNodePredicate,
} from "@/routes/visual-editor-2/helper/flowTypes.ts";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuPortal,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useContext, useRef, useState } from "react";
import {
	defaultNodeData,
	defaultNodePredicateData,
	EVENT_NODE_TYPE,
	OBJECT_NODE_TYPE,
	predicateTypeShortLabels,
	SUBQUERY_NODE_TYPE,
} from "@/routes/visual-editor-2/helper/const.ts";
import { LuMoveDiagonal2, LuTrash } from "react-icons/lu";
import { VisualEditorContext } from "@/routes/visual-editor-2/helper/VisualEditorContext.tsx";
import RenameNodeDialog from "@/routes/visual-editor-2/helper/node/common/RenameNodeDialog.tsx";
import DeleteDialog from "@/routes/visual-editor-2/helper/common/DeleteDialog.tsx";
import NodeBox from "@/routes/visual-editor-2/helper/node/common/NodeBox.tsx";
import { cn } from "@/lib/utils.ts";
import { PredicateType } from "@/routes/visual-editor-2/helper/types.ts";
import SubqueryNodePredicateDialog from "@/routes/visual-editor-2/helper/node/common/SubqueryNodePredicateDialog.tsx";
import PredicateLabel from "@/routes/visual-editor-2/helper/common/PredicateLabel.tsx";

function getPredicateLabel(predicate: SubqueryNodePredicate) {
	if (predicate.type === PredicateType.ChildBindingSetSize) {
		if (predicate.min !== null && predicate.max !== null) {
			return `[${predicate.min} - ${predicate.max}]`;
		} else if (predicate.min === null && predicate.max !== null) {
			return `[max ${predicate.max}]`;
		} else if (predicate.min !== null && predicate.max === null) {
			return `[min ${predicate.min}]`;
		}
	}
	return "";
}

function getFlavor(predicate: SubqueryNodePredicate) {
	switch (predicate.type) {
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

export default function SubqueryNode({ data, id, selected }: NodeProps<Node<SubqueryNodeData>>) {
	const { addNewNode, onNodeDataChange } = useContext(VisualEditorContext);

	type OpenDialog = "rename" | "delete" | "predicateEdit" | "predicateDelete" | undefined;
	const [dialog, setDialog] = useState<OpenDialog>(undefined);

	const [predicateDraft, setPredicateDraft] = useState<SubqueryNodePredicate>(
		defaultNodePredicateData[PredicateType.ChildBindingSetSize](),
	);

	const contextMenuPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

	return (
		<NodeBox
			id={id}
			flavor="subquery"
			selected={selected}
			color={data.color}
			isHandleOnTop={data.isHandleOnTop}
			isDisabled={data.isDisabled}
			className="w-full h-full min-w-60"
		>
			<NodeResizeControl
				className={cn(
					"flex justify-center items-center p-1.5 bg-red-100! hover:bg-red-200! transition",
					data.isDisabled && "bg-gray-300!",
				)}
				style={{
					border: "none",
					borderRadius: "100%",
					width: 24,
					height: 24,
					translate: "-166% -166%",
				}}
				minWidth={240}
				minHeight={80}
				autoScale={false}
			>
				<LuMoveDiagonal2 className="text-gray-600" />
			</NodeResizeControl>
			<div className="flex flex-col-reverse items-end absolute w-full bottom-full pb-0.5 nodrag -z-2">
				{data.predicates.map((predicate) => {
					return (
						<ContextMenu key={predicate.id}>
							<ContextMenuTrigger>
								<button
									onClick={() => {
										setTimeout(() => {
											if (predicate.type === PredicateType.ChildBindingSetSize) {
												setPredicateDraft(predicate);
												setDialog("predicateEdit");
											}
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
								{predicate.type === PredicateType.ChildBindingSetSize && (
									<>
										<ContextMenuItem
											onSelect={() => {
												setTimeout(() => {
													setPredicateDraft(predicate);
													setDialog("predicateEdit");
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
											setPredicateDraft(predicate);
											setDialog("predicateDelete");
										}, 100);
									}}
								>
									<LuTrash className="mr-1" /> Delete {predicateTypeShortLabels[predicate.type]}{" "}
									{predicate.mode}
								</ContextMenuItem>
							</ContextMenuContent>
						</ContextMenu>
					);
				})}
			</div>
			<ContextMenu>
				<ContextMenuTrigger
					onContextMenu={(ev) => {
						ev.stopPropagation();
						contextMenuPos.current = { x: ev.clientX, y: ev.clientY };
					}}
					className="flex flex-col justify-between h-full w-full p-4"
				>
					<div className="flex justify-between border-b pb-2">
						<div className="font-semibold">{data.displayName}</div>
					</div>
					<div className="border-t pt-2 text-gray-600 font-semibold text-xs">
						<div>Labels:</div>
						<div>CEL:</div>
						<div>CEL+:</div>
					</div>
				</ContextMenuTrigger>
				<ContextMenuPortal>
					<ContextMenuContent>
						<div className="text-gray-300 text-xs font-semibold px-2 pt-1">
							Filters and Constraints
						</div>
						<ContextMenuItem
							onSelect={() => {
								setTimeout(() => {
									setPredicateDraft(defaultNodePredicateData[PredicateType.ChildBindingSetSize]());
									setDialog("predicateEdit");
								}, 100);
							}}
						>
							Add Predicate
						</ContextMenuItem>
						<div className="border-t my-1 mx-2"></div>
						<div className="text-gray-300 text-xs font-semibold px-2 pt-1">Add Nodes</div>
						<ContextMenuItem
							onClick={() => {
								addNewNode(EVENT_NODE_TYPE, contextMenuPos.current, id);
							}}
						>
							Add Event Node
						</ContextMenuItem>
						<ContextMenuItem
							onClick={() => {
								addNewNode(OBJECT_NODE_TYPE, contextMenuPos.current, id);
							}}
						>
							Add Object Node
						</ContextMenuItem>
						<ContextMenuItem
							onClick={() => {
								addNewNode(SUBQUERY_NODE_TYPE, contextMenuPos.current, id);
							}}
						>
							Add Subquery Node
						</ContextMenuItem>
						<div className="border-t my-1 mx-2"></div>
						<div className="text-gray-300 text-xs font-semibold px-2 pt-1">Edit Node</div>
						<ContextMenuItem
							onSelect={() => {
								setTimeout(() => {
									setDialog("rename");
								}, 100);
							}}
						>
							Rename Node
						</ContextMenuItem>
						<div className="border-t my-1 mx-2"></div>
						<ContextMenuItem>Cancel</ContextMenuItem>
						<ContextMenuItem
							onSelect={() => {
								setTimeout(() => {
									setDialog("delete");
								}, 100);
							}}
							className="font-semibold text-red-400 focus:text-red-500"
						>
							<LuTrash className="mr-1" /> Delete Subquery Node
						</ContextMenuItem>
					</ContextMenuContent>
				</ContextMenuPortal>
			</ContextMenu>
			<SubqueryNodePredicateDialog
				open={dialog === "predicateEdit"}
				onOpenChange={(open: boolean) => !open && setDialog(undefined)}
				onSave={() => {
					if (predicateDraft.isInitialized) {
						onNodeDataChange(id, {
							predicates: data.predicates.map((predicate) =>
								predicate.id === predicateDraft.id ? predicateDraft : predicate,
							),
						});
					} else {
						const savePredicate = {
							...predicateDraft,
							isInitialized: true,
						} satisfies SubqueryNodePredicate;
						onNodeDataChange(id, {
							predicates: [...data.predicates, savePredicate],
						});
					}
				}}
				nodePredicateDraft={predicateDraft}
				setNodePredicateDraft={setPredicateDraft}
			/>
			<RenameNodeDialog
				open={dialog === "rename"}
				initialName={data.displayName ?? ""}
				defaultName={defaultNodeData[SUBQUERY_NODE_TYPE]().displayName}
				onOpenChange={(open) => !open && setDialog(undefined)}
				onRename={(newName) => {
					onNodeDataChange(id, {
						displayName: newName,
					});
				}}
			/>
			<DeleteDialog
				open={dialog === "delete"}
				toBeDeleted={`node "${data.displayName || defaultNodeData[SUBQUERY_NODE_TYPE]().displayName}"`}
				additionalDescription="All nodes inside it will also be deleted."
				onOpenChange={(open) => !open && setDialog(undefined)}
				onDelete={() => onNodeDataChange(id, undefined)}
			/>
			<DeleteDialog
				open={dialog === "predicateDelete"}
				toBeDeleted={`${predicateTypeShortLabels[predicateDraft.type]} ${predicateDraft.mode}`}
				onOpenChange={(open) => !open && setDialog(undefined)}
				onDelete={() => {
					onNodeDataChange(id, {
						predicates: data.predicates.filter((predicate) => predicate.id !== predicateDraft.id),
					});
				}}
			/>
		</NodeBox>
	);
}
