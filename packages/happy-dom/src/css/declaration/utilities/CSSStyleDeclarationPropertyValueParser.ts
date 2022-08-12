import CSSStyleDeclarationValueParser from './CSSStyleDeclarationValueParser';
import ICSSStyleDeclarationPropertyValue from './ICSSStyleDeclarationPropertyValue';

const RECT_REGEXP = /^rect\((.*)\)$/i;
const BORDER_STYLE = [
	'none',
	'hidden',
	'dotted',
	'dashed',
	'solid',
	'double',
	'groove',
	'ridge',
	'inset',
	'outset'
];
const BORDER_WIDTH = ['thin', 'medium', 'thick', 'inherit', 'initial', 'unset', 'revert'];
const BORDER_COLLAPSE = ['separate', 'collapse', 'initial', 'inherit'];
const BACKGROUND_REPEAT = ['repeat', 'repeat-x', 'repeat-y', 'no-repeat', 'inherit'];
const BACKGROUND_ATTACHMENT = ['scroll', 'fixed', 'inherit'];
const BACKGROUND_POSITION = ['top', 'center', 'bottom', 'left', 'right'];
const FLEX_BASIS = [
	'auto',
	'fill',
	'max-content',
	'min-content',
	'fit-content',
	'content',
	'inherit',
	'initial',
	'revert',
	'unset'
];
const CLEAR = ['none', 'left', 'right', 'both', 'inherit'];
const FLOAT = ['none', 'left', 'right', 'inherit'];
const FONT_SIZE = [
	'xx-small',
	'x-small',
	'small',
	'medium',
	'large',
	'x-large',
	'xx-large',
	'xxx-large',
	'smaller',
	'larger',
	'inherit',
	'initial',
	'revert',
	'unset'
];

/**
 * Computed style property parser.
 */
export default class CSSStyleDeclarationPropertyValueParser {
	/**
	 * Returns border style.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values
	 */
	public static getBorderStyle(
		value: string,
		important: boolean
	): {
		[key: string]: ICSSStyleDeclarationPropertyValue;
	} {
		const lowerValue = value.toLowerCase();
		if (BORDER_STYLE.includes(lowerValue)) {
			return { 'border-style': { value: lowerValue, important } };
		}
		return null;
	}

	/**
	 * Returns border collapse.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values
	 */
	public static getBorderCollapse(
		value: string,
		important: boolean
	): {
		[key: string]: ICSSStyleDeclarationPropertyValue;
	} {
		const lowerValue = value.toLowerCase();
		if (BORDER_COLLAPSE.includes(lowerValue)) {
			return { 'border-collapse': { value: lowerValue, important } };
		}
		return null;
	}

	/**
	 * Returns background repeat.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values
	 */
	public static getBackgroundRepeat(
		value: string,
		important: boolean
	): {
		[key: string]: ICSSStyleDeclarationPropertyValue;
	} {
		const lowerValue = value.toLowerCase();
		if (BACKGROUND_REPEAT.includes(lowerValue)) {
			return { 'background-repeat': { value: lowerValue, important } };
		}
		return null;
	}

	/**
	 * Returns background attachment.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values
	 */
	public static getBackgroundAttachment(
		value: string,
		important: boolean
	): {
		[key: string]: ICSSStyleDeclarationPropertyValue;
	} {
		const lowerValue = value.toLowerCase();
		if (BACKGROUND_ATTACHMENT.includes(lowerValue)) {
			return { 'background-attachment': { value: lowerValue, important } };
		}
		return null;
	}

