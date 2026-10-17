import type { Node, NodeProps } from "@xyflow/react";
import type {
	EventNodeData,
	EventNodePredicate,
} from "@/routes/visual-editor-2/helper/flowTypes.ts";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuPortal,
	ContextMenuTrigger,
} from "@/components/ui/context-menu.tsx";
import { LuTrash } from "react-icons/lu";
import { useContext, useState } from "react";
import { VisualEditorContext } from "@/routes/visual-editor-2/helper/VisualEditorContext.tsx";
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
import { ActivityChooser } from "@r4pm/components";
import { R4pmIsland } from "@/components/r4pm/R4pmIsland.tsx";
import { useOcelStats } from "@/hooks";
import RenameNodeDialog from "@/routes/visual-editor-2/helper/node/common/RenameNodeDialog.tsx";
import {
	defaultNodeData,
	defaultNodePredicateData,
	EVENT_NODE_TYPE,
	predicateTypeShortLabels,
} from "@/routes/visual-editor-2/helper/const.ts";
import DeleteDialog from "@/routes/visual-editor-2/helper/common/DeleteDialog.tsx";
import NodeBox from "@/routes/visual-editor-2/helper/node/common/NodeBox.tsx";
import NodeEditButton from "@/routes/visual-editor-2/helper/node/common/NodeEditButton.tsx";
import { PredicateType } from "@/routes/visual-editor-2/helper/types.ts";
import AttributeRangeDialog from "@/routes/visual-editor-2/helper/node/common/AttributeRangeDialog.tsx";
import type { OCELTypeAttribute } from "@/types/ocel.ts";
import PredicateLabel from "@/routes/visual-editor-2/helper/common/PredicateLabel.tsx";

