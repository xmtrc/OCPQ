import type { OCELInfo } from "@/types/ocel.ts";
import { type ReactNode, useCallback, useContext, useRef } from "react";
import {
	FlowContext,
	type TypedFlowInstance,
} from "@/routes/visual-editor-2/helper/FlowContext.tsx";
import {
	Background,
	BackgroundVariant,
	type Connection,
	ConnectionMode,
	type Edge,
	type FinalConnectionState,
	MarkerType,
	type Node,
	type OnConnectStartParams,
	ReactFlow,
	useReactFlow,
	type XYPosition,
} from "@xyflow/react";
import type {
	EdgeDataTypes,
	EventNodeData,
	NodeDataTypes,
	ObjectNodeData,
} from "@/routes/visual-editor-2/helper/flowTypes.ts";
import { VisualEditorContext } from "@/routes/visual-editor-2/helper/VisualEditorContext.tsx";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { v4 } from "uuid";
import {
	defaultEdgeData,
	defaultNodeData,
	edgeTypeShortLabels,
	edgeTypes,
	EVENT_NODE_TYPE,
	nodeTypes,
	OBJECT_NODE_TYPE,
	SUBQUERY_NODE_TYPE,
} from "@/routes/visual-editor-2/helper/const.ts";
import type { EventTypeLinkData } from "@/routes/visual-editor/helper/types.ts";
import toast from "react-hot-toast";
import FloatingConnectionLine from "@/routes/visual-editor-2/helper/edge/common/FloatingConnectionLine.tsx";
import { PredicateType } from "./helper/types";

interface VisualEditorProps {
	ocelInfo: OCELInfo;
	children?: ReactNode;
}

