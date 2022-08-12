const COLOR_REGEXP =
	/^#([0-9a-fA-F]{3,4}){1,2}$|^rgb\(([^)]*)\)$|^rgba\(([^)]*)\)$|^hsla?\(\s*(-?\d+|-?\d*.\d+)\s*,\s*(-?\d+|-?\d*.\d+)%\s*,\s*(-?\d+|-?\d*.\d+)%\s*(,\s*(-?\d+|-?\d*.\d+)\s*)?\)/;

const LENGTH_REGEXP = /^(0|[-+]?[0-9]*\.?[0-9]+(in|cm|em|mm|pt|pc|px|ex|rem|vh|vw|ch))$/;
const PERCENTAGE_REGEXP = /^[-+]?[0-9]*\.?[0-9]+%$/;
const URL_REGEXP = /^url\(\s*([^)]*)\s*\)$/;

/**
 * Style declaration value parser.
 */
export default class CSSStyleDeclarationValueParser {
	/**
	 * Returns length.
	 *
	 * @param value Value.
	 * @returns Parsed value.
	 */
	public static getLength(value: string): string {
		if (value === '0') {
			return '0px';
		}
		if (LENGTH_REGEXP.test(value)) {
			return value;
		}
		return null;
	}
	/**
	 * Returns percentance.
	 *
	 * @param value Value.
	 * @returns Parsed value.
	 */
	public static getPercentage(value: string): string {
		if (value === '0') {
			return '0%';
		}
		if (PERCENTAGE_REGEXP.test(value)) {
			return value;
		}
		return null;
	}

	/**
	 * Returns measurement.
	 *
	 * @param value Value.
	 * @returns Parsed value.
	 */
	public static getMeasurement(value: string): string {
		const lowerValue = value.toLowerCase();
		if (
			lowerValue === 'inherit' ||
			lowerValue === 'initial' ||
			lowerValue === 'revert' ||
			lowerValue === 'unset'
		) {
			return lowerValue;
		}

		return this.getLength(value) || this.getPercentage(value);
	}

	/**
	 * Returns measurement or auto.
	 *
	 * @param value Value.
	 * @returns Parsed value.
	 */
	public static getMeasurementOrAuto(value: string): string {
		const lowerValue = value.toLowerCase();
		if (lowerValue === 'auto') {
			return lowerValue;
		}
		return this.getMeasurement(value);
	}

	/**
	 * Returns integer.
	 *
	 * @param value Value.
	 * @returns Parsed value.
	 */
	public static getInteger(value: string): string {
		if (!isNaN(parseInt(value))) {
			return value;
		}
		return null;
	}

	/**
	 * Returns color.
	 *
	 * @param value Value.
	 * @returns Parsed value.
	 */
	public static getColor(value: string): string {
		if (COLOR_REGEXP.test(value)) {
			return value;
		}
		return null;
	}

	/**
	 * Returns URL.
	 *
	 * Based on:
	 * https://github.com/jsdom/cssstyle/blob/master/lib/parsers.js#L222
	 *
	 * @param value Value.
	 * @returns Parsed value.
	 */
	public static getURL(value: string): string {
		if (!value) {
			return null;
		}

		const lowerValue = value.toLowerCase();

		if (lowerValue === 'none' || lowerValue === 'inherit') {
			return lowerValue;
		}

		const result = URL_REGEXP.exec(value);

		if (!result) {
			return null;
		}

		let url = result[1];

		if ((url[0] === '"' || url[0] === "'") && url[0] !== url[url.length - 1]) {
			return null;
		}

		if (url[0] === '"' || url[0] === "'") {
			url = url.substring(1, url.length - 1);
		}

		for (let i = 0; i < url.length; i++) {
			switch (url[i]) {
				case '(':
				case ')':
				case ' ':
				case '\t':
				case '\n':
				case "'":
				case '"':
					return null;
				case '\\':
					i++;
					break;
			}
		}

		return value;
	}
}