export default function EventNode({ data, id, selected }: NodeProps<Node<EventNodeData>>) {
	const { onNodeDataChange, ocelInfo } = useContext(VisualEditorContext);
	const ocelStats = useOcelStats();

	type OpenDialog = "edit" | "rename" | "delete" | "earEdit" | "earDelete" | undefined;
	const [dialog, setDialog] = useState<OpenDialog>(undefined);

	const [editTypes, setEditTypes] = useState<string[]>(data.eventTypes);
	const [earDraft, setEarDraft] = useState<EventNodePredicate>(
		defaultNodePredicateData[PredicateType.EventAttributeRange](),
	);

	function getOcelEventAttributes() {
		const ocelAttributes: OCELTypeAttribute[] = [
			{ name: "ocel:id", type: "string" },
			{ name: "ocel:time", type: "time" },
		];
		for (const eventType of data.eventTypes) {
			const ocelType = ocelInfo?.event_types.find(
				(ocelEventType) => ocelEventType.name === eventType,
			);
			if (!ocelType) continue;
			for (const ocelTypeAttribute of ocelType.attributes) {
				!ocelAttributes.find((ocelAttribute) => ocelAttribute.name === ocelTypeAttribute.name) &&
					ocelAttributes.push(ocelTypeAttribute);
			}
		}
		return ocelAttributes;
	}

	return (
		<NodeBox
			id={id}
			flavor="event"
			selected={selected}
			color={data.color}
			isHandleOnTop={data.isHandleOnTop}
			isDisabled={data.isDisabled}
			className="w-52"
		>
			<div className="flex flex-col-reverse items-end absolute w-full bottom-full pb-0.5 nodrag -z-2">
				{data.predicates.map((predicate) => {
					return (
						<ContextMenu key={predicate.id}>
							<ContextMenuTrigger>
								<button
									onClick={() => {
										setTimeout(() => {
											setEarDraft(predicate);
											setDialog("earEdit");
										}, 100);
									}}
								>
									<PredicateLabel
										type={predicate.type}
										mode={predicate.mode}
										color={predicate.color}
										label={predicate.attribute}
										flavor="ear"
									/>
								</button>
							</ContextMenuTrigger>
							<ContextMenuContent>
								<ContextMenuItem
									onSelect={() => {
										setTimeout(() => {
											setEarDraft(predicate);
											setDialog("earEdit");
										}, 100);
									}}
								>
									Edit {predicateTypeShortLabels[predicate.type]} {predicate.mode}
								</ContextMenuItem>
								<div className="border-t my-1 mx-2"></div>
								<ContextMenuItem>Cancel</ContextMenuItem>
								<ContextMenuItem
									className="font-semibold text-red-400 focus:text-red-500"
									onSelect={() => {
										setTimeout(() => {
											setEarDraft(predicate);
											setDialog("earDelete");
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
					}}
					className="h-full w-full p-4"
				>
					<div className="flex justify-between border-b pb-2">
						<div className="font-semibold">{data.displayName}</div>
					</div>
					<div className="flex gap-2 pt-2">
						<div className="text-gray-600">
							<div className="flex flex-wrap gap-1 min-h-6 text-xs items-center">
								<div className="font-semibold">
									{data.eventTypes.length > 1 ? "Types: " : "Type: "}
									{data.eventTypes.length === 0 ? "none" : ""}
								</div>
								{data.eventTypes.map((eventType, index) => {
									return (
										<div key={index} className="py-1 px-2 bg-blue-100 rounded-full">
											{eventType}
										</div>
									);
								})}
							</div>
						</div>
						<NodeEditButton
							flavor="event"
							isDisabled={data.isDisabled}
							onClick={() => setDialog("edit")}
						/>
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
									setEarDraft(defaultNodePredicateData[PredicateType.EventAttributeRange]());
									setDialog("earEdit");
								}, 100);
							}}
						>
							Add EAR Predicate
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
						<ContextMenuItem
							onSelect={() => {
								setTimeout(() => {
									setDialog("edit");
								}, 100);
							}}
						>
							Edit Event Types
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
							<LuTrash className="mr-1" /> Delete Event Node
						</ContextMenuItem>
					</ContextMenuContent>
				</ContextMenuPortal>
			</ContextMenu>
			<RenameNodeDialog
				open={dialog === "rename"}
				initialName={data.displayName ?? ""}
				defaultName={defaultNodeData[EVENT_NODE_TYPE]().displayName}
				onOpenChange={(open) => !open && setDialog(undefined)}
				onRename={(newName) => {
					onNodeDataChange(id, {
						displayName: newName,
					});
				}}
			/>
			<AttributeRangeDialog
				open={dialog === "earEdit"}
				onOpenChange={(open) => !open && setDialog(undefined)}
				onSave={() => {
					if (!earDraft.isInitialized) {
						const saveEar = {
							...earDraft,
							isInitialized: true,
						} satisfies EventNodePredicate;
						onNodeDataChange(id, {
							predicates: [...data.predicates, saveEar],
						});
					} else {
						onNodeDataChange(id, {
							predicates: data.predicates.map((predicate) => {
								if (predicate.id === earDraft.id) {
									return earDraft;
								} else {
									return predicate;
								}
							}),
						});
					}
				}}
				predicateType={PredicateType.EventAttributeRange}
				predicateMode={earDraft.mode}
				setPredicateMode={(predicateMode) =>
					setEarDraft((oldDraft) => ({
						...oldDraft,
						mode: predicateMode,
					}))
				}
				isInitialized={earDraft.isInitialized}
				ocelAttributes={getOcelEventAttributes()}
				attribute={earDraft.attribute}
				setAttribute={(attribute) =>
					setEarDraft((oldDraft) => ({
						...oldDraft,
						attribute: attribute,
					}))
				}
				attributeRange={earDraft.range}
				setAttributeRange={(attributeRange) =>
					setEarDraft((oldDraft) => ({
						...oldDraft,
						range: attributeRange,
					}))
				}
			/>
			<AlertDialog open={dialog === "edit"} onOpenChange={(open) => !open && setDialog(undefined)}>
				<AlertDialogContent
					onContextMenuCapture={(ev) => {
						ev.stopPropagation();
					}}
				>
					<AlertDialogHeader>
						<AlertDialogTitle>
							{data.eventTypes.length === 0 ? "Add" : "Edit"} Event Types
						</AlertDialogTitle>
						<AlertDialogDescription>
							<span>
								Multiple types are considered with OR-semantics (e.g., an{" "}
								<span className="font-bold text-blue-600">A</span> or{" "}
								<span className="font-bold text-purple-600">B</span> event).
							</span>
						</AlertDialogDescription>
						{ocelInfo === undefined ? (
							<div className="pt-4">No OCEL Info available. Check backend and reload.</div>
						) : (
							<div className="pt-4">
								<R4pmIsland>
									<ActivityChooser
										counts={
											ocelStats?.event_type_counts ??
											Object.fromEntries(ocelInfo.event_types.map((t) => [t.name, 0]))
										}
										value={new Set(editTypes)}
										onChange={(next) => setEditTypes([...next])}
										mode="multi"
										searchable
										showCutoff={false}
									/>
								</R4pmIsland>
							</div>
						)}
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel
							onClick={() => {
								setEditTypes(data.eventTypes);
								setDialog(undefined);
							}}
						>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => {
								onNodeDataChange(id, {
									eventTypes: editTypes,
								});
								setDialog(undefined);
							}}
						>
							{data.eventTypes.length === 0 ? "Add" : "Edit"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
			<DeleteDialog
				open={dialog === "delete"}
				toBeDeleted={`node "${data.displayName || defaultNodeData[EVENT_NODE_TYPE]().displayName}"`}
				onOpenChange={(open) => !open && setDialog(undefined)}
				onDelete={() => {
					onNodeDataChange(id, undefined);
				}}
			/>
			<DeleteDialog
				open={dialog === "earDelete"}
				toBeDeleted={`${predicateTypeShortLabels[earDraft.type]} ${earDraft.mode}`}
				onOpenChange={(open) => !open && setDialog(undefined)}
				onDelete={() => {
					onNodeDataChange(id, {
						predicates: data.predicates.filter((predicate) => predicate.id !== earDraft.id),
					});
				}}
			/>
		</NodeBox>
	);
}
