import { ParseNode, SerializationWriter } from "@microsoft/kiota-abstractions";

export interface TestParser {
  testCollection?: string[] | undefined;
  testString?: string | undefined;
  testComplexString?: string | undefined;
  testObject?: Record<string, unknown> | undefined;
  additionalData?: Record<string, unknown>;
  testDate?: Date | undefined;
}

export function createTestParserFromDiscriminatorValue(
  parseNode: ParseNode | undefined
) {
  if (!parseNode) throw new Error("parseNode cannot be undefined");
  return deserializeTestParser;
}

export function deserializeTestParser(
  testParser: TestParser | undefined = {}
): Record<string, (node: ParseNode) => void> {
  return {
    testCollection: (n) => {
      testParser.testCollection = n.getCollectionOfPrimitiveValues();
    },
    testString: (n) => {
      testParser.testString = n.getStringValue();
    },
    textComplexString: (n) => {
      testParser.testComplexString = n.getStringValue();
    },
    testDate: (n) => {
      testParser.testDate = n.getDateValue()
    }
  };
}

export function serializeTestObject(
  writer: SerializationWriter,
  entity: { additionalData?: Record<string, unknown> } | undefined = {}
): void {
  writer.writeAdditionalData(entity.additionalData);
}
export function serializeTestParser(
  writer: SerializationWriter,
  entity: TestParser | undefined = {}
): void {
  writer.writeCollectionOfPrimitiveValues(
    "testCollection",
    entity.testCollection
  );
  writer.writeStringValue("testString", entity.testString);
  writer.writeStringValue("testComplexString", entity.testComplexString);

  writer.writeDateValue("testDate", entity.testDate);
  writer.writeObjectValue("testObject", entity.testObject, serializeTestObject);
  writer.writeAdditionalData(entity.additionalData);
}
