export enum PredicateType {
	EventToObject = "EventToObject",
	ObjectToObject = "ObjectToObject",
	TimeBetweenEvents = "TimeBetweenEvents",
	EventAttributeRange = "EventAttributeRange",
	ObjectAttributeRange = "ObjectAttributeRange",
	ChildBindingSetSize = "ChildBindingSetSize",
	ChildBindingSetEquals = "ChildBindingSetEquals",
	AllSatisfied = "AllSatisfied",
	AnySatisfied = "AnySatisfied",
	OrAnySatisfied = "OrAnySatisfied",
	NoneSatisfied = "NoneSatisfied",
}

export enum PredicateMode {
	Filter = "Filter",
	Constraint = "Constraint",
}

export type Predicate = {
	type: PredicateType;
	mode: PredicateMode;
	color?: string;
};

export enum RangeType {
	Integer = "integer",
	Float = "float",
	Boolean = "boolean",
	String = "string",
	Time = "time",
}

export type AttributeRange =
	| { rangeType: RangeType.Integer; min?: number; max?: number }
	| { rangeType: RangeType.Float; min?: number; max?: number }
	| { rangeType: RangeType.Boolean; value: boolean }
	| { rangeType: RangeType.String; values: string[] }
	| { rangeType: RangeType.Time; min?: number; max?: number };

export enum TimeMode {
	Always = "Always",
	Sometime = "Sometime",
	AtEvent = "AtEvent",
}

export type ObjectAttributeTimeMode =
	| { mode: TimeMode.Always }
	| { mode: TimeMode.Sometime }
	| { mode: TimeMode.AtEvent; eventNodeId: string };

export type EventToObjectPredicate = Predicate & {
	type: PredicateType.EventToObject;
	qualifier?: string;
};

export type ObjectToObjectPredicate = Predicate & {
	type: PredicateType.ObjectToObject;
	qualifier?: string;
};

export type TimeBetweenEventsPredicate = Predicate & {
	type: PredicateType.TimeBetweenEvents;
	min?: number;
	max?: number;
};

export type EventAttributeRangePredicate = Predicate & {
	type: PredicateType.EventAttributeRange;
	attribute: string;
	range: AttributeRange;
};

export type ObjectAttributeRangePredicate = Predicate & {
	type: PredicateType.ObjectAttributeRange;
	attribute: string;
	range: AttributeRange;
	objectAttributeTimeMode: ObjectAttributeTimeMode;
};

export type ChildBindingSetSizePredicate = Predicate & {
	type: PredicateType.ChildBindingSetSize;
	projectedNodeId?: string;
	min?: number;
	max?: number;
};

export type ChildBindingSetEqualsPredicate = Predicate & {
	type: PredicateType.ChildBindingSetEquals;
	projectedNodeAId?: string;
	projectedNodeBId?: string;
};

export type AllSatisfiedPredicate = Predicate & {
	type: PredicateType.AllSatisfied;
	mode: PredicateMode.Constraint;
};

export type AnySatisfiedPredicate = Predicate & {
	type: PredicateType.AnySatisfied;
	mode: PredicateMode.Constraint;
};

export type OrAnySatisfiedPredicate = Predicate & {
	type: PredicateType.OrAnySatisfied;
	mode: PredicateMode.Constraint;
};

export type NoneSatisfiedPredicate = Predicate & {
	type: PredicateType.NoneSatisfied;
	mode: PredicateMode.Constraint;
};

export type PlaceHolderPredicate = Predicate & {};