export default function VisualEditor(props: VisualEditorProps) {
	const { setInstance } = useContext(FlowContext);
	const instance: TypedFlowInstance = useReactFlow<Node<NodeDataTypes>, Edge<EdgeDataTypes>>();
	const initialized = useRef<boolean>(false);

	const contextMenuTriggerRef = useRef<HTMLButtonElement>(null);
	const contextMenuPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

	const addNewNode = useCallback(
		(
			type: keyof typeof nodeTypes,
			screenPos: XYPosition = { x: window.innerWidth / 2, y: window.innerHeight / 2 },
			parentNodeId?: string,
		) => {
			const flowPosition = instance.screenToFlowPosition(screenPos);
			const parentNode = parentNodeId ? instance.getInternalNode(parentNodeId) : undefined;
			const position = parentNode
				? {
						x: flowPosition.x - parentNode.internals.positionAbsolute.x,
						y: flowPosition.y - parentNode.internals.positionAbsolute.y,
					}
				: flowPosition;
			instance.addNodes({
				id: v4(),
				type: type,
				position: position,
				data: defaultNodeData[type](),
				...(parentNode && { extent: "parent", parentId: parentNodeId }),
			});
		},
		[instance],
	);

	const getParentsNodeIDs = useCallback(
		(nodeID: string, edges: Edge<EventTypeLinkData>[]): string[] => {
			for (const edge of edges) {
				if (edge.target === nodeID) {
					return [...getParentsNodeIDs(edge.source, edges), edge.source];
				}
			}
			return [];
		},
		[],
	);

	const getRelation = useCallback(
		(source: string, target: string): [keyof typeof edgeTypes | undefined, boolean] => {
			const sourceNode: Node<NodeDataTypes> | undefined = instance
				.getNodes()
				.find((node: Node<NodeDataTypes>) => node.id === source);
			const targetNode: Node<NodeDataTypes> | undefined = instance
				.getNodes()
				.find((node: Node<NodeDataTypes>) => node.id === target);

			if (sourceNode !== undefined && targetNode !== undefined) {
				switch (sourceNode.type) {
					case EVENT_NODE_TYPE:
						switch (targetNode.type) {
							case OBJECT_NODE_TYPE: {
								const existsSupportingRelation =
									(sourceNode.data as EventNodeData).eventTypes.some((eventType: string) =>
										(targetNode.data as ObjectNodeData).objectTypes.some(
											(objectType: string) =>
												(props.ocelInfo.e2o_types[eventType][objectType][0] ?? 0) !== 0,
										),
									) ?? false;
								return [PredicateType.EventToObject, existsSupportingRelation];
							}
							case EVENT_NODE_TYPE:
								return [PredicateType.TimeBetweenEvents, true];
							default:
								break;
						}
						break;
					case OBJECT_NODE_TYPE:
						switch (targetNode.type) {
							case OBJECT_NODE_TYPE: {
								const existsSupportingRelation =
									(sourceNode.data as ObjectNodeData).objectTypes.some((objectTypeA: string) =>
										(targetNode.data as ObjectNodeData).objectTypes.some(
											(objectTypeB: string) =>
												(props.ocelInfo.o2o_types[objectTypeA][objectTypeB][0] ?? 0) !== 0,
										),
									) ?? false;
								return [PredicateType.ObjectToObject, existsSupportingRelation];
							}
							default:
								break;
						}
						break;
					case SUBQUERY_NODE_TYPE:
						return [PredicateType.ChildBindingSetEquals, targetNode.type === SUBQUERY_NODE_TYPE];
					default:
				}
			}

			return [undefined, false];
		},
		[instance, props.ocelInfo.e2o_types, props.ocelInfo.o2o_types],
	);

	const isValidConnection = useCallback(
		({ source, sourceHandle, target, targetHandle }: Edge<EdgeDataTypes> | Connection) => {
			const edges = instance.getEdges();
			if (source === null || target === null || sourceHandle === null || targetHandle === null) {
				return false;
			}
			const parents = getParentsNodeIDs(source, edges);
			if (source === target || parents.includes(target)) {
				toast.error(
					<span>
						<b>Invalid connection</b>
						<br />
						Loops are forbidden!
					</span>,
					{
						position: "bottom-center",
						id: "invalid-connection-toast",
					},
				);
				return false;
			}

			const [edgeType, supportingRelations] = getRelation(source, target);

			!supportingRelations &&
				toast.error(
					<span>
						<b>Invalid connection</b>
						<br />
						No supporting{" "}
						{edgeTypeShortLabels[edgeType as keyof typeof edgeTypeShortLabels] ??
							"unknown edge type"}{" "}
						relations!
					</span>,
					{
						position: "bottom-center",
						id: "invalid-connection-toast",
					},
				);

			return supportingRelations;
		},
		[instance, getRelation, getParentsNodeIDs],
	);

	const getEdge = useCallback(
		(source: string, target: string): Edge<EdgeDataTypes> | undefined => {
			return instance
				.getEdges()
				.find((edge: Edge<EdgeDataTypes>) => edge.source === source && edge.target === target);
		},
		[instance],
	);

	return (
		<VisualEditorContext.Provider
			value={{
				ocelInfo: props.ocelInfo,
				addNewNode,
				onNodeDataChange: (id, newData) => {
					if (newData === undefined) {
						instance.deleteElements({ nodes: [{ id }] });
					} else {
						instance.updateNodeData(id, newData);
					}
				},
				onEdgeDataChange: (id, newData) => {
					if (newData !== undefined) {
						instance.updateEdgeData(id, newData);
					} else {
						instance.setEdges((edges) => {
							return edges.filter((e) => e.id !== id);
						});
					}
				},
			}}
		>
			<ContextMenu>
				<ContextMenuTrigger
					className="pointer-events-auto hidden "
					asChild
					ref={contextMenuTriggerRef}
				>
					<button />
				</ContextMenuTrigger>
				<ContextMenuContent>
					<div className="text-gray-300 text-xs font-semibold px-2 pt-1">Add Nodes</div>
					<ContextMenuItem
						onClick={() => {
							addNewNode(EVENT_NODE_TYPE, contextMenuPos.current);
						}}
					>
						Add Event Node
					</ContextMenuItem>
					<ContextMenuItem
						onClick={() => {
							addNewNode(OBJECT_NODE_TYPE, contextMenuPos.current);
						}}
					>
						Add Object Node
					</ContextMenuItem>
					<ContextMenuItem
						onClick={() => {
							addNewNode(SUBQUERY_NODE_TYPE, contextMenuPos.current);
						}}
					>
						Add Subquery Node
					</ContextMenuItem>
				</ContextMenuContent>
			</ContextMenu>
			<ReactFlow<Node<NodeDataTypes>, Edge<EdgeDataTypes>>
				className="react-flow"
				onInit={(flow) => {
					initialized.current = true;
					if (initialized.current) {
						setInstance(flow);
					}
				}}
				nodeTypes={nodeTypes}
				edgeTypes={edgeTypes}
				defaultNodes={[]}
				defaultEdges={[]}
				isValidConnection={isValidConnection}
				connectionMode={ConnectionMode.Loose}
				connectionLineComponent={FloatingConnectionLine}
				onConnectStart={(_ev: MouseEvent | TouchEvent, params: OnConnectStartParams) => {
					instance.setNodes((oldNodes) =>
						oldNodes.map((node) => ({
							...node,
							data: {
								...node.data,
								isDisabled: !getRelation(params.nodeId ?? "", node.id)[1],
								isHandleOnTop: true,
							},
						})),
					);
				}}
				onConnectEnd={(_ev: MouseEvent | TouchEvent, _connectionState: FinalConnectionState) => {
					instance.setNodes((oldNodes) =>
						oldNodes.map((node) => ({
							...node,
							data: {
								...node.data,
								isDisabled: false,
								isHandleOnTop: false,
							},
						})),
					);
				}}
				onConnect={(connection: Connection) => {
					const edgeId = getEdge(connection.source, connection.target)?.id;
					const predicateType = getRelation(connection.source, connection.target)[0];
					edgeId &&
						predicateType &&
						instance.updateEdge(edgeId, {
							type: predicateType,
							data: {
								...defaultEdgeData[predicateType](),
								type: predicateType,
							},
							markerEnd: {
								type: MarkerType.ArrowClosed,
								width: 15,
								height: 12,
								color: "#000000ff",
							},
						});
				}}
				onContextMenu={(ev) => {
					const trigger = !ev.isDefaultPrevented();
					ev.stopPropagation();
					ev.preventDefault();
					if (trigger && contextMenuTriggerRef.current) {
						contextMenuPos.current = { x: ev.clientX, y: ev.clientY };
						const newEv = new MouseEvent("contextmenu", {
							bubbles: true,
							cancelable: true,
							clientX: ev.clientX,
							clientY: ev.clientY,
						});
						contextMenuTriggerRef.current.dispatchEvent(newEv);
					}
				}}
			>
				<Background variant={BackgroundVariant.Dots} />
				{props.children}
			</ReactFlow>
		</VisualEditorContext.Provider>
	);
}
