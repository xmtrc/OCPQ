import type {
	ChildBindingSetEqualsPredicate,
	EventToObjectPredicate,
	ObjectAttributeRangePredicate,
	ObjectToObjectPredicate,
	OrAnySatisfiedPredicate,
	TimeBetweenEventsPredicate,
} from "@/routes/visual-editor-2/helper/types.ts";

export type NodeData = {
	displayName?: string;
	// Overrides the default color of the node
	color?: string;
	// Overrides every color
	isDisabled: boolean;
	// Whether to place the handle on top of the node or not
	isHandleOnTop: boolean;
};

export type EventNodeData = NodeData & {
	eventTypes: string[];
};

export type ObjectNodeData = NodeData & {
	objectTypes: string[];
};

export type SubqueryNodeData = NodeData;

export type NodeDataTypes = EventNodeData | ObjectNodeData | SubqueryNodeData;

export type EdgeData = {
	// Whether the edge is initialized or not
	isInitialized: boolean;
};

export type EventToObjectEdgeData = EdgeData & EventToObjectPredicate;

export type ObjectToObjectEdgeData = EdgeData & ObjectToObjectPredicate;

export type TimeBetweenEventsEdgeData = EdgeData & TimeBetweenEventsPredicate;

export type ObjectAttributeRangeEdgeData = EdgeData & ObjectAttributeRangePredicate;

export type ChildBindingSetEqualsEdgeData = EdgeData & ChildBindingSetEqualsPredicate;

export type OrAnySatisfiedEdgeData = EdgeData & OrAnySatisfiedPredicate;

export type EdgeDataTypes =
	| EventToObjectEdgeData
	| ObjectToObjectEdgeData
	| TimeBetweenEventsEdgeData
	| ObjectAttributeRangeEdgeData
	| ChildBindingSetEqualsEdgeData
	| OrAnySatisfiedEdgeData;
