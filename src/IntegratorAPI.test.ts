import IntegratorAPI from './IntegratorAPI'
import { Integrator } from './types'

let config: Integrator.Config

beforeEach(() => {
	config = {
		https: true,
		id: 'test-id',
		name: 'test-name',
	}
})

// @ts-ignore
global.WebSocket = jest.fn()
const WebSocket: jest.Mock = global.WebSocket as any

global.fetch = jest.fn()
const fetch: jest.Mock = global.fetch as any

describe('IntegratorAPI', () => {
	it('should set the `ApplicationId` header to the given id', async () => {
		const integrator = new IntegratorAPI(config)

		fetch.mockImplementationOnce((_, init) => {
			const headers: Headers = init.headers
			expect(headers.get('ApplicationId')).toBe(config.id)
			return new Response()
		})

		await integrator.version()
	})
	it('should use port 10443 if `https` is set to true', async () => {
		config.https = true
		const integrator = new IntegratorAPI(config)

		fetch.mockImplementationOnce((url) => {
			expect(new URL(url).port).toBe('10443')
			return new Response()
		})

		WebSocket.mockImplementation((url) => {
			expect(new URL(url).port).toBe('10443')
			return { addEventListener: jest.fn() }
		})

		await integrator.version()
		integrator.connectWS(() => {})

		expect.assertions(2)
	})
	it('should use port 10088 if `https` is set to false', async () => {
		config.https = false
		const integrator = new IntegratorAPI(config)

		fetch.mockImplementationOnce((url) => {
			expect(new URL(url).port).toBe('10088')
			return new Response()
		})

		WebSocket.mockImplementation((url) => {
			expect(new URL(url).port).toBe('10088')
			return { addEventListener: jest.fn() }
		})

		await integrator.version()
		integrator.connectWS(() => {})

		expect.assertions(2)
	})
	it('should serialize data to `application/x-www-form-urlencoded` correctly', async () => {
		const integrator = new IntegratorAPI(config)
		const searchBody: Integrator.Search.Body = { query: 'mondago', count: 5 }

		fetch.mockImplementationOnce((_, init) => {
			const body: string = init.body
			expect(body).toBe(`query=${searchBody.query}&count=${searchBody.count}`)
			return new Response()
		})
		await integrator.search(searchBody)
	})
	it('should treat 2xx status codes as OK responses', async () => {
		const integrator = new IntegratorAPI(config)

		fetch.mockImplementationOnce(() => new Response(null, { status: 200 }))
		const res = await integrator.version()

		expect(res.isOk).toBe(true)
		expect('data' in res).toBe(true)
		expect('error' in res).toBe(false)
	})
	it('should treat non-2xx status codes as error responses', async () => {
		const integrator = new IntegratorAPI(config)

		fetch.mockImplementationOnce(() => new Response(null, { status: 400 }))
		const res = await integrator.version()

		expect(res.isOk).toBe(false)
		expect('data' in res).toBe(false)
		expect('error' in res).toBe(true)
	})

	describe('`init` function', () => {
		it('should return `true` when a 204 is returned from `register`', async () => {
			const integrator = new IntegratorAPI(config)

			fetch.mockImplementationOnce(() => new Response(null, { status: 204 }))
			const initialized = await integrator.init()

			expect(initialized).toBe(true)
		})
		it('should return `false` when a 204 is not returned from `register`', async () => {
			const integrator = new IntegratorAPI(config)

			fetch.mockImplementationOnce(() => new Response(null, { status: 400 }))
			const initialized = await integrator.init()

			expect(initialized).toBe(false)
		})
		it('should return `false` when an error is thrown from `register`', async () => {
			const integrator = new IntegratorAPI(config)

			fetch.mockImplementationOnce(() => {
				throw new Error()
			})
			const initialized = await integrator.init()

			expect(initialized).toBe(false)
		})
		it('should set the initialized property', async () => {
			const integrator = new IntegratorAPI(config)

			expect(integrator.initialized).toBe(false)

			fetch.mockImplementationOnce(() => new Response(null, { status: 204 }))
			await integrator.init()

			expect(integrator.initialized).toBe(true)
		})
	})
})