	/**
	 * Returns URL.
	 *
	 * Based on:
	 * https://github.com/jsdom/cssstyle/blob/master/lib/properties/backgroundPosition.js
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values
	 */
	public static getBackgroundPosition(
		value: string,
		important: boolean
	): {
		[key: string]: ICSSStyleDeclarationPropertyValue;
	} {
		if (!value) {
			return null;
		}
		const parts = value.split(/\s+/);
		if (parts.length > 2 || parts.length < 1) {
			return null;
		}
		if (parts.length === 1) {
			if (CSSStyleDeclarationValueParser.getLength(parts[0])) {
				return { 'background-position': { value, important } };
			}
			if (parts[0]) {
				const lowerValue = value.toLowerCase();
				if (BACKGROUND_POSITION.includes(lowerValue) || lowerValue === 'inherit') {
					return { 'background-position': { value: lowerValue, important } };
				}
			}
			return null;
		}
		if (
			(CSSStyleDeclarationValueParser.getLength(parts[0]) ||
				CSSStyleDeclarationValueParser.getPercentage(parts[0])) &&
			(CSSStyleDeclarationValueParser.getLength(parts[1]) ||
				CSSStyleDeclarationValueParser.getPercentage(parts[1]))
		) {
			return { 'background-position': { value: value.toLowerCase(), important } };
		}
		if (
			BACKGROUND_POSITION.includes(parts[0].toLowerCase()) &&
			BACKGROUND_POSITION.includes(parts[1].toLowerCase())
		) {
			return {
				'background-position': {
					value: `${parts[0].toLowerCase()} ${parts[1].toLowerCase()}`,
					important
				}
			};
		}
		return null;
	}

	/**
	 * Returns flex basis.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values
	 */
	public static getFlexBasis(
		value: string,
		important: boolean
	): {
		[key: string]: ICSSStyleDeclarationPropertyValue;
	} {
		const lowerValue = value.toLowerCase();
		if (FLEX_BASIS.includes(lowerValue)) {
			return { 'flex-basis': { value: lowerValue, important } };
		}
		return { 'flex-basis': { value: CSSStyleDeclarationValueParser.getLength(value), important } };
	}

	/**
	 * Returns border width.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values
	 */
	public static getBorderWidth(
		value: string,
		important: boolean
	): {
		[key: string]: ICSSStyleDeclarationPropertyValue;
	} {
		const lowerValue = value.toLowerCase();
		if (BORDER_WIDTH.includes(lowerValue)) {
			return { 'border-width': { value: lowerValue, important } };
		}
		const length = CSSStyleDeclarationValueParser.getLength(value);
		return length ? { 'border-width': { value: length, important } } : null;
	}

	/**
	 * Returns clear.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values
	 */
	public static getClear(
		value: string,
		important: boolean
	): {
		[key: string]: ICSSStyleDeclarationPropertyValue;
	} {
		const lowerValue = value.toLowerCase();
		if (CLEAR.includes(lowerValue)) {
			return { clear: { value: lowerValue, important } };
		}
		return null;
	}

	/**
	 * Returns clip
	 *
	 * Based on:
	 * https://github.com/jsdom/cssstyle/blob/master/lib/properties/clip.js
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values
	 */
	public static getClip(
		value: string,
		important: boolean
	): {
		[key: string]: ICSSStyleDeclarationPropertyValue;
	} {
		const lowerValue = value.toLowerCase();
		if (lowerValue === 'auto' || lowerValue === 'initial' || lowerValue === 'inherit') {
			return { clip: { value: lowerValue, important } };
		}
		const matches = lowerValue.match(RECT_REGEXP);
		if (!matches) {
			return null;
		}
		const parts = matches[1].split(/\s*,\s*/);
		if (parts.length !== 4) {
			return null;
		}
		for (const part of parts) {
			if (!CSSStyleDeclarationValueParser.getMeasurement(part)) {
				return null;
			}
		}
		return { clip: { value, important } };
	}

	/**
	 * Returns float.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values
	 */
	public static getFloat(
		value: string,
		important: boolean
	): {
		[key: string]: ICSSStyleDeclarationPropertyValue;
	} {
		const lowerValue = value.toLowerCase();
		if (FLOAT.includes(lowerValue)) {
			return { float: { value: lowerValue, important } };
		}
		return null;
	}

	/**
	 * Returns font size.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values
	 */
	public static getFontSize(
		value: string,
		important: boolean
	): {
		[key: string]: ICSSStyleDeclarationPropertyValue;
	} {
		const lowerValue = value.toLowerCase();
		if (FONT_SIZE.includes(lowerValue)) {
			return { 'font-size': { value: lowerValue, important } };
		}
		const measurement =
			CSSStyleDeclarationValueParser.getLength(value) ||
			CSSStyleDeclarationValueParser.getPercentage(value);
		return measurement ? { 'font-size': { value: measurement, important } } : null;
	}

