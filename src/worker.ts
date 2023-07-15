/// <reference lib="deno.worker" />
import { Webview } from '../deps.ts'
import type { MainThreadMessage, WorkerThreadMessage } from './types.ts'

self.postMessage({
	type: 'start',
} as WorkerThreadMessage)

addEventListener('message', ({ data }: MessageEvent<MainThreadMessage>) => {
	console.log(data)
	switch (data.type) {
		case 'terminate':
			self.close()
			break
		case 'execute':
			self.postMessage(execute(data.action))
	}
})

let webview: Webview | undefined

/**
 * It execute a command from the main thread
 * @param  - MainThreadMessage: The message sent from the main thread to the worker thread.
 * @returns The return value of the method or accessor.
 */
function execute(
	{ name, args }: Extract<
		MainThreadMessage,
		{ type: 'execute' }
	>['action'],
): WorkerThreadMessage {
	console.log(name, args)
	if (name === '__constructor__') {
		const [debug, size] = args as ConstructorParameters<
			typeof Webview
		>
		webview ??= new Webview(debug, size)
		return { type: 'result' }
	}
	if (name === 'bind') {
		throw new Error('Not implemented')
	}
	if (name === 'bindRaw') {
		throw new Error('Not implemented')
	}
	if (name === 'destroy') {
		webview?.destroy()
		return { type: 'result' }
	}
	if (name === 'eval') {
		const [source] = args as Parameters<Webview['eval']>
		webview?.eval(source)
		return { type: 'result' }
	}
	if (name === 'init') {
		const [source] = args as Parameters<Webview['init']>
		webview?.init(source)
		return { type: 'result' }
	}
	if (name === 'navigate') {
		const [url] = args as Parameters<Webview['navigate']>
		webview?.navigate(url)
		return { type: 'result' }
	}
	if (name === 'return') {
		const [seq, status, result] = args as Parameters<
			Webview['return']
		>
		webview?.return(seq, status, result)
		return { type: 'result' }
	}
	if (name === 'run') {
		webview?.run()
		return { type: 'result' }
	}
	if (name === 'size') {
		const [size] = args as [Webview['size']] | undefined[]
		if (webview && size) webview.size = size
		return {
			type: 'result',
			return: { name: 'size', value: [webview?.size] },
		}
	}
	if (name === 'title') {
		const [title] = args as [Webview['title']] | undefined[]
		if (webview && title) webview.title = title
		return {
			type: 'result',
			return: { name: 'title', value: [webview?.title] },
		}
	}
	if (name === 'unbind') {
		const [name] = args as Parameters<Webview['unbind']>
		webview?.unbind(name)
		return { type: 'result' }
	}
	if (name === 'unsafeHandle') {
		//Read-only property
		return {
			type: 'result',
			return: {
				name: 'unsafeHandle',
				value: [webview?.unsafeHandle],
			},
		}
	}
	if (name === 'unsafeWindowHandle') {
		//Read-only property
		return {
			type: 'result',
			return: {
				name: 'unsafeWindowHandle',
				value: [webview?.unsafeWindowHandle],
			},
		}
	}
	throw new TypeError(`Unknwon method or accesor [${name}]`)
}
