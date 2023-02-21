import Location from '../../location/Location';
import EventTarget from '../../event/EventTarget';
import IWindow from '../../window/IWindow';

/**
 * Browser window with limited access due to CORS restrictions in iframes.
 */
export default class IframeCrossOriginWindow extends EventTarget {
	public readonly self = this;
	public readonly window = this;
	public readonly parent: IWindow;
	public readonly top: IWindow;

	private _targetWindow: IWindow;

	/**
	 * Constructor.
	 *
	 * @param parent Parent window.
	 * @param target Target window.
	 */
	constructor(parent: IWindow, target: IWindow) {
		super();

		this.parent = parent;
		this.top = parent;
		this._targetWindow = target;
	}

	/**
	 * Returns location.
	 *
	 * @returns Location.
	 */
	public get location(): Location {
		return this._targetWindow.location;
	}

	/**
	 * Safely enables cross-origin communication between Window objects; e.g., between a page and a pop-up that it spawned, or between a page and an iframe embedded within it.
	 *
	 * @param message Message.
	 * @param [targetOrigin=*] Target origin.
	 * @param transfer Transfer. Not implemented.
	 */
	public postMessage(message: unknown, targetOrigin = '*', transfer?: unknown[]): void {
		this._targetWindow.postMessage(message, targetOrigin, transfer);
	}
}