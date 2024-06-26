/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
import type { Parsable } from "./parsable";
import type { ParseNode } from "./parseNode";
import type { ParseNodeFactory } from "./parseNodeFactory";

/** Proxy factory that allows the composition of before and after callbacks on existing factories. */
export abstract class ParseNodeProxyFactory implements ParseNodeFactory {
	public getValidContentType(): string {
		return this._concrete.getValidContentType();
	}
	/**
	 * Creates a new proxy factory that wraps the specified concrete factory while composing the before and after callbacks.
	 * @param _concrete the concrete factory to wrap
	 * @param _onBefore the callback to invoke before the deserialization of any model object.
	 * @param _onAfter the callback to invoke after the deserialization of any model object.
	 */
	constructor(
		private readonly _concrete: ParseNodeFactory,
		private readonly _onBefore: (value: Parsable) => void,
		private readonly _onAfter: (value: Parsable) => void,
	) {
		if (!_concrete) {
			throw new Error("_concrete cannot be undefined");
		}
	}
	public getRootParseNode(contentType: string, content: ArrayBuffer): ParseNode {
		const node = this._concrete.getRootParseNode(contentType, content);
		const originalBefore = node.onBeforeAssignFieldValues;
		const originalAfter = node.onAfterAssignFieldValues;
		node.onBeforeAssignFieldValues = (value) => {
			if (this._onBefore) this._onBefore(value);
			if (originalBefore) originalBefore(value);
		};
		node.onAfterAssignFieldValues = (value) => {
			if (this._onAfter) this._onAfter(value);
			if (originalAfter) originalAfter(value);
		};
		return node;
	}
}