	/**
	 * Returns border.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values.
	 */
	public static getBorder(
		value: string,
		important: boolean
	): { [key: string]: ICSSStyleDeclarationPropertyValue } {
		const parts = value.split(/ +/);
		const borderWidth = parts[0] ? this.getBorderWidth(parts[0], important) : '';
		const borderStyle = parts[1] ? this.getBorderStyle(parts[1], important) : '';
		const borderColor = parts[2] ? CSSStyleDeclarationValueParser.getColor(parts[2]) : '';
		const propertyValues = {};

		if (borderWidth) {
			propertyValues['border-top-width'] = { ...borderWidth['border-width'] };
			propertyValues['border-right-width'] = { ...borderWidth['border-width'] };
			propertyValues['border-bottom-width'] = { ...borderWidth['border-width'] };
			propertyValues['border-left-width'] = { ...borderWidth['border-width'] };
		}

		if (borderStyle) {
			propertyValues['border-top-style'] = { ...borderStyle['border-style'] };
			propertyValues['border-right-style'] = { ...borderStyle['border-style'] };
			propertyValues['border-bottom-style'] = { ...borderStyle['border-style'] };
			propertyValues['border-left-style'] = { ...borderStyle['border-style'] };
		}

		if (borderColor) {
			propertyValues['border-top-style'] = { important, value: borderColor };
			propertyValues['border-right-style'] = { important, value: borderColor };
			propertyValues['border-bottom-style'] = { important, value: borderColor };
			propertyValues['border-left-style'] = { important, value: borderColor };
		}

		return borderWidth && borderStyle !== null && borderColor !== null ? propertyValues : null;
	}

	/**
	 * Returns border radius.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values.
	 */
	public static getBorderRadius(
		value: string,
		important: boolean
	): { [key: string]: ICSSStyleDeclarationPropertyValue } {
		const parts = value.split(/ +/);
		const topLeft = parts[0] ? CSSStyleDeclarationValueParser.getMeasurement(parts[0]) : '';
		const topRight = parts[1] ? CSSStyleDeclarationValueParser.getMeasurement(parts[1]) : '';
		const bottomRight = parts[2] ? CSSStyleDeclarationValueParser.getMeasurement(parts[2]) : '';
		const bottomLeft = parts[3] ? CSSStyleDeclarationValueParser.getMeasurement(parts[3]) : '';
		const propertyValues = {};

		if (topLeft) {
			propertyValues['border-top-left-radius'] = { important, value: topLeft };
		}
		if (topRight) {
			propertyValues['border-top-right-radius'] = { important, value: topRight };
		}
		if (bottomRight) {
			propertyValues['border-bottom-right-radius'] = { important, value: bottomRight };
		}
		if (bottomLeft) {
			propertyValues['border-bottom-left-radius'] = { important, value: bottomLeft };
		}

		return topLeft && topRight !== null && bottomRight !== null && bottomLeft !== null
			? propertyValues
			: null;
	}

	/**
	 * Returns border top, right, bottom or left.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values.
	 */
	public static getBorderTop(
		value: string,
		important: boolean
	): { [key: string]: ICSSStyleDeclarationPropertyValue } {
		return this.getBorderByPosition('top', value, important);
	}

	/**
	 * Returns border top, right, bottom or left.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values.
	 */
	public static getBorderRight(
		value: string,
		important: boolean
	): { [key: string]: ICSSStyleDeclarationPropertyValue } {
		return this.getBorderByPosition('right', value, important);
	}

	/**
	 * Returns border top, right, bottom or left.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values.
	 */
	public static getBorderBottom(
		value: string,
		important: boolean
	): { [key: string]: ICSSStyleDeclarationPropertyValue } {
		return this.getBorderByPosition('bottom', value, important);
	}

	/**
	 * Returns border top, right, bottom or left.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values.
	 */
	public static getBorderLeft(
		value: string,
		important: boolean
	): { [key: string]: ICSSStyleDeclarationPropertyValue } {
		return this.getBorderByPosition('left', value, important);
	}

	/**
	 * Returns padding.
	 *
	 * @param value Value.
	 * @param important Important.
	 */
	public static getPadding(
		value: string,
		important: boolean
	): { [key: string]: ICSSStyleDeclarationPropertyValue } {
		const parts = value.split(/ +/);
		const top = parts[0] ? this.getPaddingByPosition('top', parts[0], important) : '';
		const right = parts[1] ? this.getPaddingByPosition('right', parts[0], important) : '';
		const bottom = parts[2] ? this.getPaddingByPosition('bottom', parts[0], important) : '';
		const left = parts[3] ? this.getPaddingByPosition('left', parts[0], important) : '';
		const propertyValues = {};

		if (top) {
			Object.assign(propertyValues, top);
		}
		if (right) {
			Object.assign(propertyValues, right);
		}
		if (bottom) {
			Object.assign(propertyValues, bottom);
		}
		if (left) {
			Object.assign(propertyValues, left);
		}

		return top && right !== null && bottom !== null && left !== null ? propertyValues : null;
	}

