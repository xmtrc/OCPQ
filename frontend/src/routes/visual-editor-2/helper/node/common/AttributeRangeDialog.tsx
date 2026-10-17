import type { OCELTypeAttribute } from "@/types/ocel.ts";
import { Combobox } from "@/components/ui/combobox.tsx";
import {
	type AttributeRange,
	PredicateMode,
	type PredicateType,
	RangeType,
} from "@/routes/visual-editor-2/helper/types.ts";
import {
	defaultAttributeRangeData,
	predicateTypeLabels,
} from "@/routes/visual-editor-2/helper/const.ts";
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group.tsx";
import { DateTimeRangeInput } from "@/components/ui/date-time-range-input.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { StringListInput } from "@/routes/visual-editor/helper/box/filter-helpers.tsx";

interface AttributeRangeDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSave: () => void;
	predicateType: PredicateType;
	predicateMode: PredicateMode;
	setPredicateMode: (predicateMode: PredicateMode) => void;
	isInitialized: boolean;
	ocelAttributes: OCELTypeAttribute[];
	attribute: string;
	setAttribute: (attribute: string) => void;
	attributeRange: AttributeRange;
	setAttributeRange: (attributeRange: AttributeRange) => void;
}

function isRangeType(value: string): value is RangeType {
	return Object.values(RangeType).includes(value as RangeType);
}

export default function AttributeRangeDialog({
	open,
	onOpenChange,
	onSave,
	predicateType,
	predicateMode,
	setPredicateMode,
	isInitialized,
	ocelAttributes,
	attribute,
	setAttribute,
	attributeRange,
	setAttributeRange,
}: AttributeRangeDialogProps) {
	const ocelAttributeNames = ocelAttributes.map((ocelAttribute) => ({
		label: ocelAttribute.name,
		value: ocelAttribute.name,
	}));

	function getAttributeType(attributeLabel: string) {
		const type = ocelAttributes
			.find((ocelAttribute) => attributeLabel === ocelAttribute.name)
			?.type.toLowerCase();
		return type !== undefined && isRangeType(type) ? type : undefined;
	}

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent
				onContextMenuCapture={(ev) => {
					ev.stopPropagation();
				}}
			>
				<AlertDialogHeader>
					<AlertDialogTitle>
						{!isInitialized ? "Add" : "Edit"} {predicateTypeLabels[predicateType]} {predicateMode}
					</AlertDialogTitle>
					<AlertDialogDescription>
						Use this predicate as a filter or a constraint.
					</AlertDialogDescription>
					<ToggleGroup
						className="justify-start mb-3 mt-1"
						type="single"
						value={predicateMode}
						onValueChange={(v) => v && setPredicateMode(v as PredicateMode)}
					>
						<ToggleGroupItem value={PredicateMode.Filter} variant={"outline"}>
							Filter
						</ToggleGroupItem>
						<ToggleGroupItem value={PredicateMode.Constraint} variant={"outline"}>
							Constraint
						</ToggleGroupItem>
					</ToggleGroup>
					<div className="text-sm text-muted-foreground">
						<span>Configure the predicate below.</span>
						<div className="flex gap-2 my-3">
							<Combobox
								options={ocelAttributeNames}
								onChange={(newAttribute) => {
									setAttribute(newAttribute);
									setAttributeRange(
										defaultAttributeRangeData[getAttributeType(newAttribute) ?? RangeType.String](),
									);
								}}
								name={"Attribute Name"}
								value={attribute}
							/>
							<Combobox
								options={Object.values(RangeType).map((rangeType) => ({
									label: rangeType,
									value: rangeType,
								}))}
								onChange={(newRangeType) =>
									isRangeType(newRangeType) &&
									setAttributeRange(defaultAttributeRangeData[newRangeType]())
								}
								name={"Type"}
								value={attributeRange.rangeType}
							/>
						</div>
						{attributeRange.rangeType === RangeType.Time && (
							<DateTimeRangeInput
								from={attributeRange.from}
								to={attributeRange.to}
								onChange={(data) =>
									setAttributeRange({
										...attributeRange,
										from: data.from,
										to: data.to,
									})
								}
							/>
						)}
						{attributeRange.rangeType === RangeType.Boolean && (
							<Label className="flex h-9 items-center gap-x-2">
								<Checkbox
									checked={attributeRange.value}
									onCheckedChange={(checked) =>
										setAttributeRange({
											...attributeRange,
											value: checked === true,
										})
									}
								/>
								Should be {attributeRange.value ? "True" : "False"}
							</Label>
						)}
						{(attributeRange.rangeType === RangeType.Integer ||
							attributeRange.rangeType === RangeType.Float) && (
							<>
								<div className="flex items-center gap-2">
									<Input
										title="Minimum (Optional)"
										placeholder="Minimum (Optional)"
										type="number"
										step={attributeRange.rangeType === RangeType.Integer ? 1 : "any"}
										value={attributeRange.min ?? ""}
										onChange={(ev) => {
											const val = ev.currentTarget.valueAsNumber;
											setAttributeRange({
												...attributeRange,
												min: Number.isFinite(val)
													? attributeRange.rangeType === RangeType.Integer
														? Math.round(val)
														: val
													: null,
											});
										}}
										className="user-invalid:border-red-500! user-invalid:bg-red-100!"
									/>
									{"-"}
									<Input
										title="Maximum (Optional)"
										placeholder="Maximum (Optional)"
										type="number"
										step={attributeRange.rangeType === RangeType.Integer ? 1 : "any"}
										value={attributeRange.max ?? ""}
										onChange={(ev) => {
											const val = ev.currentTarget.valueAsNumber;
											setAttributeRange({
												...attributeRange,
												max: Number.isFinite(val)
													? attributeRange.rangeType === RangeType.Integer
														? Math.round(val)
														: val
													: null,
											});
										}}
										className="user-invalid:border-red-500! user-invalid:bg-red-100!"
									/>
								</div>
								<p className="my-3">
									Leave the field empty for no bound. Invalid inputs are considered as no bounds.
								</p>
							</>
						)}
						{attributeRange.rangeType === RangeType.String && (
							<StringListInput
								value={{ type: "String", is_in: attributeRange.values }}
								onChange={(value) => {
									if (value.type !== "String") return;
									setAttributeRange({
										...attributeRange,
										values: value.is_in,
									});
								}}
							/>
						)}
					</div>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					{/* TODO: Add save condition, such as max &gt;= min and non empty string filter */}
					<AlertDialogAction disabled={attribute === ""} onClick={onSave}>
						{!isInitialized ? "Add" : "Edit"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
