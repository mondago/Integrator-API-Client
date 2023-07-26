import { v4 } from 'uuid'
import { Integrator } from './types'

class IntegratorAPI {
	private static SECURE_PORT = 10443
	private static INSECURE_PORT = 10080
	private static VERSION = 'v1'

	private _headers = new Headers()
	private _isInitialized = false
	private _config = {
		https: true,
		name: 'Integrator App',
		id: v4(),
	}

	public get initialized(): boolean {
		return this._isInitialized
	}

	constructor(config?: Partial<Integrator.Config>) {
		this._config = Object.assign({}, this._config, config)
		this._headers.set('Content-Type', 'application/x-www-form-urlencoded')
		this._headers.set('ApplicationId', this._config.id)
	}

	private _objectToURLEncoded(body: any) {
		return Object.entries(body || {})
			.reduce((params, [key, value]) => {
				if (value) {
					params.append(key, value.toString())
				}
				return params
			}, new URLSearchParams())
			.toString()
	}

	private _getAPIEndpoint(route: string): string {
		const origin = this._config.https ? `https://localhost:${IntegratorAPI.SECURE_PORT}` : `http://localhost:${IntegratorAPI.INSECURE_PORT}`
		return `${origin}/api/${IntegratorAPI.VERSION}/${route}`
	}

	private async _handleResponse<T>(res: Response): Promise<Integrator.Response<T>> {
		const isOk = res.status.toString().startsWith('2')
		const parsed: T = await res.json().catch(() => null)

		return {
			isOk,
			status: res.status,
			[isOk ? 'data' : 'error']: parsed,
		} as Integrator.Response<T>
	}

	private async _get<T>(endpoint: string): Promise<Integrator.Response<T>> {
		const res = await fetch(this._getAPIEndpoint(endpoint), { headers: this._headers })
		return this._handleResponse(res)
	}

	private async _post<T>(endpoint: string, body = {}): Promise<Integrator.Response<T>> {
		const urlencoded = this._objectToURLEncoded(body)
		const res = await fetch(this._getAPIEndpoint(endpoint), {
			method: 'POST',
			body: urlencoded,
			headers: this._headers,
		})

		return this._handleResponse(res)
	}

	public async init(): Promise<boolean> {
		this._isInitialized = false
		try {
			const res = await this.register({ Name: this._config.name, Id: this._config.id })
			if (res.status === 204) {
				this._isInitialized = true
			}
		} catch (e) {
			/* Integrator is not running (Network Error), which is an acceptable error to catch */
			console.error('Network error: Integrator is not running.')
		} finally {
			return this._isInitialized
		}
	}

	public register(body: Integrator.Register.Body) {
		return this._post<void>('Register', body)
	}

	public recordSuspend() {
		return this._post<void>('RecordSuspend')
	}

	public recordResume() {
		return this._post<void>('RecordResume')
	}

	public search(body: Integrator.Search.Body) {
		return this._post<Integrator.Search.Response>('Search', body)
	}

	public searchPeers(body: Integrator.SearchPeers.Body) {
		return this._post<Integrator.SearchPeers.Response>('SearchPeers', body)
	}

	public addressBooks() {
		return this._get<Integrator.AddressBooks.Response>('AddressBooks')
	}

	public makeCall(body: Integrator.MakeCall.Body) {
		return this._post<Integrator.MakeCall.Response>('MakeCall', body)
	}

	public showWindow(body: Integrator.ShowWindow.Body) {
		return this._post<void>('ShowWindow', body)
	}

	public doAction(body: Integrator.DoAction.Body) {
		return this._post<void>('DoAction', body)
	}

	public version() {
		return this._get<Integrator.Version.Response>('Version')
	}

	public unload() {
		return this._post<void>('Unload')
	}

	public ping(body: Integrator.Ping.Body) {
		return this._post<Integrator.Ping.Response>('Ping', body)
	}

	public ownerContact() {
		return this._get<Integrator.OwnerContact.Response>('OwnerContact')
	}

	public hookState() {
		return this._post<Integrator.HookState.Body>('HookState')
	}

	public recordTypes() {
		return this._get<Integrator.RecordTypes.Response>('RecordTypes')
	}

	public createNewRecord(body: Integrator.CreateNewRecord.Body) {
		return this._post<Integrator.CreateNewRecord.Response>('CreateNewRecord', body)
	}

	public saveRecord(body: Integrator.SaveRecord.Body) {
		return this._post<Integrator.SaveRecord.Response>('SaveRecord', body)
	}

	public answer() {
		return this._post<void>('Answer')
	}

	public hangup(body: Integrator.Hangup.Body) {
		return this._post<void>('Hangup', body)
	}

	public transferComplete(body: Integrator.TransferComplete.Body) {
		return this._post('TransferComplete', body)
	}

	public transferConsult(body: Integrator.TransferConsult.Body) {
		return this._post('TransferConsult', body)
	}

	public transferCancel(body: Integrator.TransferCancel.Body) {
		return this._post('TransferCancel', body)
	}

	public transferBlind(body: Integrator.TransferBlind.Body) {
		return this._post('TransferBlind', body)
	}

	public sendDtmf(body: Integrator.SendDtmf.Body) {
		return this._post('SendDtmf', body)
	}

	public deflect(body: Integrator.Deflect.Body) {
		return this._post('Deflect', body)
	}

	public unhold(body: Integrator.Unhold.Body) {
		return this._post('Unhold', body)
	}

	public hold(body: Integrator.Hold.Body) {
		return this._post('Hold', body)
	}

	public pickup(body: Integrator.Pickup.Body) {
		return this._post('Pickup', body)
	}

	/**
	 * Currently only supports WSS, with secure sockets enabled on the client
	 */
	public connectWS(eventHandler: Integrator.WebSocketEventHandler) {
		const url = `wss://localhost:${IntegratorAPI.SECURE_PORT}/api/${IntegratorAPI.VERSION}/events/${this._config.id}`
		const ws = new WebSocket(url)
		ws.addEventListener('message', (e) => {
			const event = JSON.parse(e.data)
			eventHandler(event)
		})
		return ws
	}

	// public update() {
	// 	throw new Error('Not implemented.')
	// }

	// public delete() {
	// 	throw new Error('Not implemented.')
	// }

	// public login() {
	// 	throw new Error('Not implemented.')
	// }

	// public refreshToken() {
	// 	throw new Error('Not implemented.')
	// }
}

export default IntegratorAPI