	/**
	 * Returns padding top.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values.
	 */
	public static getPaddingTop(
		value: string,
		important: boolean
	): { [key: string]: ICSSStyleDeclarationPropertyValue } {
		return this.getPaddingByPosition('top', value, important);
	}

	/**
	 * Returns padding right.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values.
	 */
	public static getPaddingRight(
		value: string,
		important: boolean
	): { [key: string]: ICSSStyleDeclarationPropertyValue } {
		return this.getPaddingByPosition('right', value, important);
	}

	/**
	 * Returns padding bottom.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values.
	 */
	public static getPaddingBottom(
		value: string,
		important: boolean
	): { [key: string]: ICSSStyleDeclarationPropertyValue } {
		return this.getPaddingByPosition('bottom', value, important);
	}

	/**
	 * Returns padding left.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values.
	 */
	public static getPaddingLeft(
		value: string,
		important: boolean
	): { [key: string]: ICSSStyleDeclarationPropertyValue } {
		return this.getPaddingByPosition('left', value, important);
	}

	/**
	 * Returns margin.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values.
	 */
	public static getMargin(
		value: string,
		important: boolean
	): { [key: string]: ICSSStyleDeclarationPropertyValue } {
		const parts = value.split(/ +/);
		const top = parts[0] ? this.getMarginByPosition('top', parts[0], important) : '';
		const right = parts[1] ? this.getMarginByPosition('right', parts[0], important) : '';
		const bottom = parts[2] ? this.getMarginByPosition('bottom', parts[0], important) : '';
		const left = parts[3] ? this.getMarginByPosition('left', parts[0], important) : '';
		const propertyValues = {};

		if (top) {
			Object.assign(propertyValues, top);
		}
		if (right) {
			Object.assign(propertyValues, right);
		}
		if (bottom) {
			Object.assign(propertyValues, bottom);
		}
		if (left) {
			Object.assign(propertyValues, left);
		}

		return top && right !== null && bottom !== null && left !== null ? propertyValues : null;
	}

	/**
	 * Returns margin top.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values.
	 */
	public static getMarginTop(
		value: string,
		important: boolean
	): { [key: string]: ICSSStyleDeclarationPropertyValue } {
		return this.getMarginByPosition('top', value, important);
	}

	/**
	 * Returns margin right.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values.
	 */
	public static getMarginRight(
		value: string,
		important: boolean
	): { [key: string]: ICSSStyleDeclarationPropertyValue } {
		return this.getMarginByPosition('right', value, important);
	}

	/**
	 * Returns margin right.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values.
	 */
	public static getMarginBottom(
		value: string,
		important: boolean
	): { [key: string]: ICSSStyleDeclarationPropertyValue } {
		return this.getMarginByPosition('bottom', value, important);
	}

	/**
	 * Returns margin left.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values.
	 */
	public static getMarginLeft(
		value: string,
		important: boolean
	): { [key: string]: ICSSStyleDeclarationPropertyValue } {
		return this.getMarginByPosition('left', value, important);
	}

	/**
	 * Returns flex.
	 *
	 * @param name Name.
	 * @param value Value.
	 * @param important Important.
	 */
	public static getFlex(name: string, value: string, important: boolean): void {
		const lowerValue = value.trim().toLowerCase();

		switch (lowerValue) {
			case 'none':
				this.properties['flex-grow'] = { important, value: '0' };
				this.properties['flex-shrink'] = { important, value: '0' };
				this.properties['flex-basis'] = { important, value: 'auto' };
				return;
			case 'auto':
				this.properties['flex-grow'] = { important, value: '1' };
				this.properties['flex-shrink'] = { important, value: '1' };
				this.properties['flex-basis'] = { important, value: 'auto' };
				return;
			case 'initial':
				this.properties['flex-grow'] = { important, value: '0' };
				this.properties['flex-shrink'] = { important, value: '0' };
				this.properties['flex-basis'] = { important, value: 'auto' };
				return;
			case 'inherit':
				this.properties['flex-grow'] = { important, value: 'inherit' };
				this.properties['flex-shrink'] = { important, value: 'inherit' };
				this.properties['flex-basis'] = { important, value: 'inherit' };
				return;
		}

		const parts = value.split(/ +/);
		const flexGrow = parts[0] ? this.getInteger(parts[0]) : '';
		const flexShrink = parts[1] ? this.getInteger(parts[1]) : '';
		const flexBasis = parts[2] ? this.getFlexBasis(parts[2]) : '';

		if (flexGrow && flexShrink && flexBasis) {
			this.properties['flex-grow'] = { important, value: flexGrow };
			this.properties['flex-shrink'] = { important, value: flexShrink };
			this.properties['flex-basis'] = { important, value: flexBasis };
		}
	}

	/**
	 * Returns background.
	 *
	 * @param name Name.
	 * @param value Value.
	 * @param important Important.
	 */
	public static getBackground(name: string, value: string, important: boolean): void {
		const parts = value.split(/ +/);

		if (!parts[0]) {
			return;
		}

		// First value can be image if color is not specified.
		if (!this.getColor(parts[0])) {
			parts.unshift('');
		}

		const color = parts[0] ? this.getColor(parts[0]) : '';
		const image = parts[1] ? this.getURL(parts[1]) : '';
		const repeat = parts[2] ? this.getBackgroundRepeat(parts[2]) : '';
		const attachment = parts[3] ? this.getBackgroundAttachment(parts[3]) : '';
		const position = parts[4] ? this.getBackgroundPosition(parts[4]) : '';

		if ((color || image) && repeat !== null && attachment !== null && position !== null) {
			if (color) {
				this.properties['background-color'] = { important, value: color };
			}
			if (image) {
				this.properties['background-image'] = { important, value: image };
			}
			this.properties['background-repeat'] = { important, value: repeat };
			this.properties['background-attachment'] = { important, value: attachment };
			this.properties['background-position'] = { important, value: position };
		}
	}

	/**
	 * Returns border top, right, bottom or left.
	 *
	 * @param position Position.
	 * @param value Value.
	 * @param important Important.
	 * @returns Property value.
	 */
	private static getBorderByPosition(
		position: 'top' | 'right' | 'bottom' | 'left',
		value: string,
		important: boolean
	): { [key: string]: ICSSStyleDeclarationPropertyValue } {
		const parts = value.split(/ +/);
		const borderWidth = parts[0] ? this.getBorderWidth(parts[0], important) : '';
		const borderStyle = parts[1] ? this.getBorderStyle(parts[1], important) : '';
		const borderColor = parts[2] ? CSSStyleDeclarationValueParser.getColor(parts[2]) : '';

		if (borderWidth && borderStyle && borderColor) {
			return {
				[`border-${position}-width`]: borderWidth['border-width'],
				[`border-${position}-style`]: borderStyle['border-style'],
				[`border-${position}-color`]: { important, value: borderColor }
			};
		}

		return null;
	}

	/**
	 * Returns margin.
	 *
	 * @param position Position.
	 * @param value Value.
	 * @param important Important.
	 * @returns Parsed value.
	 */
	private static getMarginByPosition(
		position: 'top' | 'right' | 'bottom' | 'left',
		value: string,
		important: boolean
	): { [key: string]: ICSSStyleDeclarationPropertyValue } {
		const lowerValue = value.toLowerCase();
		if (lowerValue === 'auto') {
			return { [`margin-${position}`]: { important, value: 'auto' } };
		}
		const measurement = CSSStyleDeclarationValueParser.getMeasurement(value);
		return measurement
			? {
					[`margin-${position}`]: {
						important,
						value: measurement
					}
			  }
			: null;
	}

	/**
	 * Returns padding.
	 *
	 * @param position Position.
	 * @param value Value.
	 * @param important Important.
	 * @returns Parsed value.
	 */
	private static getPaddingByPosition(
		position: 'top' | 'right' | 'bottom' | 'left',
		value: string,
		important: boolean
	): { [key: string]: ICSSStyleDeclarationPropertyValue } {
		const measurement = CSSStyleDeclarationValueParser.getMeasurement(value);
		return measurement
			? {
					[`padding-${position}`]: {
						important,
						value: measurement
					}
			  }
			: null;
	}
}
